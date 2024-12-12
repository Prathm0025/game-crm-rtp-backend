import { GameData } from "../BaseSlotGame/gameType";
import { WinData } from "../BaseSlotGame/WinData";

interface Symbol {
  Name: string;
  Id: number;
  payout: number;
  reelInstance: { [key: string]: number };
}
// export type CardSuits = "Hearts" | "Diamonds" | "Spades" | "Clubs";
export interface SLAOGSETTINGS {
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
  freeSpinIncrement: number
  isFreeSpin: boolean;
  freeSpinCount: number;
  wild: {
    SymbolName: string;
    SymbolID: number;
    useWild: boolean
  },
}


export enum specialIcons {
  wild = "Wild",
  expand = "Expand"
}
