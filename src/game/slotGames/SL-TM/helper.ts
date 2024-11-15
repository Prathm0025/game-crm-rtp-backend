import { SymbolType, GameResult, WinningCombination, SpecialSymbols } from './types';
import { WinData } from "../BaseSlotGame/WinData";
import { convertSymbols, UiInitData } from '../../Utils/gameUtils';
import { precisionRound } from '../../../utils/utils';
import { SLTM } from './TimeMachineBase';

export function initializeGameSettings(gameData: any, gameInstance: SLTM) {

  const gameSettings = gameData.gameSettings || gameData; // Handle both possible structures

  const settings = {
    id: gameSettings.id,
    isSpecial: gameSettings.isSpecial,
    matrix: gameSettings.matrix,
    isEnabled: gameSettings.isEnabled ?? true,
    bets: gameSettings.bets,
    Symbols: gameInstance.initSymbols,
    resultSymbolMatrix: [],
    currentGamedata: gameSettings,
    currentBet: 0,
    _winData: null,
    currentLines: 0,
    BetPerLines: 0,
    reels: [],
    freeSpinReels: [],
    level: 0 as 0 | 1 | 2 | 3 | 4,
    isLevelUp: false,
    minMatchCount: gameSettings.minMatchCount || 3,
    isFreeSpin: false,
    isFreeSpinTriggered: false,
    freeSpinCount: 0,
    // freeSpinMultipliers: [1, 1, 1, 1, 1],
    // freeSpinSymbolId: gameInstance.currentGameData.gameSettings.Symbols.find((sym: SymbolType) => sym.Name == 'FreeSpin')?.Id || "12",
    // maxMultiplier: 10,
    // freeSpinIncrement: gameSettings.freeSpin.incrementCount,
    // gamble: gameSettings.gamble,
    winningCombinations: [],
    wild: {
      SymbolId: gameInstance.currentGameData.gameSettings.Symbols.find((sym: SymbolType) => sym.Name == SpecialSymbols.WILD).Id
      ,
      SymbolName: SpecialSymbols.WILD,
    },
    freeSpin: {
      SymbolId: gameInstance.currentGameData.gameSettings.Symbols.find((sym: SymbolType) => sym.Name == SpecialSymbols.FREE_SPIN).Id
      ,
      SymbolName: SpecialSymbols.FREE_SPIN,
    }
  };

  // Add WinData separately to avoid circular reference in logging
  settings._winData = new WinData(gameInstance);

  return settings;
}

export function generateInitialReel(gameSettings: any): number[][] {
  try {

    if (!gameSettings || !gameSettings.matrix || !gameSettings.Symbols) {
      console.error("Invalid gameSettings object:", gameSettings);
      return [];
    }

    const reels: number[][] = [];
    const numReels = gameSettings.matrix.x;
    // console.log("Number of reels:", numReels);

    for (let i = 0; i < numReels; i++) {
      const reel: number[] = [];
      const validSymbols = gameSettings.Symbols.filter(symbol => symbol.Name !== SpecialSymbols.FREE_SPIN);
      validSymbols.forEach((symbol: any) => {
        if (!symbol || !symbol.reelInstance) {
          // console.warn("Invalid symbol object:", symbol);
          return;
        }
        const count = symbol.reelInstance[i] || 0;
        // console.log(`Reel ${i}, Symbol ${symbol.Name}, Count: ${count}`);
        for (let j = 0; j < count; j++) {
          reel.push(symbol.Id);
        }
      });
      shuffleArray(reel);
      reels.push(reel);
    }
    // console.log("Generated reels:", reels);
    return reels;
  } catch (e) {
    console.error("Error in generateInitialReel:", e);
    return [];
  }
}

export function generateFreeSpinReel(gameSettings: any): number[][] {
  try {

    if (!gameSettings || !gameSettings.matrix || !gameSettings.Symbols) {
      console.error("Invalid gameSettings object:", gameSettings);
      return [];
    }

    const reels: number[][] = [];
    const numReels = gameSettings.matrix.x;
    // console.log("Number of reels:", numReels);

    for (let i = 0; i < numReels; i++) {
      const reel: number[] = [];
      gameSettings.Symbols.forEach((symbol: any) => {
        if (!symbol || !symbol.reelInstance) {
          // console.warn("Invalid symbol object:", symbol);
          return;
        }
        const count = symbol.reelInstance[i] || 0;
        // console.log(`Reel ${i}, Symbol ${symbol.Name}, Count: ${count}`);
        for (let j = 0; j < count; j++) {
          reel.push(symbol.Id);
        }
      });
      shuffleArray(reel);
      reels.push(reel);
    }
    // console.log("Generated reels:", reels);
    return reels;
  } catch (e) {
    console.error("Error in generateInitialReel:", e);
    return [];
  }
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function sendInitData(gameInstance: SLTM) {
  UiInitData.paylines = convertSymbols(gameInstance.settings.Symbols);
  const credits = gameInstance.getPlayerData().credits
  const Balance = credits.toFixed(2)
  const reels = gameInstance.settings.reels
  gameInstance.settings.reels = reels;
  const dataToSend = {
    GameData: {
      Reel: reels,
      Bets: gameInstance.settings.currentGamedata.bets,
    },
    UIData: UiInitData,
    PlayerData: {
      Balance: Balance,
      haveWon: gameInstance.playerData.haveWon,
      currentWining: gameInstance.playerData.currentWining,
      totalbet: gameInstance.playerData.totalbet,
    },
  };
  gameInstance.sendMessage("InitData", dataToSend);
}

export function makeResultJson(gameInstance: SLTM) {
  try {
    const { settings, playerData } = gameInstance;
    const credits = gameInstance.getPlayerData().credits;
    const Balance = credits.toFixed(3);
    const sendData = {
      gameData: {
        resultSymbols: settings.resultSymbolMatrix,
        // freeSpin: {
        //   isFreeSpin: settings.isFreeSpin,
        //   freeSpinCount: settings.freeSpinCount,
        //   freeSpinMultipliers: settings.freeSpinMultipliers
        // },
        winningCombinations: settings.winningCombinations,
        isLevelUp: settings.isLevelUp,
        level: settings.level,
      },
      PlayerData: {
        Balance: Balance,
        currentWining: playerData.currentWining,
        totalbet: playerData.totalbet,
        haveWon: playerData.haveWon,
      }
    };

    console.log("Sending result JSON:", sendData);
    console.log("winCom", sendData.gameData.winningCombinations);

    gameInstance.sendMessage('ResultData', sendData);
  } catch (error) {
    console.error("Error generating result JSON or sending message:", error);
  }
}

export function getSymbol(id: number, Symbols: SymbolType[]): SymbolType | undefined {
  return Symbols.find(s => s.Id == id);
}

export function isWild(symbolId: number, wildId: string): boolean {
  return symbolId.toString() == wildId
}

export function checkWin(gameInstance: SLTM): { payout: number; winningCombinations: WinningCombination[] } {
  const { settings, playerData } = gameInstance;
  let totalPayout = 0;
  let winningCombinations: WinningCombination[] = [];

  const findCombinations = (symbolId: number, col: number, path: [number, number][]): void => {
    // Stop if we've checked all columns or path is complete
    if (col == settings.matrix.x) {
      if (path.length >= settings.minMatchCount) {
        const symbol = getSymbol(symbolId, settings.Symbols);
        const multiplierIndex = Math.abs(path.length - 5);
        if (symbol && symbol.multiplier[multiplierIndex]) { // Check if multiplier exists
          const multiplier = symbol.multiplier[multiplierIndex][0];
          winningCombinations.push({ symbolId, positions: path, payout: multiplier * settings.BetPerLines });
        }
      }
      return;
    }

    for (let row = 0; row < settings.resultSymbolMatrix.length; row++) {
      const currentSymbolId = settings.resultSymbolMatrix[row][col];
      if (currentSymbolId == symbolId || isWild(currentSymbolId, settings.wild.SymbolId)) {
        findCombinations(symbolId, col + 1, [...path, [row, col]]);
      }
    }

    // End the combination if it's long enough
    if (path.length >= settings.minMatchCount) {
      const symbol = getSymbol(symbolId, settings.Symbols)!;
      let multiplierIndex = Math.abs(path.length - 5);
      if (symbol && symbol.multiplier[multiplierIndex]) { // Check if multiplier exists
        const multiplier = symbol.multiplier[multiplierIndex][0];
        winningCombinations.push({ symbolId, positions: path, payout: multiplier * settings.BetPerLines });
      }
    }
  };

  // Iterate over each symbol in the first column
  settings.Symbols.forEach(symbol => {
    if (symbol.Name !== "Wild") {
      for (let row = 0; row < settings.matrix.y; row++) {
        const startSymbolId = settings.resultSymbolMatrix[row][0]; // Start in the leftmost column (0)
        if (startSymbolId == symbol.Id || isWild(startSymbolId, settings.wild.SymbolId)) {
          findCombinations(symbol.Id, 1, [[row, 0]]);
        }
      }
    }
  });

  // Filter out shorter combinations that are subsets of longer ones
  winningCombinations = winningCombinations.filter((combo, index, self) =>
    !self.some((otherCombo, otherIndex) =>
      index != otherIndex &&
      combo.symbolId == otherCombo.symbolId &&
      combo.positions.length < otherCombo.positions.length &&
      combo.positions.every((pos, i) => pos[0] == otherCombo.positions[i][0] && pos[1] == otherCombo.positions[i][1])
    )
  );

  //NOTE: FREESPIN related checks

  winningCombinations.forEach(combo => {

    combo.payout = combo.payout
    totalPayout += combo.payout;
  })
  if (winningCombinations.length > 0) {
    settings.isLevelUp = true
    if (settings.level < 4) {
      settings.level += 1
      settings.matrix.y += 1
    }
  } else {
    settings.isLevelUp = false
    settings.level = 0
    settings.matrix.y = 3
  }
  settings.winningCombinations = winningCombinations
  gameInstance.playerData.currentWining = precisionRound(totalPayout, 3)
  gameInstance.playerData.haveWon += gameInstance.playerData.currentWining
  gameInstance.playerData.haveWon = precisionRound(gameInstance.playerData.haveWon, 3)

  gameInstance.incrementPlayerBalance(gameInstance.playerData.currentWining);
  makeResultJson(gameInstance)
  settings.isLevelUp = false
  if (settings.freeSpinCount > 0) {
    settings.freeSpinCount -= 1
  }

  return { payout: totalPayout, winningCombinations };
}

