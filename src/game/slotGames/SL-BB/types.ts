import { GameData } from "../BaseSlotGame/gameType";
import { WinData } from "../BaseSlotGame/WinData";

export interface Symbol {
  Name: string;
  Id: number;
  payout: string;
  canCallRedSpin: boolean;
  canCallRespin: boolean;
  reelInstance: { [key: string]: number };
}

export type valueType = {
  index: [number, number],
  value: number
}


export interface SLBBSETTINGS {
  id: string;
  matrix: { x: number, y: number };
  currentGamedata: GameData;
  resultSymbolMatrix: any[];
  prevresultSymbolMatrix: any[];
  heisenbergSymbolMatrix: any[];
  frozenIndices: Set<string>; // Changed to Set<string>
  lineData: any[],
  _winData: WinData | undefined;
  currentBet: number;
  currentLines: number;
  BetPerLines: number;
  bets: number[];
  reels: any[][];
  heisenbergReels: any[][],
  Symbols: Symbol[];
  jackpot: {
    isTriggered:boolean,
    payout:number
  },
  freeSpin: {
    // symbolID: string,
    freeSpinCount: number,
    isFreeSpin: boolean,
    cashCollectValues : valueType[]
  };
  wild: {
    SymbolName: string;
    SymbolID: number;
    useWild: boolean
  };
  link: {
    SymbolName: string;
    SymbolID: string;
    useWild: boolean;
  };
  megalink: {
    SymbolName: string;
    SymbolID: string;
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
    values: valueType[]
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
    values: valueType[]
  };
  heisenberg: {
    isTriggered: boolean;
    freeSpin: {
      freeSpinStarted: boolean,
      freeSpinsAdded: boolean,
      freeSpinCount: number,
      noOfFreeSpins: number,
      // useFreeSpin: false,
    };
    payout: number;
  };
  cashCollectPrize: {
    isTriggered: boolean,
    payout: number,
  }
}
