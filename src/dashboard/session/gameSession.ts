import { v4 as uuidv4 } from 'uuid';
import {  SpinData } from "./activityTypes";

export class GameSession {
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
    spinData: SpinData[] = [];
    sessionDuration: number = 0;

    constructor(playerId: string, gameId: string, creditsAtEntry: number) {
        this.playerId = playerId;
        this.gameId = gameId;
        this.sessionId = this.generateSessionId();
        this.entryTime = new Date();
        this.creditsAtEntry = creditsAtEntry;
    }

    private generateSessionId(): string {
        return `${this.playerId}-${this.gameId}-${Date.now()}`;
    }

    private generateSpinId(): string {
        return `${this.gameId}-${Date.now()}-${uuidv4()}`;
    }

    public createSpin(): string {
        const spinId = this.generateSpinId();  
        const newSpin: SpinData = {
            spinId,
            betAmount: 0,
            winAmount: 0
        };
        this.spinData.push(newSpin);
        this.totalSpins++;
        return spinId;
    }

    public updateSpinField<T extends keyof SpinData>(spinId: string, field: T, value: SpinData[T]): boolean {
        const spin = this.getSpinById(spinId);
        if (spin) {
            spin[field] = value;

            // If betAmount or winAmount is updated, adjust totals accordingly
            if (field === 'betAmount') {
                this.totalBetAmount += value as number;
            } else if (field === 'winAmount') {
                this.totalWinAmount += value as number;
            }

            return true;
        }
        return false;
    }

    public getSpinById(spinId: string): SpinData | undefined {
        return this.spinData.find(spin => spin.spinId === spinId);
    }

    public endSession(creditsAtExit: number) {
        this.exitTime = new Date();
        this.creditsAtExit = creditsAtExit;
        this.sessionDuration = (this.exitTime.getTime() - this.entryTime.getTime()) / 1000;

        console.log(this.getSessionSummary())
    }

    public getSessionSummary(): object {
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
            sessionDuration: this.sessionDuration
        }
    }
}