import { eventEmitter } from "../../utils/eventEmitter";
import { eventType } from "../../utils/utils";
import PlatformSession from "./PlatformSession";
import { GameSession } from "./gameSession";

class SessionManager {
    private platformSessions: Map<string, PlatformSession> = new Map();

    // Start a new platform session when the player connects
    public startPlatformSession(playerId: string, managerName: string, initialCredits: number) {
        const entryTime = new Date();
        const platformSession = new PlatformSession(playerId, entryTime, managerName, initialCredits);
        this.platformSessions.set(playerId, platformSession);

        const playerJoinPlatformEvent = {
            to: platformSession.managerName,
            type: eventType.JOIN_PLATFORM,
            data: {
                username: playerId,
                entryTime,
                credits: initialCredits,
            }
        }

        eventEmitter.emit("platform", playerJoinPlatformEvent);
        console.log(`Platform session started for player: ${playerId}`);
    }

    // End the platform session when the player disconnects
    public endPlatformSession(playerId: string) {
        const platformSession = this.platformSessions.get(playerId);
        if (platformSession) {
            platformSession.setExitTime(new Date());
            this.platformSessions.delete(playerId);

            const playerExitPlatformEvent = {
                to: platformSession.managerName,
                type: eventType.EXIT_PLATFORM,
                data: {
                    username: playerId,
                    entryTime: platformSession.entryTime,
                    exitTime: platformSession.exitTime,
                    credits: platformSession.currentCredits
                }
            }

            eventEmitter.emit("platform", playerExitPlatformEvent);
            console.log(`Platform session ended for player: ${playerId}`);
        }
    }

    // Start a new Game session under the player's paltform session
    public startGameSession(playerId: string, gameId: string, creditsAtEntry: number) {
        const platformSession = this.platformSessions.get(playerId);

        if (platformSession) {
            const gameSession = new GameSession(playerId, gameId, creditsAtEntry);
            platformSession.addGameSession(gameSession);

            const playerEnterGameEvent = {
                to: platformSession.managerName,
                type: eventType.ENTER_GAME,
                data: {
                    username: playerId,
                    gameId: gameId,
                    credits: creditsAtEntry,
                    entryTime: gameSession.entryTime,
                }
            }

            eventEmitter.emit("game", playerEnterGameEvent);
            console.log(`Game session started for player: ${playerId}, game: ${gameId}`);
        } else {
            console.error(`No active platform session found for player: ${playerId}`);
        }
    }

    // Update the credits during the session
    public updateCredits(playerId: string, newCredits: number) {
        const platformSession = this.platformSessions.get(playerId);
        if (platformSession) {
            platformSession.updateCredits(newCredits);

            const currentGameSession = platformSession.getCurrentGameSession();
            if (currentGameSession) {
                currentGameSession.updateCredits(newCredits)
            }
        }

    }

    // End the current game session for the player
    public endGameSession(playerId: string, creditsAtExit: number) {
        const platformSession = this.platformSessions.get(playerId);

        if (platformSession) {
            const currentSession = platformSession.getCurrentGameSession();
            if (currentSession) {
                currentSession.endSession(creditsAtExit);

                const playerExitGameEvent = {
                    to: platformSession.managerName,
                    type: eventType.EXIT_GAME,
                    data: {
                        username: playerId,
                        gameId: currentSession.gameId,
                        credits: creditsAtExit,
                        exitTime: currentSession.exitTime,
                    }
                };

                eventEmitter.emit("game", playerExitGameEvent);
                console.log(`Game session ended for player: ${playerId}, game: ${currentSession.gameId}`);
            }
        } else {
            console.error(`No active platform session or game session found for player: ${playerId}`);
        }
    }

    // Record a spin the current game session
    public recordSpin(playerId: string, betAmount: number, winAmount: number, specialFeatures?: any) {
        const platformSession = this.platformSessions.get(playerId);

        if (platformSession) {
            const currentSession = platformSession.getCurrentGameSession();
            if (currentSession) {
                currentSession.recordSpin(betAmount, winAmount, specialFeatures);
                console.log(`Spin recorded for player: ${playerId}, bet: ${betAmount}, win: ${winAmount}`);
            }
        } else {
            console.error(`No active platform session or game session found for player: ${playerId}`);
        }
    }

    // Get platform session for a player
    public getPlatformSession(playerId: string): PlatformSession | undefined {
        return this.platformSessions.get(playerId);
    }

    public getCurrentGameSession(playerId: string): GameSession | undefined {
        const platformSession = this.platformSessions.get(playerId);
        return platformSession?.getCurrentGameSession();
    }
}

export const sessionManager = new SessionManager();