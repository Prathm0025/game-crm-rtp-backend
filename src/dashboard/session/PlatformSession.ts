import { GameSession } from "./gameSession";

export default class PlatformSession {
    playerId: string;
    entryTime: Date;
    exitTime: Date | null = null;
    managerName: string;
    currentCredits: number;
    private gameSessions: GameSession[] = []

    constructor(playerId: string, entryTime: Date, managerName: string, initialCredits: number) {
        this.playerId = playerId;
        this.entryTime = entryTime;
        this.managerName = managerName;
        this.currentCredits = initialCredits;
    }

    // Set platform exit time
    setExitTime(exitTime: Date) {
        this.exitTime = exitTime
    }

    public updateCredits(newCredits: number) {
        this.currentCredits = newCredits;
    }

    // Add a new game session
    addGameSession(session: GameSession) {
        this.gameSessions.push(session);
    }

    // Get the current game session
    getCurrentGameSession(): GameSession | undefined {
        return this.gameSessions.length > 0 ? this.gameSessions[this.gameSessions.length - 1] : undefined;
    }

    // Get all game sessions
    getAllGameSessions(): GameSession[] {
        return this.gameSessions;
    }
}

