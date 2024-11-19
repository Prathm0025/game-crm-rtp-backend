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
    wildSymbolMultipliers: [],
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
    case specialIcons.wild:
      gameInstance.settings.wild.SymbolName = symbol.Name;
      gameInstance.settings.wild.SymbolID = symbol.Id;
      gameInstance.settings.wild.useWild = true;

      break;
    case specialIcons.FreeSpin:
        gameInstance.settings.freeSpin.symbolID = symbol.Id;
        gameInstance.settings.freeSpin.freeSpinMuiltiplier = symbol.multiplier;
        gameInstance.settings.freeSpin.useFreeSpin = false;
      break;
  
    default:
      break;
  }
}

//CHECK WINS ON PAYLINES WITH OR WITHOUT WILD
//check for win function


export function checkForWin(gameInstance: SLBT) {
  const { settings } = gameInstance;
  const wildSymbolId = settings.wild.SymbolID;
  const wildPositionMultipliers = []; // Array to store wild positions and multipliers
  let totalPayout = 0;

  const isFreeSpin = settings.freeSpin.useFreeSpin;
  const wildMultipliers = {}

  // Populate the dictionary with wild multipliers during free spins
  if (isFreeSpin) {
    for (let col = 1; col < settings.resultSymbolMatrix[0].length; col++) {
      for (let row = 0; row < settings.resultSymbolMatrix.length; row++) {
        if (settings.resultSymbolMatrix[row][col] === wildSymbolId) {
          const multiplier = getRandomMultiplier();
          wildMultipliers[`${row}-${col}`] = multiplier; 
          wildPositionMultipliers.push([row, col, multiplier]);
        }
      }
    }
    console.log("Wild multipliers during free spins:", wildPositionMultipliers);
  }
  

  // Loop through each row in the first column to start potential winning lines
  for (let row = 0; row < settings.resultSymbolMatrix.length; row++) {
    const symbolId = settings.resultSymbolMatrix[row][0];
    if (!symbolId || symbolId === wildSymbolId) continue;

    const symbolData = settings.Symbols.find((s) => s.Id === symbolId);
    if (!symbolData) continue;

    let consecutiveLines = [{ count: 1, positions: [{ row, col: 0 }], wildMultiplierTotal: 0 }];

    for (let col = 1; col < settings.resultSymbolMatrix[0].length; col++) {
      let foundMatches = [];

      for (let checkRow = 0; checkRow < settings.resultSymbolMatrix.length; checkRow++) {
        const currentSymbol = settings.resultSymbolMatrix[checkRow][col];

        if (currentSymbol === symbolId || currentSymbol === wildSymbolId) {
          const wildMultiplier = wildMultipliers[`${checkRow}-${col}`] || 0;
          foundMatches.push({ row: checkRow, isWild: currentSymbol === wildSymbolId, multiplier: wildMultiplier });
        }
      }

      if (foundMatches.length === 0) break;

      let newConsecutiveLines = [];
      consecutiveLines.forEach((line) => {
        foundMatches.forEach(({ row: matchRow, isWild, multiplier }) => {
          newConsecutiveLines.push({
            count: line.count + 1,
            positions: [...line.positions, { row: matchRow, col }],
            wildMultiplierTotal: line.wildMultiplierTotal + multiplier,
          });
        });
      });

      consecutiveLines = newConsecutiveLines;
    }

    consecutiveLines.forEach((line) => {
      if (line.count >= 2) {
        console.log(`Winning line found starting from row ${row + 1}. Symbol ID: ${symbolId}, Consecutive count: ${line.count}`);
        const transformedPositions = line.positions.map((pos) => [pos.row, pos.col]);

        gameInstance.settings._winData.winningLines.push(
          transformedPositions
        );

        // Collect winning symbols for this line
         gameInstance.settings._winData.winningSymbols.push(transformedPositions); // Add transformed positions to winningSymbols


        const baseMultiplier = accessData(symbolId, line.count, gameInstance);
        let linePayout = baseMultiplier * settings.currentBet;

        if (line.wildMultiplierTotal > 0) {
          linePayout *= (1 + line.wildMultiplierTotal);
          console.log(`Wild multipliers in line: ${line.wildMultiplierTotal}. Total multiplier applied to payout: ${1 + line.wildMultiplierTotal}`);
        }

        totalPayout += linePayout;
        gameInstance.playerData.currentWining += linePayout;
        console.log("Line payout:", linePayout);
      }
    });
  }

  checkForFreeSpin(gameInstance);
  console.log("Total winnings:", gameInstance.playerData.currentWining);

  gameInstance.settings._winData.winningLines = settings._winData.winningLines;
  gameInstance.settings._winData.winningSymbols = settings._winData.winningLines; // Store winning symbols for each line
  gameInstance.settings.wildSymbolMultipliers = wildPositionMultipliers; // Store wild positions and multipliers
  console.log("Winning Lines:", gameInstance.settings._winData.winningLines);
  console.log("Winning Symbols:", gameInstance.settings._winData.winningSymbols);
  console.log("Wild Positions and Multipliers:", gameInstance.settings.wildSymbolMultipliers);

  makeResultJson(gameInstance)
  gameInstance.settings._winData.winningLines =[];
  gameInstance.settings._winData.winningSymbols =[];
  gameInstance.settings.wildSymbolMultipliers =[];
  
}

function getRandomMultiplier() {
  const multipliers = [2, 3, 5];
  return multipliers[Math.floor(Math.random() * multipliers.length)];
}


function checkForFreeSpin(gameInstance: SLBT) {
  const { settings } = gameInstance;
  const freeSpinSymbolId = settings.freeSpin.symbolID; // Access the free spin symbol ID
  let freeSpinSymbolCount = 0;
  console.log("Free Spin ID",freeSpinSymbolId);
  

  // Count occurrences of the free spin symbol in the result matrix
  settings.resultSymbolMatrix.forEach((row) => {
    row.forEach((symbol) => {
      if (symbol === freeSpinSymbolId) {
        freeSpinSymbolCount++;
      }
    });
  });

  // If 3 or more free spin symbols are found, trigger free spins
  if (freeSpinSymbolCount >= 7-settings.freeSpin.freeSpinMuiltiplier.length && freeSpinSymbolCount < 7) {
    console.log(`Free Spin triggered! Found ${freeSpinSymbolCount} free spin symbols.`);
    
    const freeSpinMultiplier =
      settings.freeSpin.freeSpinMuiltiplier[ 6- freeSpinSymbolCount] ; // Get multiplier based on count
    settings.freeSpin.freeSpinCount += freeSpinMultiplier[1]; // Add to free spin count
    settings.freeSpin.useFreeSpin = true; // Mark free spin as active
    console.log(`Free Spins awarded: ${settings.freeSpin.freeSpinCount}`);
  }
  if(freeSpinSymbolCount >= 7)
  {
    console.log(`Free Spin triggered! Found ${freeSpinSymbolCount} free spin symbols.`);
    const freeSpinMultiplier =
      settings.freeSpin.freeSpinMuiltiplier[0] ; // Get multiplier based on count
    settings.freeSpin.freeSpinCount += freeSpinMultiplier[1]; // Add to free spin count
    settings.freeSpin.useFreeSpin = true; // Mark free spin as active
    console.log(`Free Spins awarded: ${settings.freeSpin.freeSpinCount}`);
  }
}


function accessData(symbol, matchCount, gameInstance: SLBT) {
  const { settings } = gameInstance;
  try {
    const symbolData = settings.currentGamedata.Symbols.find(
      (s) => s.Id.toString() === symbol.toString()
    );
    if (symbolData) {
      const multiplierArray = symbolData.multiplier;
      if (multiplierArray && multiplierArray[5 - matchCount]) {
        return multiplierArray[5 - matchCount][0];
      }
    }
    return 0;
  } catch (error) {
    // console.error("Error in accessData:");
    return 0;
  }
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
    const credits = gameInstance.getPlayerData().credits 
    const sendData = {
      GameData: {
        resultMatrix: settings.resultSymbolMatrix,
        symbolsToEmit: settings._winData.winningSymbols,
        isFreeSpin: settings.freeSpin.useFreeSpin,
        freeSpinCount: settings.freeSpin.freeSpinCount,
        WildMultipliers: settings.wildSymbolMultipliers
      },
      PlayerData: {
        Balance: gameInstance.getPlayerData().credits,
        totalbet: playerData.totalbet,
        haveWon: playerData.haveWon,
      }
    };
    gameInstance.sendMessage('ResultData', sendData);
  } catch (error) {
    console.error("Error generating result JSON or sending message:", error);
  }
}