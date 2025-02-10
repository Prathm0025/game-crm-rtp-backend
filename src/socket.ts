import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "./redisClient"; // Import Redis clients
import { config } from "./config/config";
import { Player as PlayerModel, User } from "./dashboard/users/userModel";
import { sessionManager } from "./dashboard/session/sessionManager";
import Player from "./Player";
import Manager from "./Manager";
import { IUser } from "./dashboard/users/userType";



interface DecodedToken {
    username: string;
    role?: string;
}





const verifySocketToken = (socket: Socket): Promise<DecodedToken> => {
    return new Promise((resolve, reject) => {
        const token = socket.handshake.auth.token;
        if (token) {
            jwt.verify(token, config.jwtSecret, (err, decoded) => {
                if (err) {
                    console.error("❌ Token verification failed:", err.message);
                    reject(new Error("Authentication failed"));
                } else if (!decoded || !decoded.username) {
                    reject(new Error("Token missing required fields"));
                } else {
                    resolve(decoded as DecodedToken);
                }
            });
        } else {
            reject(new Error("No authentication token provided"));
        }
    });
};

const getPlayerDetails = async (username: string) => {
    const player = await PlayerModel.findOne({ username }).populate<{ createdBy: IUser }>("createdBy", "username");
    if (player) {
        return {
            credits: player.credits,
            status: player.status,
            managerName: player.createdBy?.username || null
        };
    }
    throw new Error("Player not found");
};

const getManagerDetails = async (username: string) => {
    const manager = await User.findOne({ username });
    if (manager) {
        return { credits: manager.credits, status: manager.status };
    }
    throw new Error("Manager not found");
};

// Save session data in Redis
const saveSession = async (username: string, socketId: string) => {
    await pubClient.hset(`session:${username}`, { socketId });
};

// Retrieve session data from Redis
const getSession = async (username: string) => {
    return await pubClient.hgetall(`session:${username}`);
};

// Remove session from Redis
const deleteSession = async (username: string) => {
    await pubClient.del(`session:${username}`);
};

const handlePlayerConnection = async (socket: Socket, decoded: DecodedToken, userAgent: string) => {
    const username = decoded.username;
    const platformId = socket.handshake.auth.platformId;
    const origin = socket.handshake.auth.origin;
    const gameId = socket.handshake.auth.gameId;
    const { credits, status, managerName } = await getPlayerDetails(username);

    let existingPlayer = await getSession(username);

    if (existingPlayer?.socketId) {
        console.log(`🔄 Restoring previous session for ${username} on new server instance`);
        socket.emit("sessionRestored", { username });
    }

    await saveSession(username, socket.id);

    // New player connection
    if (origin) {
        const newUser = new Player(username, decoded.role, status, credits, userAgent, socket, managerName);
        newUser.platformData.platformId = platformId;
        newUser.sendAlert(`✅ Player initialized for ${username} on platform ${origin}`, false);
        return;
    }

    socket.emit("error", "Invalid connection attempt.");
    socket.disconnect(true);
};

const handleManagerConnection = async (socket: Socket, decoded: DecodedToken, userAgent: string) => {
    const username = decoded.username;
    const role = decoded.role;
    const { credits } = await getManagerDetails(username);

    console.log(`✅ MANAGER CONNECTED: ${username}`);

    let existingManager = await getSession(username);

    if (existingManager?.socketId) {
        console.log(`🔄 Restoring previous session for manager ${username}`);
        socket.emit("sessionRestored", { username });
    }

    await saveSession(username, socket.id);

    const newManager = new Manager(username, credits, role, userAgent, socket);
    sessionManager.addManager(username, newManager);
    socket.emit("alert", `✅ Manager ${username} connected.`);
};



const socketController = (io: Server) => {
    io.adapter(createAdapter(pubClient, subClient));
    io.use(async (socket: Socket, next) => {
        const userAgent = socket.request.headers["user-agent"];
        try {
            const decoded = await verifySocketToken(socket);
            (socket as any).decoded = { ...decoded };
            (socket as any).userAgent = userAgent; 
            next();
        } catch (error) {
            console.error("❌ Authentication error:", error.message);
            next(error);
        }
    });

    io.on("connection", async (socket) => {
        const instanceId = (socket as any).instanceId;
        const decoded = (socket as any).decoded;
        const userAgent = (socket as any).userAgent;
        const role = decoded.role;

        console.log(`✅ User connected on EC2 instance: ${instanceId} | Role: ${role} | Socket ID: ${socket.id}`);

        try {
            if (role === "player") {
                await handlePlayerConnection(socket, decoded, userAgent);
            } else if (["admin", "supermaster", "master", "distributor", "subdistributor", "store"].includes(role)) {
                await handleManagerConnection(socket, decoded, userAgent);
            } else {
                console.error(`❌ Unsupported role: ${role}`);
                socket.disconnect(true);
            }
        } catch (error) {
            console.error("❌ Connection error:", error.message);
            socket.emit("alert", "ForcedExit");
            socket.disconnect(true);
        }

        socket.on("message", (msg) => {
            console.log(`📨 Message from ${socket.id} on ${instanceId}: ${msg}`);
            io.emit("message", msg); 
        });

        socket.on("disconnect", async () => {
            const username = (socket as any).decoded?.username;
            if (username) {
                console.log(`🔴 User ${username} disconnected from EC2 instance: ${instanceId}`);
                await deleteSession(username);  
            }
        });
    });
};

export default socketController;

