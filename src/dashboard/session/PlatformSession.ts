import { GameSession } from "./gameSession";
import { eventEmitter } from "../../utils/eventEmitter";
import { eventType } from "../../utils/utils";

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

    public startNewGameSession(gameId: string, creditsAtEntry: number) {
        const gameSession = new GameSession(this.playerId, gameId, creditsAtEntry);
        this.currentGameSession = gameSession;

        // Listen to events from GameSession and emit higher-level events
        gameSession.on("spinUpdated", (summary) => {
            eventEmitter.emit("game", { to: this.managerName, type: eventType.UPDATED_SPIN, payload: summary });
        });

        gameSession.on("sessionEnded", (summary) => {
            eventEmitter.emit("game", { to: this.managerName, type: eventType.EXITED_GAME, payload: summary });
        });
    }

    public updateCredits(newCredits: number) {
        this.currentCredits = newCredits;
    }

    public setExitTime(exitTime: Date) {
        this.exitTime = exitTime;
    }

    public getSummary() {
        return {
            playerId: this.playerId,
            managerName: this.managerName,
            initialCredits: this.initialCredits,
            currentCredits: this.currentCredits,
            entryTime: this.entryTime,
            exitTime: this.exitTime,
            currentRTP: this.rtp,
            currentGame: this.currentGameSession?.getSummary() || null,
        };
    }
}