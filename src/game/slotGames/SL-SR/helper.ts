import { WinData } from "../BaseSlotGame/WinData";
import {
  convertSymbols,
  gameCategory,
  PlayerData,
  UiInitData,
} from "../../Utils/gameUtils";
import { SLSR } from "./stinkinRichBase";
import { specialIcons } from "./types";
import { RandomResultGenerator } from "../RandomResultGenerator";
import { gameData } from "../../testData";

/**
 * Initializes the game settings using the provided game data and game instance.
 * @param gameData - The data used to configure the game settings.
 * @param gameInstance - The instance of the SLCM class that manages the game logic.
 * @returns An object containing initialized game settings.
 */
export function initializeGameSettings(gameData: any, gameInstance: SLSR) {
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
    freeSpinValue: gameData.gameSettings.freeSpinValue,
    bonusValuesArray: gameData.gameSettings.bonusValuesArray,
    bonusProbabilities:  gameData.gameSettings.bonusValuesArray,
    multiplierArray: gameData.gameSettings.bonusValuesArray,
    multiplierProbabilities:  gameData.gameSettings.bonusValuesArray,
    shuffledBonusValues: [],
    selectedMultiplier: 0,
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
    scatter: {
      symbolID: "-1",
      multiplier: [],
      useScatter: false,
    },
    bonus: {
      start: false,
      stopIndex: -1,
      game: null,
      id: -1,
      symbolCount: -1,
      pay: -1,
      useBonus: false,
    },
  };
}
/**
 * Generates the initial reel setup based on the game settings.
 * @param gameSettings - The settings used to generate the reel setup.
 * @returns A 2D array representing the reels, where each sub-array corresponds to a reel.
 */
export function generateInitialReel(gameSettings: any): string[][] {
  const reels = [[], [], [], [], []];
  gameSettings.Symbols.forEach((symbol) => {
    for (let i = 0; i < 5; i++) {
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
// Utility function to shuffle an array and return the shuffled array
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array; // Make sure to return the shuffled array
}

export function makePayLines(gameInstance: SLSR) {
  const { settings } = gameInstance;
  settings.currentGamedata.Symbols.forEach((element) => {
    if (!element.useWildSub) {
      handleSpecialSymbols(element, gameInstance);
    }
  });
}

function handleSpecialSymbols(symbol: any, gameInstance: SLSR) {
  switch (symbol.Name) {
    case specialIcons.FreeSpin:
      gameInstance.settings.freeSpin.symbolID = symbol.Id;
      gameInstance.settings.freeSpin.freeSpinMuiltiplier = symbol.multiplier;
      gameInstance.settings.freeSpin.useFreeSpin = true;
      break;

    case specialIcons.wild:
      gameInstance.settings.wild.SymbolName = symbol.Name;
      gameInstance.settings.wild.SymbolID = symbol.Id;
      gameInstance.settings.wild.useWild = true;
      break;
    case specialIcons.scatter:
      gameInstance.settings.scatter.symbolID = symbol.Id,
      gameInstance.settings.scatter.multiplier = symbol.multiplier;
      gameInstance.settings.scatter.useScatter = true;

      break;
    case specialIcons.bonus:
      gameInstance.settings.bonus.id = symbol.Id;
      gameInstance.settings.bonus.symbolCount = symbol.symbolCount;
      gameInstance.settings.bonus.pay = symbol.pay;
      gameInstance.settings.bonus.useBonus = true;
       break;
    default:
      break;
  }
}

/// Function to check for wins on paylines with or without wild symbols
// Function to check for wins on paylines with or without wild symbols and Free Spin count
// Function to check for wins on paylines with or without wild symbols and Free Spin count
export function checkForWin(gameInstance: SLSR) {
  try {
    const { settings } = gameInstance;
    const winningLines = [];
    let totalPayout =0
    let freeSpinLinesCount = 0; 
    
    settings.lineData.forEach((line, index) => {
      const firstSymbolPosition = line[0];
      let firstSymbol = settings.resultSymbolMatrix[firstSymbolPosition][0];

      // Handle wild symbols
      if (settings.wild.useWild && firstSymbol === settings.wild.SymbolID) {
        firstSymbol = findFirstNonWildSymbol(line, gameInstance);
      }

      // Handle special icons (log but do not return)
      if (Object.values(specialIcons).includes(settings.Symbols[firstSymbol].Name as specialIcons)) {
        // console.log("Special Icon Matched : ", settings.Symbols[firstSymbol].Name);
      }

      // Check if the first 3 symbols in the current line are Free Spin symbols
      const isFreeSpinLine = checkFreeSpinSymbolsOnLine(line, index, gameInstance);

      if (isFreeSpinLine) {
        freeSpinLinesCount++; // Increment the count for Free Spin lines
      }
      const { isWinningLine, matchCount } = checkLineSymbols(firstSymbol, line, gameInstance);

      if (isWinningLine && matchCount >= 3) {
        const symbolMultiplier = accessData(firstSymbol, matchCount, gameInstance);
        
        if (symbolMultiplier > 0) {
          totalPayout = symbolMultiplier * gameInstance.settings.BetPerLines;
          gameInstance.playerData.currentWining += totalPayout;
          settings._winData.winningLines.push(index + 1);
          winningLines.push({
            line,
            symbol: firstSymbol,
            multiplier: symbolMultiplier,
            matchCount,
          });
          
          console.log(`Line ${index + 1}:`, line);
          console.log(`Payout for Line ${index + 1}:`, "payout", totalPayout);
        }
      }
    });
    checkForBonus(gameInstance);
    checkForScatter(gameInstance);
    gameInstance.settings.freeSpin.freeSpinCount = freeSpinLinesCount * settings.freeSpinValue;
    console.log("Total Winning", gameInstance.playerData.currentWining);
    console.log("Total Free Spins Won: ", gameInstance.settings.freeSpin.freeSpinCount);
    
    gameInstance.playerData.haveWon += gameInstance.playerData.currentWining;
    makeResultJson(gameInstance);
    gameInstance.playerData.currentWining = 0;
    gameInstance.settings.bonus.start =  false;
    gameInstance.settings.selectedMultiplier =0;
    gameInstance.settings.shuffledBonusValues = [];
    gameInstance.settings._winData.winningLines =[];

  } catch (error) {
    console.error("Error in checkForWin", error);
    return [];
  }
}
export function checkForBonus(gameInstance: SLSR) {
  try {
    const { settings } = gameInstance;
    let bonusSymbolCount = 0;
    
    // Count Bonus symbols in the result matrix
    settings.resultSymbolMatrix.forEach((row) => {
      row.forEach((symbol) => {
        if (symbol === settings.bonus.id) {
          bonusSymbolCount++;
        }
      });
    });
    
    // If 3 or more bonus symbols are found, trigger the bonus game
    if (bonusSymbolCount >= 3) {
      settings.bonus.start = true;
      console.log(`Bonus Game Triggered with ${bonusSymbolCount} Bonus Symbols`);
      runBonusGame(bonusSymbolCount, gameInstance);
    }
  } catch (error) {
    console.error("Error in checkForBonus", error);
  }
}

// Function to run the Bonus game
function runBonusGame(bonusSymbolCount: number, gameInstance: SLSR) {
  try {
    const { settings } = gameInstance;

    const selectedBonusValues = selectValuesFromArray(settings.bonusValuesArray, settings.bonusProbabilities, bonusSymbolCount);
    console.log("Selected Bonus Values: ", selectedBonusValues);

    settings.selectedMultiplier = selectMultiplierFromArray(settings.multiplierArray, settings.multiplierProbabilities);
    console.log("Selected Multiplier: ", settings.selectedMultiplier);

    settings.shuffledBonusValues = shuffleArray(selectedBonusValues);
    console.log("Shuffled Bonus Values: ", settings.shuffledBonusValues );

    const sumOfValues = settings.shuffledBonusValues .slice(0, -1).reduce((sum, value) => sum + value, 0);
    const bonusWin = sumOfValues * settings.selectedMultiplier;
    console.log("Bonus Win Amount: ", bonusWin);

    gameInstance.playerData.currentWining += bonusWin *  gameInstance.settings.BetPerLines;;
    console.log("Player's Total Winnings after Bonus: ", gameInstance.playerData.currentWining);

  } catch (error) {
    console.error("Error in runBonusGame", error);
  }
}
export function checkForScatter(gameInstance: SLSR)
{
  try {
    const { settings } = gameInstance;
    let scatterSymbolCount = 0;
    
    settings.resultSymbolMatrix.forEach((row) => {
      row.forEach((symbol) => {
        if (symbol === settings.scatter.symbolID) {
          scatterSymbolCount++;
        }
      });
    });
    
    if (scatterSymbolCount >= settings.scatter.multiplier.length && scatterSymbolCount < 6) {
      const scatterWin = accessData(settings.scatter.symbolID,scatterSymbolCount,gameInstance);
      console.log(`Scatter Won `,scatterWin* gameInstance.settings.BetPerLines);
      gameInstance.playerData.currentWining += scatterWin * gameInstance.settings.BetPerLines;;
    }
    if(scatterSymbolCount >5 )
    {
      const scatterWin = accessData(settings.scatter.symbolID,5,gameInstance);
      console.log(`Scatter Won `,scatterWin* gameInstance.settings.BetPerLines);
      gameInstance.playerData.currentWining += scatterWin * gameInstance.settings.BetPerLines;;
    }
  } catch (error) {
    console.error("Error in checkForScatter", error);
  }
}

// Function to select values from an array based on probabilities
function selectValuesFromArray(array: number[], probabilities: number[], count: number): number[] {
  const selectedValues = [];
  for (let i = 0; i < count; i++) {
    const randomValue = Math.random();
    let cumulativeProbability = 0;
    for (let j = 0; j < array.length; j++) {
      cumulativeProbability += probabilities[j];
      if (randomValue <= cumulativeProbability) {
        selectedValues.push(array[j]);
        break;
      }
    }
  }
  return selectedValues;
}

// Function to select a multiplier from the multiplier array based on probabilities
function selectMultiplierFromArray(array: number[], probabilities: number[]): number {
  const randomValue = Math.random();
  let cumulativeProbability = 0;
  for (let i = 0; i < array.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomValue <= cumulativeProbability) {
      return array[i];
    }
  }
  return array[0]; // Default return value if probabilities don't sum to 1
}

// Function to check if the first 3 symbols on a line are Free Spin symbols
function checkFreeSpinSymbolsOnLine(line: number[], index: number, gameInstance: SLSR): boolean {
  try {
    const { settings } = gameInstance;
    const freeSpinSymbolID = settings.freeSpin.symbolID;
    let count = 0;
    settings.freeSpin.useFreeSpin = false;
    // Loop through the first 3 symbols in the current line
    for (let i = 0; i < 3; i++) {
      const rowIndex = line[i]; // Get the index of the symbol in this line
      const symbol = settings.resultSymbolMatrix[rowIndex][i]; // Fetch the symbol from the matrix

      if (symbol === undefined) {
        console.error(`Symbol at position [${rowIndex}, ${i}] is undefined.`);
        return false;
      }
      if (symbol === freeSpinSymbolID) {
        count++;
      }
    }
    return count === 3;
  } catch (error) {
    console.error("Error in checkFreeSpinSymbolsOnLine:", error);
    return false;
  }
}

// Function to check for matching symbols on a line (with wild substitution)
function checkLineSymbols(
  firstSymbol: string,
  line: number[],
  gameInstance: SLSR
): {
  isWinningLine: boolean;
  matchCount: number;
} {
  try {
    const { settings } = gameInstance;
    const wildSymbol = settings.wild.SymbolID || "";
    let matchCount = 1;
    let currentSymbol = firstSymbol;

    for (let i = 1; i < line.length; i++) {
      const rowIndex = line[i];
      const symbol = settings.resultSymbolMatrix[rowIndex][i];

      if (symbol === undefined) {
        console.error(`Symbol at position [${rowIndex}, ${i}] is undefined.`);
        return { isWinningLine: false, matchCount: 0 };
      }

      if (symbol === currentSymbol || symbol === wildSymbol) {
        matchCount++;
      } else if (currentSymbol === wildSymbol) {
        currentSymbol = symbol;
        matchCount++;
      } else {
        return { isWinningLine: matchCount >= 3, matchCount };
      }
    }

    return { isWinningLine: matchCount >= 3, matchCount };
  } catch (error) {
    console.error("Error in checkLineSymbols:", error);
    return { isWinningLine: false, matchCount: 0 };
  }
}

// Function to find the first non-wild symbol on a line
function findFirstNonWildSymbol(line: number[], gameInstance: SLSR) {
  try {
    const { settings } = gameInstance;
    const wildSymbol = settings.wild.SymbolID;

    for (let i = 0; i < line.length; i++) {
      const rowIndex = line[i];
      const symbol = settings.resultSymbolMatrix[rowIndex][i];
      
      if (symbol !== wildSymbol) {
        return symbol;
      }
    }

    return wildSymbol;
  } catch (error) {
    console.error("Error in findFirstNonWildSymbol:", error);
    return null;
  }
}

//payouts to user according to symbols count in matched lines
function accessData(symbol, matchCount, gameInstance: SLSR) {
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


/**
 * Handles cascading mechanic and checks for additional wins.
 * @param gameInstance - The game instance to apply cascading to.
 */

/**
 * Sends the initial game and player data to the client.
 * @param gameInstance - The instance of the SLCM class containing the game settings and player data.
 */
export function sendInitData(gameInstance: SLSR) {
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
      // freeSpinValue:  gameInstance.settings.currentGamedata.freeSpinValue,
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

export function makeResultJson(gameInstance: SLSR) {
  try {
    const { settings, playerData } = gameInstance;
    const credits = gameInstance.getPlayerData().credits 
    const Balance = credits.toFixed(2)
    const sendData = {
      GameData: {
        linesToEmit: settings._winData.winningLines,
        symbolsToEmit: settings._winData.winningSymbols,
        isFreeSpin: settings.freeSpin.useFreeSpin,
        freeSpinCount: settings.freeSpin.freeSpinCount,
        isBonus: settings.bonus.start,
        shuffledBonusValues: settings.shuffledBonusValues,
        selectedBonusMultiplier: settings.selectedMultiplier,
      },
      PlayerData: {
        Balance: Balance,
        totalbet: playerData.totalbet,
        currentWining : playerData.currentWining,
        haveWon: playerData.haveWon,
      }
    };
    gameInstance.sendMessage('ResultData', sendData);
  } catch (error) {
    console.error("Error generating result JSON or sending message:", error);
  }
}