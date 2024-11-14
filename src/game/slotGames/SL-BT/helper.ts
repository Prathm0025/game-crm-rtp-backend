import { WinData } from "../BaseSlotGame/WinData";
import {
  convertSymbols,
  gameCategory,
  PlayerData,
  UiInitData,
} from "../../Utils/gameUtils";
import { SLBT } from "./buffaloTrailBase";
import { specialIcons } from "./types";
import { RandomResultGenerator } from "../RandomResultGenerator";

/**
 * Initializes the game settings using the provided game data and game instance.
 * @param gameData - The data used to configure the game settings.
 * @param gameInstance - The instance of the SLCM class that manages the game logic.
 * @returns An object containing initialized game settings.
 */
export function initializeGameSettings(gameData: any, gameInstance: SLBT) {
  return {
    id: gameData.gameSettings.id,
    matrix: gameData.gameSettings.matrix,
    bets: gameData.gameSettings.bets,
    Symbols: gameInstance.initSymbols,
    resultSymbolMatrix: [],
    currentGamedata: gameData.gameSettings,
    lineData: [],
    _winData: new WinData(gameInstance),
    currentBet: 0,
    currentLines: 0,
    BetPerLines: 0,
    reels: [],
    hasCascading: false,
    cascadingNo: 0,
    payoutAfterCascading: 0,
    cascadingResult: [],
    lastReel: [],
    tempReel: [],
    firstReel: [],
    tempReelSym: [],
    freeSpinData: gameData.gameSettings.freeSpinData,
    jackpot: {
      symbolName: "",
      symbolsCount: 0,
      symbolId: 0,
      defaultAmount: 0,
      increaseValue: 0,
      useJackpot: false,
    },
    freeSpin: {
      symbolID: "-1",
      freeSpinMuiltiplier: [],
      freeSpinStarted: false,
      freeSpinsAdded: false,
      freeSpinCount: 0,
      noOfFreeSpins: 0,
      useFreeSpin: false,
    },
    wild: {
      SymbolName: "",
      SymbolID: -1,
      useWild: false,
    },
  };
}
/**
 * Generates the initial reel setup based on the game settings.
 * @param gameSettings - The settings used to generate the reel setup.
 * @returns A 2D array representing the reels, where each sub-array corresponds to a reel.
 */
export function generateInitialReel(gameSettings: any): string[][] {
  const reels = [[], [], [], [], [], []];
  gameSettings.Symbols.forEach((symbol) => {
    for (let i = 0; i < 6; i++) {
      const count = symbol.reelInstance[i] || 0;
      for (let j = 0; j < count; j++) {
        reels[i].push(symbol.Id);
      }
    }
  });
  reels.forEach((reel) => {
    shuffleArray(reel);
  });
  return reels;
}
/**
 * Shuffles the elements of an array in place using the Fisher-Yates algorithm.
 * @param array - The array to be shuffled.
 */
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function makePayLines(gameInstance: SLBT) {
  const { settings } = gameInstance;
  settings.currentGamedata.Symbols.forEach((element) => {
    if (!element.useWildSub) {
      handleSpecialSymbols(element, gameInstance);
    }
  });
}

function handleSpecialSymbols(symbol: any, gameInstance: SLBT) {
  switch (symbol.Name) {
    case specialIcons.jackpot:
      gameInstance.settings.jackpot.symbolName;
      gameInstance.settings.jackpot.symbolId = symbol.Id;
      gameInstance.settings.jackpot.symbolsCount = symbol.symbolsCount;
      gameInstance.settings.jackpot.defaultAmount = symbol.defaultAmount;
      gameInstance.settings.jackpot.increaseValue = symbol.increaseValue;
      gameInstance.settings.jackpot.useJackpot = true;
      break;
    case specialIcons.wild:
      gameInstance.settings.wild.SymbolName = symbol.Name;
      gameInstance.settings.wild.SymbolID = symbol.Id;
      gameInstance.settings.wild.useWild = true;

      break;
    default:
      break;``
  }
}

//CHECK WINS ON PAYLINES WITH OR WITHOUT WILD
//check for win function
export function checkForWin(gameInstance: SLBT) {
  const { resultSymbolMatrix, Symbols, _winData } = gameInstance.settings;
  const winningLines = [];

  // Loop through each symbol in the first column only
  for (let row = 0; row < resultSymbolMatrix.length; row++) {
    const symbolId = resultSymbolMatrix[row][0]; // Symbol in the first column
    if (!symbolId) continue; // Skip empty or null entries if any

    // Find the symbol's data to access the multiplier
    const symbolData = Symbols.find((s) => s.Id === symbolId);
    if (!symbolData) continue;

    // Loop through subsequent columns to check for matches for this symbol
    let consecutiveCount = 1; // Start with the symbol in the first column

    // Track winning lines starting from this symbol in the first column
    for (let col = 1; col < resultSymbolMatrix[0].length; col++) {
      let matchCountInColumn = 0; // Count matches in the current column

      // Check if this symbol is present in the current column
      for (let checkRow = 0; checkRow < resultSymbolMatrix.length; checkRow++) {
        if (resultSymbolMatrix[checkRow][col] === symbolId) {
          matchCountInColumn++;
          
          // If we find a match, consider it a new winning line starting from this first-column symbol
          if (consecutiveCount + 1 >= 2) { // Minimum of 2 matches required
            console.log(`Winning line found starting from row ${row + 1} in the first column. Symbol ID: ${symbolId}, Match at column ${col + 1}, row ${checkRow + 1}`);

            // Store the winning line details
            winningLines.push({
              symbol: symbolId,
              count: consecutiveCount + 1,
              startColumn: 0,
              startRow: row,
              matchedColumn: col,
              matchedRow: checkRow,
            });

            // Add payout for this individual line
            // const payout = (consecutiveCount + 1) * (symbolData.multiplier || 1);
            // _winData.addPayout(symbolId, payout);
          }
        }
      }

      // If there were no matches in this column, reset the consecutive count
      if (matchCountInColumn === 0) {
        break; // Stop checking if no further matches are found
      }
    }
  }

  // Update game settings with winning data
  gameInstance.settings._winData.winningLines = winningLines;
  console.log("Winning lines",gameInstance.settings._winData.winningLines);
  
  // gameInstance.settings.payoutAfterCascading += _winData.calculateTotalPayout();
}







export function sendInitData(gameInstance: SLBT) {
  gameInstance.settings.lineData =
    gameInstance.settings.currentGamedata.linesApiData;
  UiInitData.paylines = convertSymbols(gameInstance.settings.Symbols);
  const reels = generateInitialReel(gameInstance.settings);
  gameInstance.settings.reels = reels;
  const dataToSend = {
    GameData: {
      Reel: reels,
      linesApiData: gameInstance.settings.currentGamedata.linesApiData,
      Bets: gameInstance.settings.currentGamedata.bets,
      freeSpinData: gameInstance.settings.freeSpinData,
    },
    UIData: UiInitData,
    PlayerData: {
      Balance: gameInstance.getPlayerData().credits,
      haveWon: gameInstance.playerData.haveWon,
      currentWining: gameInstance.playerData.currentWining,
      totalbet: gameInstance.playerData.totalbet,
    },
  };
  gameInstance.sendMessage("InitData", dataToSend);
}

export function makeResultJson(gameInstance: SLBT) {
  try {
    const { settings, playerData } = gameInstance;
    const credits = gameInstance.getPlayerData().credits + settings.payoutAfterCascading
    const Balance = credits.toFixed(2)
    const sendData = {
      GameData: {
        resultSymbols: settings.firstReel,
        linesToEmit: settings._winData.winningLines,
        symbolsToEmit: settings._winData.winningSymbols,
        jackpot: settings._winData.jackpotwin,
        cascading: settings.cascadingResult,
        isCascading: settings.hasCascading,
        isFreeSpin: settings.freeSpin.useFreeSpin,
        freeSpinCount: settings.freeSpin.freeSpinCount,
      },
      PlayerData: {
        Balance: Balance,
        currentWining: settings.payoutAfterCascading,
        totalbet: playerData.totalbet,
        haveWon: playerData.haveWon,
      }
    };
    gameInstance.sendMessage('ResultData', sendData);
  } catch (error) {
    console.error("Error generating result JSON or sending message:", error);
  }
}