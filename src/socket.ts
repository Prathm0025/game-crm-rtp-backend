import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { Player as PlayerModel } from "./dashboard/users/userModel";
import { config } from "./config/config";
import Player from "./Player";
import createHttpError from "http-errors";
import { messageType } from "./game/Utils/gameUtils";
import Manager from "./Manager";


interface DecodedToken {
    username: string;
    role?: string;
}

export let currentActivePlayers: Map<string, Player> = new Map();
export let currentActiveManagers: Map<string, Manager> = new Map();


const verifySocketToken = (socket: Socket): Promise<DecodedToken> => {
    return new Promise((resolve, reject) => {
        const token = socket.handshake.auth.token;
        if (token) {
            jwt.verify(token, config.jwtSecret, (err, decoded) => {
                if (err) {
                    console.error("Token verification failed:", err.message);
                    reject(new Error("You are not authenticated"));
                } else if (!decoded || !decoded.username) {
                    reject(new Error("Token does not contain required fields"));
                } else {
                    resolve(decoded as DecodedToken);
                }
            });
        } else {
            reject(new Error("No authentication token provided"));
        }
    });
};

const getPlayerCredits = async (username: string): Promise<number> => {
    const player = await PlayerModel.findOne({ username });
    if (player) {
        return player.credits;
    }
    throw new Error("User not found");
};

const handlePlayerConnection = async (socket: Socket, decoded: DecodedToken, userAgent: string) => {
    const username = decoded.username;
    const origin = socket.handshake.auth.origin;
    const gameId = socket.handshake.auth.gameId;
    const credits = await getPlayerCredits(decoded.username)

    let existingPlayer = currentActivePlayers.get(username);

    if (existingPlayer) {
        if (existingPlayer.playerData.userAgent !== userAgent) {
            socket.emit("AnotherDevice", "You are already playing on another browser.");
            socket.disconnect(true);
            throw createHttpError(403, "Already playing on another device");
        }

        // Handle platform reconnections
        if (origin) {
            if (existingPlayer.platformData.socket && existingPlayer.platformData.socket.connected) {
                socket.emit("alert", "Platform already connected. Please disconnect the other session.");
                socket.disconnect(true);
                return;
            } else {
                existingPlayer.initializePlatformSocket(socket);
                existingPlayer.sendAlert(`Platform reconnected for ${username}`, false);
                return;
            }
        }

        // Handle game connections
        if (gameId) {
            if (!existingPlayer.platformData.socket) {
                socket.emit(messageType.ERROR, "You need to have an active platform connection before joining a game.");
                socket.disconnect(true);
                return;
            }

            await existingPlayer.updateGameSocket(socket);
            existingPlayer.sendAlert(`Game initialized for ${username} in game ${gameId}`);
            return;
        }
    }
    // If no existing user, this is a new connection
    if (origin) {
        const newUser = new Player(username, decoded.role, credits, userAgent, socket);
        currentActivePlayers.set(username, newUser);
        newUser.sendAlert(`Player initialized for ${newUser.playerData.username} on platform ${origin}`, false);
    } else {
        socket.emit(messageType.ERROR, "You need to have an active platform connection before joining a game.");
        socket.disconnect(true);
    }
};

const handleManagerConnection = async (socket: Socket, decoded: DecodedToken, userAgent: string) => {
    const username = decoded.username;
    const role = decoded.role

    let existingManager = currentActiveManagers.get(username);

    if (existingManager) {
        if (existingManager.socket.connected) {
            socket.emit("AnotherDevice", "You are already managing on another browser.");
            socket.disconnect(true);
            return;
        }

        console.log(`Manager ${username} is reconnecting.`);
        existingManager.socket = socket;
        existingManager.userAgent = userAgent;
        socket.emit(messageType.ALERT, `Manager ${username} has been reconnected.`);
    } else {
        const newManager = new Manager(username, role, userAgent, socket);
        currentActiveManagers.set(username, newManager);
        socket.emit(messageType.ALERT, `Manager ${username} has been connected.`);
    }


    // Send All active players to the manager upon connection
    const activeUsersData = Array.from(currentActivePlayers.values()).map(player => ({
        username: player.playerData.username,
        credits: player.playerData.credits,
        currentGame: player.currentGameData.gameId || "No Active Game",
    }))

    socket.emit("activeUsers", activeUsersData);
};


const socketController = (io: Server) => {

    // Token verification middleware
    io.use(async (socket: Socket, next: (err?: Error) => void) => {
        const userAgent = socket.request.headers['user-agent'];
        try {
            const decoded = await verifySocketToken(socket);
            console.log("Decoded : ", decoded);


            (socket as any).decoded = { ...decoded };
            (socket as any).userAgent = userAgent;
            next();
        } catch (error) {
            console.error("Authentication error:", error.message);
            next(error);
        }
    });

    io.on("connection", async (socket) => {
        try {
            const decoded = (socket as any).decoded;
            const userAgent = (socket as any).userAgent;
            const role = decoded.role;


            if (role === "player") {
                await handlePlayerConnection(socket, decoded, userAgent);
            } else if (['company', 'master', 'distributor', 'subdistributor', 'store'].includes(role)) {
                await handleManagerConnection(socket, decoded, userAgent)
            } else {
                console.error("Unsupported role : ", role);
                socket.disconnect(true);
            }

        } catch (error) {
            console.error("An error occurred during socket connection:", error.message);
            if (socket.connected) {
                socket.disconnect(true);
            }
        }
    });


    // Error handling middleware
    io.use((socket: Socket, next: (err?: Error) => void) => {
        socket.on('error', (err: Error) => {
            console.error('Socket Error:', err);
            socket.disconnect(true);
        });
        next();
    });
};

export default socketController;
