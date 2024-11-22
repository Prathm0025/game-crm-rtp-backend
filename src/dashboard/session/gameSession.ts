import { v4 as uuidv4 } from "uuid";
import { EventEmitter } from "events";
import { ISpinData } from "./sessionTypes";

export class GameSession extends EventEmitter {
    playerId: string;
    gameId: string;
    sessionId: string;
    entryTime: Date;
    exitTime: Date | null = null;
    creditsAtEntry: number;
    creditsAtExit: number = 0;
    totalSpins: number = 0;
    totalBetAmount: number = 0;
    totalWinAmount: number = 0;
    spinData: ISpinData[] = [];
    sessionDuration: number = 0;


    constructor(playerId: string, gameId: string, creditsAtEntry: number) {
        super();
        this.playerId = playerId;
        this.gameId = gameId;
        this.sessionId = this.generateSessionId();
        this.entryTime = new Date();
        this.creditsAtEntry = creditsAtEntry;
    }

    private generateSessionId(): string {
        return `${this.playerId}-${this.gameId}-${Date.now()}`;
    }

    public createSpin(): string {
        const spinId = `${this.gameId}-${Date.now()}-${uuidv4()}`;
        const newSpin: ISpinData = { spinId, betAmount: 0, winAmount: 0 };
        this.spinData.push(newSpin);
        this.totalSpins++;

        this.emit("spinCreated", newSpin);
        return spinId;
    }

    public updateSpinField<T extends keyof ISpinData>(spinId: string, field: T, value: ISpinData[T]): boolean {
        const spin = this.getSpinById(spinId);
        if (spin) {
            spin[field] = value;

            if (field === "betAmount") this.totalBetAmount += value as number;
            if (field === "winAmount") this.totalWinAmount += value as number;

            this.emit("spinUpdated", this.getSummary());
            return true;
        }
        return false;
    }

    public endSession(creditsAtExit: number) {
        this.exitTime = new Date();
        this.creditsAtExit = creditsAtExit;
        this.sessionDuration = (this.exitTime.getTime() - this.entryTime.getTime()) / 1000;

        this.emit("sessionEnded", this.getSummary());
    }

    public getSummary() {
        return {
            playerId: this.playerId,
            gameId: this.gameId,
            sessionId: this.sessionId,
            entryTime: this.entryTime,
            exitTime: this.exitTime,
            creditsAtEntry: this.creditsAtEntry,
            creditsAtExit: this.creditsAtExit,
            totalSpins: this.totalSpins,
            totalBetAmount: this.totalBetAmount,
            totalWinAmount: this.totalWinAmount,
            spinData: this.spinData,
            sessionDuration: this.sessionDuration,
        };
    }

    private getSpinById(spinId: string): ISpinData | undefined {
        return this.spinData.find((spin) => spin.spinId === spinId);
    }
}