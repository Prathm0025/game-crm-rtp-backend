import { GameData } from "../BaseSlotGame/gameType";
import { WinData } from "../BaseSlotGame/WinData";

interface Symbol {
  Name: string;
  Id: number;
  payout: number;
  reelInstance: { [key: string]: number };
}
export type WheelType = "SMALL" | "MEDIUM" | "LARGE" | "NONE";
export type FeatureType = "LEVELUP" | "MULTIPLIER" | "FREESPIN" | "WILD" | "NONE";
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
  wheelProb:number[];
  goldSymbolProb:number[];
  goldIndices:[number,number][]
  wheelFeature:{
    isTriggered:boolean,
    wheelType: WheelType;
    featureType: FeatureType
  },
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
