import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { Player as PlayerModel, User } from "./dashboard/users/userModel";
import { config } from "./config/config";
import Player from "./Player";
import createHttpError from "http-errors";
import { messageType } from "./game/Utils/gameUtils";
import Manager from "./Manager";
import { sessionManager } from "./dashboard/session/sessionManager";


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

const getPlayerDetails = async (username: string) => {
    const player = await PlayerModel.findOne({ username });
    if (player) {
        return { credits: player.credits, status: player.status };
    }
    throw new Error("Player not found");
};

const getManagerDetails = async (username: string) => {
    const manager = await User.findOne({ username });
    if (manager) {
        return { credits: manager.credits, status: manager.status }
    }
    throw new Error("Manager not found");

}

const handlePlayerConnection = async (socket: Socket, decoded: DecodedToken, userAgent: string) => {
    const username = decoded.username;
    const origin = socket.handshake.auth.origin;
    const gameId = socket.handshake.auth.gameId;
    const { credits, status } = await getPlayerDetails(decoded.username);

    let existingPlayer = currentActivePlayers.get(username);

    if (existingPlayer) {
        if (existingPlayer.playerData.userAgent !== userAgent) {
            socket.emit("AnotherDevice", "You are already playing on another browser.");
            socket.disconnect(true);
            throw createHttpError(403, "Already playing on another device");
        }

        // Check for platform reconnection
        if (origin) {
            if (existingPlayer.platformData.socket && existingPlayer.platformData.socket.connected) {
                socket.emit("alert", "Platform already connected. Please disconnect the other session.");
                socket.disconnect(true);
                return;
            } else {
                console.log("Reinitializing platform connection");
                existingPlayer.initializePlatformSocket(socket);
                existingPlayer.sendAlert(`Platform reconnected for ${username}`, false);
                return;
            }
        }

        // Check for game connection, ensuring platform is ready
        if (gameId) {
            if (!existingPlayer.platformData.socket || !existingPlayer.platformData.socket.connected) {
                console.log("Platform connection required before joining a game.");
                socket.emit(messageType.ERROR, "Platform connection required before joining a game.");
                socket.disconnect(true);
                return;
            }

            console.log("Game connection attempt detected, ensuring platform stability");
            await existingPlayer.updateGameSocket(socket);
            existingPlayer.sendAlert(`Game initialized for ${username} in game ${gameId}`);
            return;
        }
    }

    // New connection handling with delay-based retry for stability
    if (origin) {
        console.log("New platform connection detected, initializing player");
        const newUser = new Player(username, decoded.role, status, credits, userAgent, socket);
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
    const { credits } = await getManagerDetails(username);

    let existingManager = currentActiveManagers.get(username);

    if (existingManager) {
        console.log(`Reinitializing manager ${username}`);

        if (existingManager.socketData.reconnectionTimeout) {
            clearTimeout(existingManager.socketData.reconnectionTimeout);
        }

        existingManager.initializeManager(socket);
        socket.emit(messageType.ALERT, `Manager ${username} has been reconnected.`);
    } else {
        const newManager = new Manager(username, credits, role, userAgent, socket);
        currentActiveManagers.set(username, newManager);
        socket.emit(messageType.ALERT, `Manager ${username} has been connected.`);
    }

    // Send all active players to the manager upon connection
    const activeUsersData = Array.from(currentActivePlayers.values()).map(player => {
        const platformSession = sessionManager.getPlatformSession(player.playerData.username);
        return platformSession?.getSummary() || {};
    });

    socket.emit("activePlayers", activeUsersData);
};


const socketController = (io: Server) => {

    // Token verification middleware
    io.use(async (socket: Socket, next: (err?: Error) => void) => {
        const userAgent = socket.request.headers['user-agent'];
        try {
            const decoded = await verifySocketToken(socket);
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
            socket.emit("alert", "ForcedExit");
            socket.disconnect(true);

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
