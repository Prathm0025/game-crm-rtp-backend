import { GameData } from "../BaseSlotGame/gameType";
import { WinData } from "../BaseSlotGame/WinData";

interface Symbol {
    Name: string;
    Id: number;
    payout: number;
    reelInstance: { [key: string]: number };
}

export interface FrozenIndex {
    position: [number, number];
    value: number;
  }
export interface SLSMSETTINGS {
    id: string;
    matrix: { x: number, y: number };
    currentGamedata: GameData;
    resultSymbolMatrix: any[];
    tempResultSymbolMatrix:any[];
    lineData: any[],
    _winData: WinData | undefined;
    currentBet: number;
    baseBetAmount:number;
    currentLines: number;
    BetPerLines: number;
    bets: number[];
    reels: any[][];
    Symbols: Symbol[];
    stickyBonusIndex:FrozenIndex[],
    stickySymbolCount: number [],
    stickySymbolCountProb :number [],
    freeSpin: {
        freeSpinCount: number,
        useFreeSpin: boolean,
        freeSpinsAdded: boolean,
    };
    replacedToWildIndices:any[],
    wild: {
        SymbolName: string;
        SymbolID: number;
        useWild: boolean
    },
    bonus:{
        SymbolName: string;
        SymbolID: number;
        useWild: boolean
    },
    stickyBonus:{
        SymbolName: string;
        SymbolID: number;
        useWild: boolean
    },
    mystery:{
        SymbolName: string;
        SymbolID: number;
        useWild: boolean
    },
    moonMystery:{
        SymbolName: string;
        SymbolID: number;
        useWild: boolean
    },
    mini:{
        SymbolName: string;
        SymbolID: number;
        useWild: boolean
    },
    minor:{
        SymbolName: string;
        SymbolID: number;
        useWild: boolean
    },
    major:{    
        SymbolName: string;
        SymbolID: number;
        useWild: boolean
    },
    moon:{    
        SymbolName: string;
        SymbolID: number;
        useWild: boolean
    }
}


export enum specialIcons {
    wild = "Wild",
    bonus = "Bonus",
    stickyBonus = "StickyBonus",
    mystery = "Mystery",
    moonMystery = "MoonMystery",
    mini = "mini",
    minor = "minor",
    major = "major",
    moon = "MOON"
}
