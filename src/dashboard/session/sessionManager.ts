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

        eventEmitter.emit("platform", {
            to: managerName,
            type: eventType.ENTERED_PLATFORM,
            payload: platformSession.getSummary()
        });
        console.log(`Platform session started for player: ${playerId}`);
    }

    // End the platform session when the player disconnects
    public endPlatformSession(playerId: string) {
        const platformSession = this.platformSessions.get(playerId);
        if (platformSession) {
            platformSession.setExitTime(new Date());
            this.platformSessions.delete(playerId);

            eventEmitter.emit("platform", {
                to: platformSession.managerName,
                type: eventType.EXITED_PLATFORM,
                payload: platformSession.getSummary()
            })

            console.log(`Platform session ended for player: ${playerId}`);
        }
    }

    // Start a new Game session under the player's paltform session
    public startGameSession(playerId: string, gameId: string, creditsAtEntry: number) {
        const platformSession = this.platformSessions.get(playerId);
        if (platformSession) {
            platformSession.startNewGameSession(gameId, creditsAtEntry);
            const gameSummary = platformSession.currentGameSession?.getSummary();


            if (gameSummary) {
                eventEmitter.emit("game", {
                    to: platformSession.managerName,
                    type: eventType.ENTERED_GAME,
                    payload: gameSummary
                })
                console.log(`Game session started for player: ${playerId}, game: ${gameId}`);
            } else {
                console.error(`No active platform session found for player: ${playerId}`);
            }
        } else {
            console.error(`No active platform session found for player: ${playerId}`);
        }
    }

    // End the current game session for the player
    public endGameSession(playerId: string, creditsAtExit: number) {
        const platformSession = this.platformSessions.get(playerId);
        if (platformSession) {
            const currentSession = platformSession.currentGameSession;
            if (currentSession) {
                currentSession.endSession(creditsAtExit);
                console.log(`Game session ended for player: ${playerId}, game: ${currentSession.gameId}`);
            }
        } else {
            console.error(`No active platform session or game session found for player: ${playerId}`);
        }
    }

    // Get platform session for a player
    public getPlatformSession(playerId: string): PlatformSession | undefined {
        return this.platformSessions.get(playerId);
    }

    public getCurrentGameSession(playerId: string) {
        return this.platformSessions.get(playerId)?.currentGameSession;
    }
}

export const sessionManager = new SessionManager();