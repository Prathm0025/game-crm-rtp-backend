import { v4 as uuidv4 } from 'uuid';
import { SpecialFeatures, SpinData } from "./activityTypes";

export class GameSession {
    playerId: string;
    gameId: string;
    sessionId: string;
    entryTime: Date;
    exitTime: Date | null = null;
    creditsAtEntry: number;
    creditsAtExit: number = 0;
    currentCredits: number;
    totalSpins: number = 0;
    totalBetAmount: number = 0;
    totalWinAmount: number = 0;
    spinData: SpinData[] = [];
    sessionDuration: number = 0;

    constructor(playerId: string, gameId: string, creditsAtEntry: number) {
        this.playerId = playerId;
        this.gameId = gameId;
        this.sessionId = this.generateSessionId();  // Generate a unique session ID
        this.entryTime = new Date();                // Start the session at current time
        this.creditsAtEntry = creditsAtEntry;
    }

    // Generate a unique ID
    private generateSessionId(): string {
        return `${this.playerId}-${this.gameId}-${Date.now()}`;
    }

    // Generate a unique ID for each spin
    private generateSpinId(): string {
        return `${this.gameId}-${Date.now()}-${uuidv4()}`;  // Use UUID and timestamp for uniqueness
    }

    public updateCredits(newCredits: number) {
        this.currentCredits = newCredits;
    }

    // Record a spin
    public recordSpin(betAmount: number, winAmount: number, specialFeatures?: SpecialFeatures) {
        const spinId = this.generateSpinId();  // Generate spin ID internally
        const spin: SpinData = {
            spinId,
            betAmount,
            winAmount,
            specialFeatures
        };

        // Add the spin data to the session
        this.spinData.push(spin);

        // Increment spin counters
        this.totalSpins++;
        this.totalBetAmount += betAmount;

        // Add the win amount, even if it’s zero (lost bet)
        this.totalWinAmount += winAmount;

        console.log(`Spin recorded: Bet: ${betAmount}, Win: ${winAmount}, Special Features: ${specialFeatures ? JSON.stringify(specialFeatures) : 'None'}`);
    }

    // Tigger game exit and finalize session details
    public endSession(creditsAtExit: number) {
        this.exitTime = new Date();
        this.creditsAtExit = creditsAtExit;
        this.sessionDuration = (this.exitTime.getTime() - this.entryTime.getTime()) / 1000;
    }

    // Get a summary of the session
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