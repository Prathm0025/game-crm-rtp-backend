import Manager from "../../Manager";
import PlayerSocket from "../../Player";
import { eventType } from "../../utils/utils";
import { GameSession } from "./gameSession";
import { PlatformSessionModel } from "./sessionModel";

export let currentActiveManagers: Map<string, Manager> = new Map();


class SessionManager {
    private platformSessions: Map<string, PlayerSocket> = new Map();

    public async startPlatformSession(player: PlayerSocket) {
        this.platformSessions.set(player.playerData.username, player);

        try {
            const platformSessionData = new PlatformSessionModel(player.getSummary())
            await platformSessionData.save();
        } catch (error) {
            console.error(`Failed to save platform session for player: ${player.playerData.username}`, error);
        }
    }

    public async endPlatformSession(playerId: string) {
        const platformSession = this.getPlayerPlatform(playerId)
        if (platformSession) {
            platformSession.setExitTime();
            this.platformSessions.delete(playerId);

            const currentManager = currentActiveManagers.get(platformSession.managerName);
            if (currentManager) {
                currentManager.notifyManager({ type: eventType.EXITED_PLATFORM, payload: platformSession.getSummary() })
            }

            try {
                await PlatformSessionModel.updateOne(
                    { playerId: playerId, entryTime: platformSession.entryTime },
                    { $set: { exitTime: platformSession.exitTime } }
                )
            } catch (error) {
                console.error(`Failed to save platform session for player: ${playerId}`, error);

            }

        }
    }

    public async startGameSession(playerId: string, gameId: string, credits: number) {
        const platformSession = this.getPlayerPlatform(playerId);
        if (platformSession) {
            platformSession.currentGameSession = new GameSession(playerId, gameId, credits);

            platformSession.currentGameSession.on("spinUpdated", (summary) => {
                const currentManager = currentActiveManagers.get(platformSession.managerName);
                if (currentManager) {
                    currentManager.notifyManager({ type: eventType.UPDATED_SPIN, payload: summary })
                }
            });

            platformSession.currentGameSession.on("sessionEnded", (summary) => {
                const currentManager = currentActiveManagers.get(platformSession.managerName);
                if (currentManager) {
                    currentManager.notifyManager({ type: eventType.EXITED_GAME, payload: summary })
                }
            });

            const gameSummary = platformSession.currentGameSession?.getSummary();

            if (gameSummary) {
                const currentManager = currentActiveManagers.get(platformSession.managerName);
                if (currentManager) {
                    currentManager.notifyManager({ type: eventType.ENTERED_GAME, payload: gameSummary });
                }
            } else {
                console.error(`No active platform session found for player: ${playerId}`);
            }
        } else {
            console.error(`No active platform session found for player: ${playerId}`);
        }
    }

    public async endGameSession(playerId: string, credits: number) {
        const platformSession = this.getPlayerPlatform(playerId);
        if (platformSession) {
            const currentSession = platformSession.currentGameSession;
            if (currentSession) {
                currentSession.endSession(credits);
                const gameSessionData = currentSession.getSummary();

                try {
                    await PlatformSessionModel.updateOne(
                        { playerId: playerId, entryTime: platformSession.entryTime },
                        { $push: { gameSessions: gameSessionData }, $set: { currentRTP: platformSession.currentRTP } }
                    );
                } catch (error) {
                    console.error(`Failed to save game session for player: ${playerId}`, error);
                }
            } else {
                console.error(`No Active Game found for : ${playerId}`)
            }
        } else {
            console.error(`No active platform session or game session found for player: ${playerId}`);
        }
    }

    public getPlayerPlatform(username: string): PlayerSocket | null {
        if (this.platformSessions.has(username)) {
            return this.platformSessions.get(username) || null
        }
        return null
    }

    public getPlatformSessions(): Map<string, PlayerSocket> {
        return this.platformSessions;
    }

    public getPlayerCurrentGameSession(username: string) {
        return this.getPlayerPlatform(username)?.currentGameSession;
    }
}

export const sessionManager = new SessionManager();