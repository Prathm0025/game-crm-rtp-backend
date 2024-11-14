import { GameData } from "../BaseSlotGame/gameType";
import { WinData } from "../BaseSlotGame/WinData";

interface Symbol {
    Name: string;
    Id: number;
    payout: number;
    reelInstance: { [key: string]: number };
}
export interface ZEUSSETTINGS {
    id: string;
    matrix: { x: number, y: number };
    currentGamedata: GameData;
    resultSymbolMatrix: any[];
    lineData: any[],
    _winData: WinData | undefined;
    currentBet: number;
    baseBetAmount:number;
    currentLines: number;
    BetPerLines: number;
    bets: number[];
    reels: any[][];
    Symbols: Symbol[];
    lastReel: any[],
    tempReel: any[],
    firstReel: any[],
    tempReelSym: any[],
    freeSpinData: any[][],
    freeSpin: {
        symbolID: string,
        freeSpinMuiltiplier: any[],
        freeSpinStarted: boolean,
        freeSpinCount: number,
        noOfFreeSpins: number,
        useFreeSpin: boolean,
        freeSpinsAdded: boolean,
    };
    replacedToWildIndices:any[],
    wild: {
        SymbolName: string;
        SymbolID: number;
        useWild: boolean
    },
    scatter:{
        symbolID:number;
        useScatter:boolean;
    }
}


export enum specialIcons {
    wild = "Wild",
    FreeSpin = "FreeSpin",
    scatter =  "Scatter"
}