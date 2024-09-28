
import { GameData } from "../BaseSlotGame/gameType";
import { WinData } from "../BaseSlotGame/WinData";
export interface Symbol {
  Name: string;
  Id: number;
  payout: number;
  reelInstance: { [key: string]: number };
  freeSpinCount: number;
  isSpecial: boolean;
}

export interface SLONESETTINGS {
  id: string;
  isSpecial: boolean;
  isMultiplier: boolean;
  multiplierType: string;
  matrix: { x: number, y: number };
  currentGamedata: GameData;
  resultSymbolMatrix: any[];
  _winData: WinData | undefined;
  defaultPayout: number;
  SpecialType: string[];
  scatterBlue: {
    isEnabled: boolean;
    symbolsProbs: number[];
    featureProbs: number[]
  };
  currentBet: number;
  currentLines: number;
  BetPerLines: number;
  bets: number[];
  reels: string[];
  Symbols: Symbol[];
  freeSpinCount: number;
  isFreeSpin: boolean;
  freeSpinType: string;
  booster: {
    isEnabledSimple: boolean;
    isEnabledExhaustive: boolean;
    type: string;
    typeProbs: number[];
    multiplier: number[];
    multiplierProbs: number[];
  };
  levelUp:{
    isEnabled: boolean;
    level: number[];
    levelProbs: number[];
  }
}

