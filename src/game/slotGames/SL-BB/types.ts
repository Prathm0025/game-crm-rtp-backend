import { GameData } from "../BaseSlotGame/gameType";
import { WinData } from "../BaseSlotGame/WinData";

export type Symbol = {
    Name: string; // The name of the symbol
    Id: number; // Unique identifier for the symbol
    reelInstance: {
      [key: number]: number; // Reel instances where the key is the reel index and the value is the count of symbols
    };
    useWildSub: boolean; // Indicates if the symbol can substitute for other symbols (wild symbol)
    multiplier: [number, number][]; // An array of multipliers, where each entry is a tuple [multiplier, additionalValue]
  };
  
export  interface SLBBSETTINGS {
    id: string;
    matrix: { x: number, y: number };
    currentGamedata: GameData;
    resultSymbolMatrix: any[];
    lineData: any[],
    _winData: WinData | undefined;
    currentBet: number;
    currentLines: number;
    BetPerLines: number;
    bets: number[];
    reels: any[][];
    Symbols: Symbol[];
    hasCascading: boolean,
    cascadingNo: number,
    payoutAfterCascading: number,
    cascadingResult: any[];
    lastReel: any[],
    tempReel: any[],
    firstReel: any[],
    tempReelSym: any[],
    freeSpinData: any[][],
    jackpot: {
        symbolName: string;
        symbolsCount: number;
        symbolId: number;
        defaultAmount: number;
        increaseValue: number;
        useJackpot: boolean;
    },
    freeSpin: {
        symbolID: string,
        freeSpinMuiltiplier: any[],
        freeSpinStarted: boolean,
        freeSpinCount: number,
        noOfFreeSpins: number,
        useFreeSpin: boolean,
        freeSpinsAdded: boolean,
    };
    wild: {
        SymbolName: string;
        SymbolID: number;
        useWild: boolean
    };
    link: {
        SymbolName: string;
        SymbolID: number;
        useWild: boolean;
    };
    megalink: {
        SymbolName: string;
        SymbolID: number;
        useWild: boolean;

    };
    cashCollect: {
        SymbolName: string;
        SymbolID: string;
        useWild: boolean;
    };
    coins: {
        SymbolName: string;
        SymbolID: string;
        useWild: boolean;
    };
    prizeCoin: {
        SymbolName: string;
        SymbolID: string;
        useWild: boolean;
    };
    losPollos: {
        SymbolName: string;
        SymbolID: string;
        useWild: boolean;
    };
    heisenberg:{
        isTriggered:boolean;
        payout:number;
    };
    cashCollectPrize:{
        isTriggered:boolean,
        payout:number,
      }
}