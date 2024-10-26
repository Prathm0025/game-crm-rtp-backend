export interface IGameSession {
    playerId: string;         // Unique player identifier
    gameId: string;           // Unique game identifier
    sessionId: string;        // Unique session identifier
    entryTime: Date;          // Session start time
    exitTime: Date | null;    // Session end time (null if not ended)
    creditsAtEntry: number;   // Player's credits at the start of the session
    creditsAtExit: number;    // Player's credits at the end of the session
    totalSpins: number;       // Total number of spins in the session
    totalBetAmount: number;   // Total bet amount during the session
    totalWinAmount: number;   // Total win amount during the session
    spinData: ISpinData[];     // Array of individual spin data
    sessionDuration: number;  // Session duration in seconds or minutes
}

export interface ISpinData {
    spinId: string;           // Unique identifier for each spin
    betAmount: number;        // Bet amount for the spin
    winAmount: number;        // Win amount for the spin
    specialFeatures?: ISpecialFeatures; // Optional, only present if triggered
}

export interface ISpecialFeatures {
    jackpot?: IJackpot;        // Jackpot details (optional, if triggered)
    scatter?: IScatter;        // Scatter details (optional, if triggered)
    bonus?: IBonus;            // Bonus game details (optional, if triggered)
}


export interface IJackpot {
    triggered: boolean;       // Whether the jackpot was triggered
    amountWon: number;        // Amount won from the jackpot
}

export interface IScatter {
    triggered: boolean;       // Whether scatter was triggered
    amountWon: number;        // Amount won from the scatter
}

export interface IBonus {
    triggered: boolean;        // Whether a bonus game was triggered
    bonusGameRounds: number;   // Number of bonus rounds played
    totalBonusWin: number;     // Total winnings from the bonus game
}