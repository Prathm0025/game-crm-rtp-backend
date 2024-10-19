import { SLLOL } from './LifeOfLuxury';
import { SymbolType, GameResult, WinningCombination, FreeSpinResponse } from './types';
import { WinData } from "../BaseSlotGame/WinData";
import { convertSymbols, UiInitData } from '../../Utils/gameUtils';
import { RandomResultGenerator } from '../RandomResultGenerator';


export function initializeGameSettings(gameData: any, gameInstance: SLLOL) {
  // console.log("Entering initializeGameSettings function");
  // console.log("gameData:", JSON.stringify(gameData, null, 2));

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
    defaultPayout: gameSettings.defaultPayout || 0,
    minMatchCount: gameSettings.minMatchCount || 3,
    isFreeSpin: false,
    freeSpinCount: 0,
    freeSpinMultipliers: [1, 1, 1, 1, 1],
    maxMultiplier: 10
  };

  // Add WinData separately to avoid circular reference in logging
  settings._winData = new WinData(gameInstance);

  return settings;
}

export function generateInitialReel(gameSettings: any): number[][] {
  try {
    // console.log("Entering generateInitialReel function");
    // console.log("gameSettings:", JSON.stringify(gameSettings, (key, value) => key === '_winData' ? undefined : value, 2));

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

export function sendInitData(gameInstance: SLLOL) {
  UiInitData.paylines = convertSymbols(gameInstance.settings.Symbols);
  const credits = gameInstance.getPlayerData().credits
  const Balance = credits.toFixed(2)
  const reels = generateInitialReel(gameInstance.settings);
  gameInstance.settings.reels = reels;
  const dataToSend = {
    GameData: {
      // Reel: reels,
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

export function makeResultJson(gameInstance: SLLOL) {
  try {
    const { settings, playerData } = gameInstance;
    const credits = gameInstance.getPlayerData().credits;
    const Balance = credits.toFixed(2);
    const sendData = {
      gameData: {
        resultSymbols: settings.resultSymbolMatrix,
      },
      PlayerData: {
        Balance: Balance,
        currentWining: playerData.currentWining,
        totalbet: playerData.totalbet,
        haveWon: playerData.haveWon,
      }
    };

    gameInstance.sendMessage('ResultData', sendData);
  } catch (error) {
    console.error("Error generating result JSON or sending message:", error);
  }
}

export function printMatrix(matrix: GameResult, getSymbol: (id: number) => SymbolType | undefined, gameInstance: SLLOL): void {
  const symbolNames = matrix.map(col =>
    col.map(symbolId => getSymbol(symbolId)?.Name.substring(0, 4) || 'Unkn')
  );

  for (let row = 0; row < gameInstance.settings.matrix.y; row++) {
    console.log(symbolNames.map(col => col[row].padEnd(4)).join(' | '));
  }
}
export function printWinningCombinations(winningCombinations: WinningCombination[]): void {
  if (winningCombinations.length === 0) {
    console.log("No winning combinations.");
    return;
  }

  console.log("Winning Combinations:");
  winningCombinations.forEach((combo, index) => {
    console.log(`Combination ${index + 1}:`);
    console.log(`  Symbol ID: ${combo.symbolId}`);
    console.log(`  Positions: ${combo.positions.map(pos => `(${pos[0]},${pos[1]})`).join(', ')}`);
    console.log(`  Payout: ${combo.payout}`);
    console.log(); // Empty line for separation
  });

  const totalPayout = winningCombinations.reduce((sum, combo) => sum + combo.payout, 0);
  console.log(`Total Payout: ${totalPayout}`);
}

export function logGame(result: GameResult, payout: number, winningCombinations: WinningCombination[], getSymbol: (id: number) => SymbolType | undefined, gameInstance: SLLOL): void {
  console.log("Game Result:");
  printMatrix(result, getSymbol, gameInstance);
  console.log("\nTotal Payout:", payout);

  if (winningCombinations.length > 0) {
    console.log("\nWinning Combinations:");
    winningCombinations.forEach((combo, index) => {
      const symbol = getSymbol(combo.symbolId);
      console.log(`\nCombination ${index + 1}:`);
      console.log(`Symbol: ${symbol?.Name}`);
      console.log(`Payout: ${combo.payout}`);
      // printWinningCombination(result, combo.positions, getSymbol, gameInstance);
    });
  } else {
    console.log("\nNo winning combinations.");
  }
}


export function getSymbol(id: number, Symbols: SymbolType[]): SymbolType | undefined {
  return Symbols.find(s => s.Id === id);
}
export function isWild(symbolId: number): boolean {
  // const symbol = this.getSymbol(symbolId);
  // return symbol ? symbol.Name === "Wild" : false;
  return symbolId === 11
}

export function checkForFreespin(gameInstance: SLLOL): boolean {
  try {
    const { settings } = gameInstance;
    const resultMatrix = settings.resultSymbolMatrix;
    const rows = resultMatrix.length;

    // Check if 1st, 2nd, and 3rd columns have symbol with ID 12 regardless of row
    let col1Has12 = false;
    let col2Has12 = false;
    let col3Has12 = false;

    for (let j = 0; j < rows; j++) { // Loop through rows
      if (resultMatrix[j][0] === 12) col1Has12 = true; // Check 1st column
      if (resultMatrix[j][1] === 12) col2Has12 = true; // Check 2nd column
      if (resultMatrix[j][2] === 12) col3Has12 = true; // Check 3rd column

      // If all three columns have the symbol, return true
      if (col1Has12 && col2Has12 && col3Has12) {
        return true;
      }
    }

    // If one of the columns doesn't have the symbol, return false
    return false;

  } catch (e) {
    console.error("Error in checkForFreespin:", e);
    return false; // Handle error by returning false in case of failure
  }
}
export function simulateFreespin(gameInstance: SLLOL): FreeSpinResponse {
  const { settings } = gameInstance;
  settings.isFreeSpin = true;
  settings.freeSpinCount = 10;
  let response: FreeSpinResponse = {
    freeSpinCount: [],
    freeSpinMultipliers: [],
    combinations: [],
    results: [],
    isRetriggered: [],
    payouts: []
  };

  // Initialize freeSpinMultipliers for major symbols
  const majorSymbolIds = settings.Symbols
    .filter(symbol => symbol.isFreeSpinMultiplier)
    .map(symbol => symbol.Id);
  let currentMultipliers = Object.fromEntries(majorSymbolIds.map(id => [id, 1]));

  while (settings.freeSpinCount > 0) {
    new RandomResultGenerator(gameInstance);
    settings.freeSpinCount -= 1;
    const resultMatrix = settings.resultSymbolMatrix;
    const { winningCombinations } = checkWin(gameInstance);

    let totalPayout = 0;
    winningCombinations.forEach((combination) => {
      const symbol = getSymbol(combination.symbolId, settings.Symbols);
      if (symbol.isFreeSpinMultiplier) {
        combination.payout = combination.payout * settings.BetPerLines * currentMultipliers[combination.symbolId];
      } else {
        combination.payout = combination.payout * settings.BetPerLines;
      }
      totalPayout += combination.payout;
    });

    response.results.push(resultMatrix);
    response.payouts.push(totalPayout);
    response.combinations.push(winningCombinations);

    if (checkForFreespin(gameInstance)) {
      response.isRetriggered.push(true);
      settings.freeSpinCount += 10;
    } else {
      response.isRetriggered.push(false);
      //TODO: uncomment
    }
    response.freeSpinCount.push(settings.freeSpinCount);

    // Update multipliers based on symbol occurrences, capped at MAX_MULTIPLIER
    resultMatrix.flat().forEach((symbolId) => {
      if (currentMultipliers.hasOwnProperty(symbolId)) {
        currentMultipliers[symbolId] = Math.min(currentMultipliers[symbolId] + 1, settings.maxMultiplier);
      }
    });

    response.freeSpinMultipliers.push([...Object.values(currentMultipliers)]);
  }

  settings.isFreeSpin = false;
  settings.freeSpinCount = 0;
  settings.freeSpinMultipliers = [1, 1, 1, 1, 1];
  return response;
}


  export function checkWin(gameInstance: SLLOL): { payout: number; winningCombinations: WinningCombination[] } {
  const {settings} = gameInstance;
    let totalPayout = 0;
    let winningCombinations: WinningCombination[] = [];

    const findCombinations = (symbolId: number, col: number, path: [number, number][]): void => {
      // Stop if we've checked all columns or path is complete
      if (col === settings.matrix.x) {
        if (path.length >= settings.minMatchCount) {
          const symbol = getSymbol(symbolId, settings.Symbols);
          const multiplierIndex = path.length - settings.minMatchCount;
          if (symbol && symbol.multiplier[multiplierIndex]) { // Check if multiplier exists
            const multiplier = symbol.multiplier[multiplierIndex][0];
            winningCombinations.push({ symbolId, positions: path, payout: multiplier * settings.BetPerLines });
          }
        }
        return;
      }

      for (let row = 0; row < settings.resultSymbolMatrix.length; row++) {
        const currentSymbolId = settings.resultSymbolMatrix[row][col];
        if (currentSymbolId === symbolId || isWild(currentSymbolId)) {
          findCombinations(symbolId, col + 1, [...path, [row, col]]);
        }
      }

      // End the combination if it's long enough
      if (path.length >= settings.minMatchCount) {
        const symbol = getSymbol(symbolId, settings.Symbols)!;
        const multiplierIndex = path.length - settings.minMatchCount;
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
          if (startSymbolId === symbol.Id || isWild(startSymbolId)) {
            findCombinations(symbol.Id, 1, [[row, 0]]);
          }
        }
      }
    });

    // Filter out shorter combinations that are subsets of longer ones
    winningCombinations = winningCombinations.filter((combo, index, self) =>
      !self.some((otherCombo, otherIndex) =>
        index !== otherIndex &&
        combo.symbolId === otherCombo.symbolId &&
        combo.positions.length < otherCombo.positions.length &&
        combo.positions.every((pos, i) => pos[0] === otherCombo.positions[i][0] && pos[1] === otherCombo.positions[i][1])
      )
    );

    winningCombinations.forEach(combo => {
      // alter payout . multiply betsperline with payout
      combo.payout = combo.payout * settings.BetPerLines
    })
    // Calculate total payout
    totalPayout = winningCombinations.reduce((sum, combo) => sum + combo.payout, 0);

    return { payout: totalPayout, winningCombinations };
  }
