import { GameSession } from "./gameSession";

export default class PlatformSession {
    playerId: string;
    managerName: string;
    initialCredits: number;
    currentCredits: number;
    entryTime: Date;
    exitTime: Date | null = null;
    rtp: number = 0;
    currentGameSession: GameSession | null = null;

    constructor(playerId: string, entryTime: Date, managerName: string, initialCredits: number) {
        this.playerId = playerId;
        this.managerName = managerName;
        this.initialCredits = initialCredits;
        this.currentCredits = initialCredits;
        this.entryTime = entryTime;
    }

    public updateRTP(rtp: number): void {
        this.rtp = rtp;
    }

    public getCurrentRTP(): number {
        return this.rtp;
    }

    public updateCredits(newCredits: number) {
        this.currentCredits = newCredits;
    }

    public addGameSession(gameSession: GameSession) {
        this.currentGameSession = gameSession;
    }

    public setExitTime(exitTime: Date) {
        this.exitTime = exitTime;
    }

    public getCurrentGameSession(): GameSession | null {
        return this.currentGameSession;
    }

    logSummary() {
        console.log("Session Summary for: ", this.playerId);
        console.log("Manager : ", this.managerName);
        console.log("initial credits ; ", this.initialCredits);
        console.log("current credit : ", this.currentCredits);
        console.log("entry time :", this.entryTime);
        console.log("exit time :", this.exitTime);
        console.log("rtp : ", this.rtp)
    }
}