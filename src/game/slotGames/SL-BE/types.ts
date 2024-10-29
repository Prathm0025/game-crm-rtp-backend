import { GameData } from "../BaseSlotGame/gameType";
import { WinData } from "../BaseSlotGame/WinData";

interface Symbol {
  Name: string;
  Id: number;
  payout: number;
  reelInstance: { [key: string]: number };
}
export interface SLBESETTINGS {
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
  isLeftWinTrue: boolean;
  freeSpin: {
    symbolID: string,
    isEnabled: boolean,
    countIncrement: number,
    isFreeSpin: boolean,
    isTriggered: boolean,
    freeSpinCount: number,
    bloodSplash:{
      countProb:number[],
    },
    substitutions: {
      vampHuman: [string, string][]
      bloodSplash: {
        index: string,
        symbolId: string
      }[]
    }
  };
  wild: {
    SymbolName: string;
    SymbolID: number;
    useWild: boolean
  },
  vampireMan: {
    SymbolName: string;
    SymbolID: number;
    useWild: boolean
  },
  vampireWoman: {
    SymbolName: string;
    SymbolID: number;
    useWild: boolean
  },
  HumanMan: {
    SymbolName: string;
    SymbolID: number;
    useWild: boolean
  },
  HumanWoman: {
    SymbolName: string;
    SymbolID: number;
    useWild: boolean
  }
}


export enum specialIcons {
  wild = "Wild",
  FreeSpin = "FreeSpin",
  VampireMan = "VampireMan",
  VampireWoman = "VampireWoman",
  HumanMan = "HumanMan",
  HumanWoman = "HumanWoman",
  Bat = "Bat",
  BatX2 = "BatX2"
}
