import { GameData } from "../BaseSlotGame/gameType";
import { WinData } from "../BaseSlotGame/WinData";

interface Symbol {
  Name: string;
  Id: number;
  payout: number;
  reelInstance: { [key: string]: number };
}
export interface SLFLCSETTINGS {
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
  isFreespin: boolean;
  freespinCount: number;
  freespinOptions: FreespinOption[]
  wild: {
    SymbolName: string;
    SymbolID: number;
    useWild: boolean
  },
  scatter: {
    SymbolName: string;
    SymbolID: number;
  },
  freespin: {
    SymbolName: string;
    SymbolID: number;
    freespinOption: number //index 

  }
}


export enum specialIcons {
  scatter = "Scatter",
  wild = "Wild",
  freespin = "Freespin"
}
export type FreespinOption = {
  count: number;
  multiplier: number[];
}
