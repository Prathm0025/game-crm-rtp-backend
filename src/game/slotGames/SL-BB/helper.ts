
import { WinData } from "../BaseSlotGame/WinData";
import { SLBB } from "./breakingBadBase";
import { convertSymbols, UiInitData } from "../../Utils/gameUtils";
import { valueType } from "./types";
import { freezeIndex } from "../SL-CM/helper";
import { log } from "console";

export function initializeGameSettings(gameData: any, gameInstance: SLBB) {
  const getSymbolIdByName = (name: string) => {
    const symbol = gameData.gameSettings.Symbols.find((s: any) => s.Name === name);
    return symbol ? symbol.Id : -1;
  };

  return {
    id: gameData.gameSettings.id,
    matrix: gameData.gameSettings.matrix,
    bets: gameData.gameSettings.bets,
    Symbols: gameInstance.initSymbols,
    resultSymbolMatrix: [],
    prevresultSymbolMatrix: [],
    heisenbergSymbolMatrix: [],
    heisenbergFreeze: new Set<string>(),
    currentGamedata: gameData.gameSettings,
    lineData: [],
    _winData: new WinData(gameInstance),
    matchedIndices: [],
    currentBet: 0,
    currentLines: 0,
    BetPerLines: 0,
    reels: [],
    heisenbergReels: [],
    jackpot: {
      isTriggered: false,
      payout: 0,
      // payout: 0,
    },
    freeSpin: {
      isEnabled: gameData.gameSettings.freeSpin.isEnabled,
      isFreeSpin: false,
      cashCollectValues: [],
      // cashCollectValues: [],
      freeSpinCount: 0,
    },
    wild: {
      SymbolName: "Wild",
      SymbolID: getSymbolIdByName("Wild"),
      useWild: false,
    },
    link: {
      SymbolName: "Link",
      SymbolID: getSymbolIdByName("Link"),
      useWild: false,
    },
    megalink: {
      SymbolName: "MegaLink",
      SymbolID: getSymbolIdByName("MegaLink"),
      useWild: false,
    },
    cashCollect: {
      SymbolName: "CashCollect",
      SymbolID: getSymbolIdByName("CashCollect"),
      useWild: false,
    },
    coins: {
      SymbolName: "Coins",
      SymbolID: getSymbolIdByName("Coins"),
      useWild: false,
      values: []
    },
    prizeCoin: {
      SymbolName: "PrizeCoin",
      SymbolID: getSymbolIdByName("PrizeCoin"),
      useWild: false,
    },
    losPollos: {
      SymbolName: "LosPollos",
      SymbolID: getSymbolIdByName("LosPollos"),
      useWild: false,
      values: []
    },
    heisenberg: {
      isTriggered: false,
      freeSpin: {
        freeSpinStarted: false,
        freeSpinsAdded: false,
        freeSpinCount: 0,
        noOfFreeSpins: 0,
        // useFreeSpin: false,
      },
      payout: 0,
    },
    cashCollectPrize: {
      isTriggered: false,
      payout: 0,
    }

  }
}


//GET INITIAL REEL  
export function generateInitialReel(gameSettings: any): string[][] {
  const reels = [[], [], [], [], []];
  const validSymbols = gameSettings.Symbols.filter(symbol =>
    !symbol.useHeisenberg || symbol.Name === "CashCollect"
  );
  validSymbols.forEach(symbol => {
    for (let i = 0; i < 5; i++) {
      const count = symbol.reelInstance[i] || 0;
      for (let j = 0; j < count; j++) {
        reels[i].push(symbol.Id);
      }
    }
  });

  // Shuffle each reel
  reels.forEach(reel => {
    shuffleArray(reel);
  });

  return reels;
}

//GENERATE INITIAL HEISENBERG REEL
export function generateInitialHeisenberg(gameSettings: any): string[][] {
  const reels = [[], [], [], [], []];

  const heisenbergSymbols = gameSettings.Symbols.filter(symbol => symbol.useHeisenberg);

  heisenbergSymbols.forEach(symbol => {
    for (let i = 0; i < 5; i++) {
      const count = symbol.reelInstance[i] || 0;
      for (let j = 0; j < count; j++) {
        reels[i].push(symbol.Id);
      }
    }
  });

  reels.forEach(reel => {
    shuffleArray(reel);
  });

  return reels;
}


function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

//SEND INITIAL DATA

export function sendInitData(gameInstance: SLBB) {
  UiInitData.paylines = convertSymbols(gameInstance.settings.Symbols);
  const credits = gameInstance.getPlayerData().credits
  const Balance = credits.toFixed(2)
  const reels = generateInitialReel(gameInstance.settings);
  const heisenbergReels = generateInitialHeisenberg(gameInstance.settings);
  gameInstance.settings.reels = reels;
  gameInstance.settings.heisenbergReels = heisenbergReels;
  const dataToSend = {
    GameData: {
      Reel: reels,
      Lines:gameInstance.currentGameData.gameSettings.linesApiData,
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
function findIndicesOfSymbol(symbolId: string, matrix: any[][]) {
  try {

    const indices: [number, number][] = [];
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] === symbolId) {
          indices.push([row, col]);
        }
      }
    }
    return indices;
  } catch (e) {
    console.log("Error in findIndicesOfSymbol", e);
  }
}
//CHECK SYMBOL ON WINNING LINES

function checkLineSymbols(
  firstSymbol: string,
  line: number[],
  gameInstance: SLBB
): {
  isWinningLine: boolean;
  matchCount: number;
  matchedIndices: { col: number; row: number }[];
} {
  try {
    const { settings } = gameInstance;
    const wildSymbol = settings.wild.SymbolID || "";
    let matchCount = 1;
    let currentSymbol = firstSymbol;
    const matchedIndices: { col: number; row: number }[] = [
      { col: 0, row: line[0] },
    ];

    
    const getSymbolSettings = (symbolId: string) => {
      return settings.Symbols.find(symbol => symbol.Id === parseInt(symbolId));
    };

    const isWildSubAllowed = (symbolId: string) => {
      const symbolSettings = getSymbolSettings(symbolId);
      return symbolSettings.useWildSub;
    };

    
    for (let i = 1; i < line.length; i++) {
      const rowIndex = line[i];
      const symbol = settings.resultSymbolMatrix[rowIndex][i];
      console.log(symbol, "SYMBOL");
      console.log(isWildSubAllowed(symbol));
      
      
      if (symbol === undefined) {
        console.error(`Symbol at position [${rowIndex}, ${i}] is undefined.`);
        return { isWinningLine: false, matchCount: 0, matchedIndices: [] };
      }
      switch (true) {
        case (symbol == currentSymbol || symbol === wildSymbol) && isWildSubAllowed(symbol):
          matchCount++;
          matchedIndices.push({ col: i, row: rowIndex });
          break;
          case currentSymbol === wildSymbol && isWildSubAllowed(symbol):
            currentSymbol = symbol;
          matchCount++;
          matchedIndices.push({ col: i, row: rowIndex });
          break;
        default:
          return { isWinningLine: matchCount >= 3, matchCount, matchedIndices };
      }
    }
    return { isWinningLine: matchCount >= 3, matchCount, matchedIndices };
  } catch (error) {
    console.error("Error in checkLineSymbols:", error);
    return { isWinningLine: false, matchCount: 0, matchedIndices: [] };
  }
}


// Utility function to select a coin value based on its probability

function getRandomCoinValue(gameInstance: SLBB): number {
  const { currentGameData } = gameInstance;
  const coinValues = currentGameData.gameSettings.coinsvalue;
  const coinProbabilities = currentGameData.gameSettings.coinsvalueprob;

  const totalProbability = coinProbabilities.reduce((sum, prob) => sum + prob, 0);

  const randomValue = Math.random() * totalProbability;

  let cumulativeProbability = 0;
  for (let i = 0; i < coinProbabilities.length; i++) {
    cumulativeProbability += coinProbabilities[i];
    if (randomValue < cumulativeProbability) {
      return coinValues[i];
    }
  }
  return coinValues[0];
}
// function getRandomLosPollosValue(gameInstance: SLBB): number {
//   const { currentGameData } = gameInstance;
//   const losValues = currentGameData.gameSettings.freeSpin.losPollosValues;
//   const losProbs = currentGameData.gameSettings.freeSpin.losPollosProbs;
//
//   const totalProbability = losProbs.reduce((sum, prob) => sum + prob, 0);
//
//   const randomValue = Math.random() * totalProbability;
//
//   let cumulativeProbability = 0;
//   for (let i = 0; i < losProbs.length; i++) {
//     cumulativeProbability += losProbs[i];
//     if (randomValue < cumulativeProbability) {
//       return losValues[i];
//     }
//   }
//   return losValues[0];
// }

function getRandomValue(gameInstance: SLBB, type: 'coin' | 'freespin' | 'prizes'): number {
  const { currentGameData } = gameInstance;

  let values: number[];
  let probabilities: number[];

  if (type === 'coin') {
    values = currentGameData.gameSettings.coinsvalue;
    probabilities = currentGameData.gameSettings.coinsvalueprob;
  } else if (type === 'freespin') {
    values = currentGameData.gameSettings.freeSpin.losPollosValues;
    probabilities = currentGameData.gameSettings.freeSpin.losPollosProbs;
  } else if (type === 'prizes') {
    values = currentGameData.gameSettings.prizes;
    probabilities = currentGameData.gameSettings.prizesProbs;
  } else {
    throw new Error("Invalid type, expected 'coin' or 'freespin'");
  }
  const totalProbability = probabilities.reduce((sum, prob) => sum + prob, 0);
  const randomValue = Math.random() * totalProbability;

  let cumulativeProbability = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomValue < cumulativeProbability) {
      return values[i];
    }
  }
  return values[0];
}
// Function to replace "Coins" symbols with their respective values
export function replaceCoinsWithValues(gameInstance: SLBB, matrixType: 'result' | 'heisenberg') {
  const { settings } = gameInstance;
  const matrix = matrixType === 'result' ? settings.resultSymbolMatrix : settings.heisenbergSymbolMatrix;
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      const symbol = matrix[row][col];
      if (symbol === settings.coins.SymbolID.toString()) {
        const coinValue = getRandomCoinValue(gameInstance);
        settings.coins.values.push({ index: [row, col], value: coinValue });
      }
    }
  }
}




//TO GET VALUE OF COIN AT INDEX

function getCoinValue(coinArray): number {
  return coinArray.reduce((total, coin) => total + coin.value, 0);
}

function generateHeisenbergSpin(gameInstance: SLBB): string[][] {
  const { settings } = gameInstance;
  const heisenbergReels: string[][] = [[], [], [], [], []];

  const heisenbergSymbols = settings.Symbols.filter((symbol: any) => symbol.useHeisenberg);

  // Build the heisenberg reels based on the symbols
  heisenbergSymbols.forEach((symbol: any) => {
    for (let i = 0; i < 5; i++) {
      const count = symbol.reelInstance[i] || 0;
      for (let j = 0; j < count; j++) {
        heisenbergReels[i].push(symbol.Id.toString());
      }
    }
  });

  // Shuffle the reels
  heisenbergReels.forEach(reel => shuffleArray(reel));

  const resultMatrix: any[][] = [];

  // Generate the new result matrix
  for (let x = 0; x < settings.matrix.x; x++) {
    const startPosition = getRandomIndex(heisenbergReels[x].length - 1);
    for (let y = 0; y < settings.matrix.y; y++) {
      if (!resultMatrix[y]) resultMatrix[y] = [];

      // Check if this position is frozen
      if (settings.heisenbergFreeze.has(`${x},${y}`)) {
        
        const prevSymbol = settings.prevresultSymbolMatrix[y][x];   
                                           
        if (prevSymbol === settings.link.SymbolID || prevSymbol === settings.cashCollect.SymbolID || prevSymbol ===settings.losPollos.SymbolID) {
          resultMatrix[y][x] = prevSymbol.toString();   
          continue;  
        }
        if(settings.heisenbergSymbolMatrix[y] && settings.heisenbergSymbolMatrix[y][x]){
        resultMatrix[y][x] = settings.heisenbergSymbolMatrix[y][x]           
        } else {
          const newSymbol = heisenbergReels[x][(startPosition + y) % heisenbergReels[x].length];
          resultMatrix[y][x] = newSymbol;
          if (newSymbol === settings.coins.SymbolID.toString()) {
            console.log("Coin symbol detected! Resetting number of freespins");
            // settings.heisenberg.freeSpin.noOfFreeSpins = 3;
          }
          if ([settings.cashCollect.SymbolID.toString(), settings.coins.SymbolID.toString(), settings.losPollos.SymbolID.toString()].includes(newSymbol)) {
            settings.heisenbergFreeze.add(`${x},${y}`);
            settings.heisenbergSymbolMatrix = resultMatrix;
          }
        }
      } else {
        const newSymbol = heisenbergReels[x][(startPosition + y) % heisenbergReels[x].length];
        resultMatrix[y][x] = newSymbol;
        if (newSymbol === settings.coins.SymbolID.toString()) {
          console.log("Coin symbol detected! Resetting number of freespins");
          // settings.heisenberg.freeSpin.noOfFreeSpins = 3;
        }
        // Freeze positions with specific symbols
        if ([settings.cashCollect.SymbolID.toString(), settings.coins.SymbolID.toString(), settings.losPollos.SymbolID.toString()].includes(newSymbol)) {
          settings.heisenbergFreeze.add(`${x},${y}`);
          settings.heisenbergSymbolMatrix = resultMatrix;
        }
      }
    }
  }

  // Replace all occurrences of '16' with '19' in the resultMatrix
  for (let row = 0; row < resultMatrix.length; row++) {
    for (let col = 0; col < resultMatrix[row].length; col++) {
      if (resultMatrix[row][col] === settings.link.SymbolID.toString()) {
        // console.log("FREE SOIN RESET AND SUBSTITUTE");
        // settings.heisenberg.freeSpin.noOfFreeSpins = 3;
        resultMatrix[row][col] = settings.coins.SymbolID.toString();
      }
    }
  }

  // Update the settings with the new matrix
  settings.heisenbergSymbolMatrix = resultMatrix;

  console.log("Heisenberg Spin Result:", settings.heisenbergSymbolMatrix);

  return resultMatrix;
}


function getRandomIndex(maxValue: number): number {
  return Math.floor(Math.random() * (maxValue + 1));
}

function checkHeisenbergJackPot(gameInstance: SLBB): boolean {
  const { settings } = gameInstance;
  const allowedSymbols = new Set([settings.cashCollect.SymbolID.toString(), settings.coins.SymbolID.toString(), settings.losPollos.SymbolID.toString()]);
  const heisenbergMatrix = settings.heisenbergSymbolMatrix;

  for (let row = 0; row < heisenbergMatrix.length; row++) {
    for (let col = 0; col < heisenbergMatrix[row].length; col++) {
      const symbol = heisenbergMatrix[row][col];

      if (!allowedSymbols.has(symbol)) {
        return false;
      }
    }
  }
  return true;
}


//COINS +CASH COLLECT ON 0 OR 4 -> triggers coin collection with cash collect

function handleCoinsAndCashCollect(
  gameInstance: SLBB
): number {
  const { currentGameData, settings } = gameInstance;
  let totalCoinValue = 0;
  let cashCollectCount = 0;
  const cashCollectSymbolId = settings.cashCollect.SymbolID;
  const coinSymbolId = settings.coins.SymbolID;
  const hasCoinSymbols = hasSymbolInMatrix(settings.heisenbergSymbolMatrix, coinSymbolId.toString());

  if(hasCoinSymbols){    
    replaceCoinsWithValues(gameInstance, 'result');
  }

  if (settings.coins.values.length>0) {
    console.log(totalCoinValue, "coin value before adding the cashcollect and coins");
    
    const coinValue = getCoinValue(settings.coins.values);
    totalCoinValue += coinValue;
    
  }

  // If there's at least one coin collect symbol, apply the multiplier
  if (cashCollectCount > 0) {
    // console.log(totalCoinValue, "TOTAL COIN VALUE");
    // console.log(cashCollectCount, "TOTAL COIN COLLECT COUNT");    
    totalCoinValue *= cashCollectCount;
    return totalCoinValue;
  }
  return 0;
}

//CASH COLLECT + LINK->TRIGGERS HEISENBERG
export function handleCashCollectandLink(gameInstance: SLBB) {
  const { settings, currentGameData } = gameInstance;
  const coinSymbolId = settings.coins.SymbolID;
  const cashCollectSymbolId = settings.cashCollect.SymbolID;

  let totalCoinValue = 0;
  let cashCollectCount = 0;
  const isJackPot = checkHeisenbergJackPot(gameInstance);
  
  if(isJackPot){
    totalCoinValue = currentGameData.gameSettings.bonus.grandPrize;
  }
  const hasCoinSymbols = hasSymbolInMatrix(settings.heisenbergSymbolMatrix, coinSymbolId.toString());

  if (hasCoinSymbols) {
    replaceCoinsWithValues(gameInstance, 'heisenberg');
  }
  if (settings.coins.values.length > 0) {
    // console.log(totalCoinValue, "coin value before adding the cashcollect and coins");

    const coinValue = getCoinValue(settings.coins.values);
    totalCoinValue += coinValue;

  }
  settings.heisenbergSymbolMatrix.forEach((row) => {
    row.forEach((symbol, colIndex) => {
      if (symbol == cashCollectSymbolId) {
        cashCollectCount++;
      }
    });
  });

  // Calculate payout by multiplying total coin value by the number of cash collect symbols
  if (cashCollectCount > 0) {
    // console.log(totalCoinValue, "TOTAL COIN VALUE");

    const payout = totalCoinValue * cashCollectCount;
    // console.log(payout, "PAYOUT");

    settings.heisenberg.payout += payout; // Add payout to game settings
    // console.log(`Cash Collect! Number of Cash Collect symbols: ${cashCollectCount}, Total Payout: ${payout}`);
  } else {
    // console.log("No Cash Collect symbols found.");
  }

  // Reset coin and cash collect values after handling
  totalCoinValue = 0;
  cashCollectCount = 0;
}
//HANDLES HEISNBER SPIN
function handleHeisenbergSpin(gameInstance: SLBB) {
  const { settings } = gameInstance;
  generateHeisenbergSpin(gameInstance);
  const coinSymbolId = settings.coins.SymbolID;
  let coinCount = 0;
  const prizeCoinId = settings.prizeCoin.SymbolID;
  const hasPrizeCoinSymbols = hasSymbolInMatrix(settings.heisenbergSymbolMatrix, prizeCoinId);
  console.log(settings.heisenbergSymbolMatrix);
  
// console.log(hasPrizeCoinSymbols, "hasPrizeCoinSymbols");

  if(hasPrizeCoinSymbols){
    const prize = getRandomValue(gameInstance, "prizes")
    console.log("PRIZE WON:", prize);
    

  }

  settings.heisenbergSymbolMatrix.forEach(row => {
    coinCount += row.filter(symbol => symbol == coinSymbolId).length;
  });

  if (settings.heisenberg.isTriggered) {
    settings.heisenberg.isTriggered = true;
    settings.heisenberg.freeSpin.freeSpinStarted = true;
  }

  if (settings.heisenberg.freeSpin.noOfFreeSpins > 0) {
    settings.heisenberg.freeSpin.noOfFreeSpins--;
    console.log(settings.heisenberg.freeSpin.noOfFreeSpins, "NUMBER OF FREE SPINS");
    if (coinCount > 0) {
      // settings.heisenberg.freeSpin.noOfFreeSpins = 3;
      // settings.heisenberg.freeSpin.freeSpinsAdded = true;
      console.log("Coin found! Reset free spins to 3.");
    }
  } else {
    settings.heisenberg.freeSpin.freeSpinStarted = false;
    settings.heisenberg.freeSpin.freeSpinsAdded = false;

    console.log("Free spins have ended.");
  }
  if (settings.heisenberg.freeSpin.noOfFreeSpins == 0) {
    handleCashCollectandLink(gameInstance);    
    settings.heisenberg.isTriggered = false;
  }
  // console.log(settings.heisenbergSymbolMatrix, "result matrix after Cash Collect and Link");
}

//CASH COLLECCT + LOS POLLOS -> TRIGGERS FREE SPINS BASED ON NUMBER OF LOSPOLLOS * 3
function handleCashCollectandLospollos(gameInstance: SLBB) {
  const { settings } = gameInstance;
  // console.log("handle cash collect and lospollos getting called");

  // settings.freeSpin.freeSpinStarted = true;


  // console.log(settings.resultSymbolMatrix, "result matrix for handle cash collected Link");

}

//CASH COLLECT + PRIZE COIN -> TRIGGERS CASH COLLECT PRIZES 
function handleCashCollectandPrizeCoin(gameInstance: SLBB) {
  const { settings } = gameInstance;
  console.log("handle cash collect and prize coin getting called");

  settings.cashCollectPrize.isTriggered = true;
  settings.cashCollectPrize.payout = 20;

  console.log(settings.resultSymbolMatrix, "result matrix for handle cash collected Link");

}
//ACCESS DATA

function accessData(symbol, matchCount, gameInstance: SLBB) {
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
    console.error("Error in accessData:");
    return 0;
  }
}

//HAS SYMBOL IN MATRIX
function hasSymbolInMatrix(matrix: string[][], symbolId: string): boolean {
  return matrix.some(row => row.find(symbol => symbol === symbolId));
}

//GET INDICES OF THE SYMBOL 
// function findIndicesOfSymbol(symbol: any, matrix: any[][]) { 
// const indices: [number, number][] = [];
//   for (let row = 0; row < matrix.length; row++) {
//     for (let col = 0; col < matrix[row].length; col++) {
//       if (matrix[row][col] === symbol) {
//         indices.push([row, col]);  
//     }
//     }
//   }
//   return indices;
// }

//NOTE: 
//TO CALCUALTE AND CHECK WINNINGS
export function checkForWin(gameInstance: SLBB) {
  try {
    let coinWins: number = 0;
    let totalWin: number = 0;
    let winningLines: number[] = [];


    const { settings, currentGameData } = gameInstance;
    if (settings.heisenberg.isTriggered) {
      handleHeisenbergSpin(gameInstance)
    }

    const coinSymbolId = settings.coins.SymbolID;
    const cashCollectId = settings.cashCollect.SymbolID;
    const linkSymbolId = settings.link.SymbolID;
    const megaLinkSymbolId = settings.megalink.SymbolID;
    const losPollosId = settings.losPollos.SymbolID;
    const prizeCoinId = settings.prizeCoin.SymbolID;
    const linesApiData = currentGameData.gameSettings.linesApiData;
    const resultSymbolMatrix = settings.resultSymbolMatrix;

    const hasCoinSymbols = hasSymbolInMatrix(resultSymbolMatrix, coinSymbolId);
    const hasCashCollect = hasSymbolInMatrix(resultSymbolMatrix, cashCollectId);
    const hasLinkSymbols = hasSymbolInMatrix(resultSymbolMatrix, linkSymbolId);
    const hasMegaLinkSymbols = hasSymbolInMatrix(resultSymbolMatrix, megaLinkSymbolId);
    const hasLosPollosSymbols = hasSymbolInMatrix(resultSymbolMatrix, losPollosId);
    const hasPrizeCoinSymbols = hasSymbolInMatrix(resultSymbolMatrix, prizeCoinId);



    handleFreeSpin(hasLosPollosSymbols, hasCashCollect, gameInstance)

    console.log("freespin", settings.freeSpin);


    if (hasCoinSymbols) {
      replaceCoinsWithValues(gameInstance, 'result');
    }

    // console.log(resultSymbolMatrix, "result");
    for (let lineIndex = 0; lineIndex < linesApiData.length; lineIndex++) {
      const line = linesApiData[lineIndex];
      const firstSymbolId = resultSymbolMatrix[line[0]]?.[0];
      const { isWinningLine, matchCount, matchedIndices } = checkLineSymbols(firstSymbolId, line, gameInstance);

      if (isWinningLine && !settings.heisenberg.isTriggered) {
        // console.log(matchedIndices, "matchedIndices");
        // console.log(matchCount, "match count");
        const winMultiplier = accessData(firstSymbolId, matchCount, gameInstance);
        // console.log(winMultiplier, "winMultiplier");
        totalWin += winMultiplier * gameInstance.settings.BetPerLines;
        winningLines.push(lineIndex);
        settings._winData.winningLines.push(lineIndex)
        const formattedIndices = matchedIndices.map(
          ({ col, row }) => `${col},${row}`
      );
       const validIndices = formattedIndices.filter(
        (index) => index.length > 2
    );
    if (validIndices.length > 0) {
        // console.log(settings.lastReel, 'settings.lastReel')
        console.log(validIndices);
        settings._winData.winningSymbols.push(validIndices);
    }
        settings.matchedIndices.push(matchedIndices);
        
      }
    }
  

    if ((hasCashCollect && (hasLinkSymbols || hasMegaLinkSymbols)) && !settings.heisenberg.isTriggered) {
      console.log("HEISENBERG IS TRIGGERED");
      settings.heisenberg.isTriggered = true;
      settings.heisenberg.freeSpin.noOfFreeSpins = 3;
      settings.prevresultSymbolMatrix = settings.resultSymbolMatrix;
      const cashCollectIndices = findIndicesOfSymbol(settings.cashCollect.SymbolID, settings.resultSymbolMatrix);
      cashCollectIndices.map((index)=> settings.heisenbergFreeze.add(index.toString()))
      // console.log(cashCollectIndices);      
      const  linkIndices = findIndicesOfSymbol(settings.link.SymbolID, settings.resultSymbolMatrix);
      linkIndices.map((index)=> settings.heisenbergFreeze.add(index.toString()))
      const losPollosIndices = findIndicesOfSymbol(settings.losPollos.SymbolID, settings.resultSymbolMatrix );
      losPollosIndices.map((index)=> settings.heisenbergFreeze.add(index.toString()))
      // console.log(settings.heisenbergFreeze, "heisenbergFreeze set after link indices")
    }
    // console.log(totalWin, "Total win before trigger of heisenberg ");
    if (hasCoinSymbols && hasCashCollect && !settings.heisenberg.isTriggered) {
      coinWins = handleCoinsAndCashCollect(gameInstance);
      totalWin += coinWins;
    }

    if (settings.heisenberg.isTriggered) {
      totalWin += settings.heisenberg.payout;
      console.log(totalWin, "Total win after trigger of heisenberg");
      settings.heisenberg.payout = 0;
    }
    // console.log("winning ", winningLines);

    gameInstance.playerData.currentWining = totalWin;
    gameInstance.playerData.haveWon += totalWin;
    settings._winData.winningLines
    console.log("PLAYERDATA:", gameInstance.playerData);
    
    makeResultJson(gameInstance)
    gameInstance.incrementPlayerBalance(gameInstance.playerData.currentWining)
    settings.coins.values = [];
    settings._winData.winningLines = winningLines;
    gameInstance.playerData.currentWining = 0
    
    // settings.hasCascading = false;
    // settings.resultSymbolMatrix = [];
    // settings.tempReelSym = [];
    // settings.tempReel = [];
    // settings.payoutAfterCascading = 0;
    // settings.cascadingResult = [];
    // settings.freeSpin.useFreeSpin = false;
    // console.log(totalWin, winningLines);

  } catch (error) {
    console.error("Error in checkForWin", error);
    return {
      totalWin: 0,
      winningLines: [],
    };
  }
}


export function makeResultJson(gameInstance: SLBB) {
  try {
    const { settings, playerData } = gameInstance;
    const credits = gameInstance.getPlayerData().credits + playerData.currentWining
    const Balance = Number(credits.toFixed(2))
    const sendData = {
      GameData: {
        ResultReel: settings.resultSymbolMatrix,
        isFreeSpin: settings.freeSpin.isFreeSpin,
        freeSpinCount: settings.freeSpin.freeSpinCount,
        linesToEmit: settings._winData.winningLines,
        symbolsToEmit: settings._winData.winningSymbols,
        WinAmount:gameInstance.playerData.currentWining,
        freeSpins:{
          count:settings.freeSpin.freeSpinCount,
          isNewAdded:settings.freeSpin.isFreeSpin
        },
        winData:{
          coinValues:settings.coins.values,
          losPollos:settings.losPollos.values
        },
        jackpot:0,
         isBonus:settings.heisenberg.isTriggered,
         BonusResult:settings.heisenbergSymbolMatrix,
        
      },
      PlayerData: {
        Balance: Balance,
        currentWining: playerData.currentWining,
        totalbet: playerData.totalbet,
        haveWon: playerData.haveWon,
      }
    };    
    gameInstance.sendMessage('ResultData', sendData);
    console.log(sendData.PlayerData);
    
  } catch (error) {
    console.error("Error generating result JSON or sending message:", error);
  }
}


function handleFreeSpin(hasLP: boolean, hasCC: boolean, gameInstance: SLBB) {
  const { settings } = gameInstance
  if (hasLP && hasCC) {

    settings.losPollos.values = [];
    const matrix = settings.resultSymbolMatrix
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        const losPollosValue = getRandomValue(gameInstance, "freespin")
        const symbol = matrix[row][col];
        if (symbol === settings.losPollos.SymbolID) {
          settings.losPollos.values.push({ index: [row, col], value: losPollosValue })
        }
      }
    }
    let count = 0
    settings.losPollos.values.map((value) => {
      count += value.value
    })
    settings.freeSpin.isFreeSpin = true
    settings.freeSpin.freeSpinCount += count

  }
}
