import { currentActiveManagers } from "../../socket";
import { eventType } from "../../utils/utils";
import PlatformSession from "./PlatformSession";
import { GameSession } from "./gameSession";
import { PlatformSessionModel } from "./sessionModel";

class SessionManager {
    private platformSessions: Map<string, PlatformSession> = new Map();

    // Start a new platform session when the player connects
    public async startPlatformSession(playerId: string, status: string, managerName: string, initialCredits: number) {
        const entryTime = new Date();
        const platformSession = new PlatformSession(playerId, status, entryTime, managerName, initialCredits);
        this.platformSessions.set(playerId, platformSession);

        try {
            const platformSessionData = new PlatformSessionModel(platformSession.getSummary());
            await platformSessionData.save();
            console.log(`Platform session started and saved for player: ${playerId}`);
        } catch (error) {
            console.error(`Failed to save platform session for player: ${playerId}`, error);
        }


        const currentManager = currentActiveManagers.get(managerName);
        if (currentManager) {
            currentManager.notifyManager({ type: eventType.ENTERED_PLATFORM, payload: platformSession.getSummary() });
        }

        console.log(`Platform session started for player: ${playerId}`);
    }

    // End the platform session when the player disconnects
    public async endPlatformSession(playerId: string) {
        const platformSession = this.platformSessions.get(playerId);
        if (platformSession) {
            platformSession.setExitTime(new Date());
            this.platformSessions.delete(playerId);

            const currentManager = currentActiveManagers.get(platformSession.managerName);
            if (currentManager) {
                currentManager.notifyManager({ type: eventType.EXITED_PLATFORM, payload: platformSession.getSummary() })

            }

            console.log(`Platform session ended for player: ${playerId}`);

            try {
                await PlatformSessionModel.updateOne(
                    { playerId: playerId, entryTime: platformSession.entryTime },
                    { $set: { exitTime: platformSession.exitTime } }
                )
                console.log(`Platform session saved to database for player: ${playerId}`);
            } catch (error) {
                console.error(`Failed to save platform session for player: ${playerId}`, error);
            }
        }
        else {
            console.error(`No active platform session found for player: ${playerId}`);
        }
    }

    // Start a new Game session under the player's paltform session
    public startGameSession(playerId: string, gameId: string, creditsAtEntry: number) {
        const platformSession = this.platformSessions.get(playerId);
        if (platformSession) {
            platformSession.startNewGameSession(gameId, creditsAtEntry);
            const gameSummary = platformSession.currentGameSession?.getSummary();


            if (gameSummary) {

                const currentManager = currentActiveManagers.get(platformSession.managerName);
                if (currentManager) {
                    currentManager.notifyManager({ type: eventType.ENTERED_GAME, payload: gameSummary });
                }

                console.log(`Game session started for player: ${playerId}, game: ${gameId}`);
            } else {
                console.error(`No active platform session found for player: ${playerId}`);
            }
        } else {
            console.error(`No active platform session found for player: ${playerId}`);
        }
    }

    // End the current game session for the player
    public async endGameSession(playerId: string, creditsAtExit: number) {
        const platformSession = this.platformSessions.get(playerId);
        if (platformSession) {
            const currentSession = platformSession.currentGameSession;
            if (currentSession) {
                currentSession.endSession(creditsAtExit);
                const gameSessionData = currentSession.getSummary();

                console.log(`Game session ended for player: ${playerId}, game: ${currentSession.gameId}`);

                try {
                    await PlatformSessionModel.updateOne(
                        { playerId: playerId, entryTime: platformSession.entryTime },
                        { $push: { gameSessions: gameSessionData }, $set: { currentRTP: platformSession.rtp } }
                    );
                    console.log(`Game session saved to platform session for player: ${playerId}`);

                } catch (error) {
                    console.error(`Failed to save game session for player: ${playerId}`, error);
                }
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