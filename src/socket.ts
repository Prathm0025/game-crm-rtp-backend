import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "./redisClient";
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
const saveSession = async (username: string, socket: Socket, platformId: string, credits: number) => {
    await pubClient.hset(`session:${username}`, {
        socketId: socket.id,
        platformId: platformId,
        credits: credits
    });
    await pubClient.expire(`session:${username}`, 86400);
};




// Retrieve session data from Redis
const getSession = async (username: string) => {
    const session = await pubClient.hgetall(`session:${username}`);
    console.log(session, 'session');
    return session && Object.keys(session).length ? session : null;
};

// Remove session from Redis
const deleteSession = async (username: string) => {
    await pubClient.del(`session:${username}`);
};

const handlePlayerConnection = async (socket: Socket, decoded: DecodedToken, userAgent: string) => {
    const username = decoded.username;
    const { credits, status, managerName } = await getPlayerDetails(username);

    // Fetch the existing session from Redis
    const existingSession = await getSession(username);

    if (existingSession?.socketId) {
        console.log(`🔄 Restoring previous session for ${username} on new server instance`);

        // Create the player instance
        const playerInstance = new Player(username, decoded.role, status, credits, userAgent, socket, managerName);

        // Check and restore platformData if it exists in the session
        if (playerInstance.platformData) {
            playerInstance.platformData.platformId = existingSession.platformId || socket.handshake.auth.platformId;
            playerInstance.platformData.socket = socket;  // Ensure the socket is updated
            console.log(`✅ Platform data restored for ${username}:`, playerInstance.platformData);
        } else {
            console.error(`❌ platformData is undefined while restoring session for ${username}`);
        }

        playerInstance.sendAlert(`✅ Player session restored for ${username}`, false);
        return;
    }

    // Save the new session in Redis, including platformId
    await saveSession(username, socket, socket.handshake.auth.platformId, credits);

    // Create a new player instance if no existing session is found
    const newUser = new Player(username, decoded.role, status, credits, userAgent, socket, managerName);
    newUser.platformData.platformId = socket.handshake.auth.platformId;
    newUser.sendAlert(`✅ Player initialized for ${username}`, false);
};



const handleManagerConnection = async (socket: Socket, decoded: DecodedToken, userAgent: string) => {
    const username = decoded.username;
    const role = decoded.role;
    const { credits } = await getManagerDetails(username);

    console.log(`✅ MANAGER CONNECTED: ${username}`);

    const existingSession = await getSession(username);

    if (existingSession?.socketId) {
        console.log(`🔄 Restoring previous session for manager ${username}`);
        socket.emit("sessionRestored", { username });
    }

    await saveSession(username, socket, socket.handshake.auth.platformId, credits);

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
        const decoded = (socket as any).decoded;
        const userAgent = (socket as any).userAgent;
        const role = decoded.role;

        console.log(`✅ User connected | Role: ${role} | Socket ID: ${socket.id} | Connected on Port: ${config.port}`);

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
            console.log(`📨 Message from ${socket.id}: ${msg}`);
            io.emit("message", msg);
        });

        socket.on("disconnect", async () => {
            const username = (socket as any).decoded?.username;
            if (username) {
                console.log(`🔴 User ${username} disconnected`);
                // await deleteSession(username);
            }
        });
    });
};

export default socketController;

