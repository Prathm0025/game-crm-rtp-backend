
import { WinData } from "../BaseSlotGame/WinData";
import { SLBB } from "./breakingBadBase";
import { convertSymbols, UiInitData } from "../../Utils/gameUtils";

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
    freeSpinData: [],
    jackpot: {
      symbolName: "",
      symbolsCount: 0,
      symbolId: 0,
      defaultAmount: 0,
      increaseValue: 0,
      useJackpot: false,
    },
    freeSpin: {
      symbolID: getSymbolIdByName("FreeSpin"),
      freeSpinMuiltiplier: [],
      freeSpinStarted: false,
      freeSpinsAdded: false,
      freeSpinCount: 0,
      noOfFreeSpins: 0,
      useFreeSpin: false,
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
    },
    heisenberg:{
      isTriggered:false,
      payout:0,
    },
    cashCollectPrize:{
      isTriggered:false,
      payout:0,
    }

  };
}


//GET INITIAL REEL  
export function generateInitialReel(gameSettings: any): string[][] {
    const reels = [[], [], [], [],[]];
    gameSettings.Symbols.forEach(symbol => {
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
  gameInstance.settings.reels = reels;
  const dataToSend = {
    GameData: {
      // Reel: reels,
      // Bets: gameInstance.settings.currentGamedata.bets,
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
    const { settings} = gameInstance; 
    const wildSymbol = settings.wild.SymbolID || "";
    let matchCount = 1;
    let currentSymbol = firstSymbol;
    const matchedIndices: { col: number; row: number }[] = [
      { col: 0, row: line[0] },
    ];
    for (let i = 1; i < line.length; i++) {
      const rowIndex = line[i];
      const symbol = settings.resultSymbolMatrix[rowIndex][i];
      if (symbol === undefined) {
        console.error(`Symbol at position [${rowIndex}, ${i}] is undefined.`);
        return { isWinningLine: false, matchCount: 0, matchedIndices: [] };
      }
      switch (true) {
        case symbol == currentSymbol || symbol === wildSymbol:
          matchCount++;
          matchedIndices.push({ col: i, row: rowIndex });
          break;
        case currentSymbol === wildSymbol:
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

// Function to replace "Coins" symbols with their respective values

export function replaceCoinsWithValues(gameInstance: SLBB) {
  const { settings } = gameInstance;
  console.log(settings.resultSymbolMatrix, "matrix before replacement");
  

  for (let row = 0; row < settings.resultSymbolMatrix.length; row++) {
    for (let col = 0; col < settings.resultSymbolMatrix[row].length; col++) {
      const symbol = settings.resultSymbolMatrix[row][col];

      if (symbol ===settings.coins.SymbolID) {
        settings.resultSymbolMatrix[row][col] = getRandomCoinValue(gameInstance);
      }
    }
  }
  console.log(settings.resultSymbolMatrix, "matrix after replacement");
  
}

//TO GET VALUE OF COIN AT INDEX

function getCoinValue(coinSymbol: string, gameInstance: SLBB): number {
  const coinIndex = gameInstance.currentGameData.gameSettings.coinsvalue.indexOf(coinSymbol);
  return gameInstance.currentGameData.gameSettings.coinsvalueprob[coinIndex] || 0;
}



//COINS +CASH COLLECT ON 0 OR 4 -> triggers coin collection with cash collect

function handleCoinsAndCashCollect(
  gameInstance: SLBB
): number {
  const { currentGameData, settings } = gameInstance;
  let totalCoinValue = 0;
  let cashCollectCount = 0;
  const cashCollectSymbolId =settings.cashCollect.SymbolID;
  const coinSymbolId = settings.coins.SymbolID;  
  settings.resultSymbolMatrix.forEach((row) => {
    row.forEach((symbol, colIndex) => {
      if (currentGameData.gameSettings?.coinsvalue?.includes(symbol) && (symbol == coinSymbolId)) {
        const coinValue = getCoinValue(symbol, gameInstance);
        totalCoinValue += coinValue;
        console.log(currentGameData.gameSettings.Symbols.find(symbol => symbol.Name === "CashCollect").Id);
        console.log(symbol);
        
      } 
      else if (symbol === cashCollectSymbolId && (colIndex === 0 || colIndex === 4)) {
        cashCollectCount++;
      }
    });
  });

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
function handleCashCollectandLink(gameInstance: SLBB) {
  const { settings } = gameInstance;
  const coinSymbolId = settings.coins.SymbolID;
  
  let coinCount = 0;
  settings.resultSymbolMatrix.forEach(row => {
    coinCount += row.filter(symbol => symbol === coinSymbolId).length;
  });

  if (!settings.heisenberg.isTriggered) {
    settings.heisenberg.isTriggered = true;
    settings.freeSpin.freeSpinStarted = true;
    settings.freeSpin.noOfFreeSpins = 3; 
    console.log("Cash Collect and Link Triggered. Free Spins set to 3.");
  }

  if (settings.freeSpin.noOfFreeSpins > 0) {
    settings.freeSpin.noOfFreeSpins--; 

    if (coinCount > 0) {
      settings.freeSpin.noOfFreeSpins = 3;
      console.log("Coin found! Reset free spins to 3.");
    }

    if (coinCount >= 15) {
      settings.heisenberg.payout = 1000; 
      console.log("Grand Prize Awarded!");
      settings.freeSpin.freeSpinStarted = false;
    }
  } else {
    settings.freeSpin.freeSpinStarted = false; 
    console.log("Free spins have ended.");
  }

  console.log(settings.resultSymbolMatrix, "result matrix after Cash Collect and Link");
}

//CASH COLLECCT + LOS POLLOS -> TRIGGERS FREE SPINS BASED ON NUMBER OF LOSPOLLOS * 3
function handleCashCollectandLospollos( gameInstance:SLBB){
  const {settings} = gameInstance;
  console.log("handle cash collect and lospollos getting called");
    
  settings.freeSpin.freeSpinStarted = true;
  

  console.log(settings.resultSymbolMatrix, "result matrix for handle cash collected Link");
  
}

//CASH COLLECT + PRIZE COIN -> TRIGGERS CASH COLLECT PRIZES 
function handleCashCollectandPrizeCoin( gameInstance:SLBB){
  const {settings} = gameInstance;
  console.log("handle cash collect and prize coin getting called");
    
  settings.cashCollectPrize.isTriggered = true;
  settings.cashCollectPrize.payout =20;

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
    // console.error("Error in accessData:");
    return 0;
  }
}

//HAS SYMBOL IN MATRIX
function hasSymbolInMatrix(resultSymbolMatrix: string[][], symbolId): boolean {
  return resultSymbolMatrix.some(row => row.find(symbol => symbol === symbolId));
}


//TO CALCUALTE AND CHECK WINNINGS

export function checkForWin(gameInstance: SLBB) {
  try {
    let coinWins:number = 0;
    let totalWin:number = 0;
    let winningLines: number[] = [];


    const { settings, currentGameData } = gameInstance;
    const coinSymbolId =settings.coins.SymbolID;  
    const cashCollectId =settings.cashCollect.SymbolID;  
    const linkSymbolId = settings.link.SymbolID;    
    const megaLinkSymbolId = settings.megalink.SymbolID;
    const losPollosId  = settings.losPollos.SymbolID;
    const prizeCoinId = settings.prizeCoin.SymbolID;
    const linesApiData = currentGameData.gameSettings.linesApiData;
    const resultSymbolMatrix = settings.resultSymbolMatrix;

   const hasCoinSymbols = hasSymbolInMatrix(resultSymbolMatrix, coinSymbolId);
   const hasCashCollect = hasSymbolInMatrix(resultSymbolMatrix, cashCollectId);
   const hasLinkSymbols = hasSymbolInMatrix(resultSymbolMatrix, linkSymbolId);
   const hasMegaLinkSymbols = hasSymbolInMatrix(resultSymbolMatrix, megaLinkSymbolId);
   const hasLosPollosSymbols = hasSymbolInMatrix(resultSymbolMatrix, losPollosId);
   const hasPrizeCoinSymbols = hasSymbolInMatrix(resultSymbolMatrix, prizeCoinId);

    if (hasCoinSymbols) {
      replaceCoinsWithValues(gameInstance);
    }

    console.log(resultSymbolMatrix, "result");
    for (let lineIndex = 0; lineIndex < linesApiData.length; lineIndex++) {
      const line = linesApiData[lineIndex];
      const firstSymbolId = resultSymbolMatrix[line[0]]?.[0];
      const { isWinningLine, matchCount, matchedIndices } = checkLineSymbols(firstSymbolId, line, gameInstance);       
      if (isWinningLine) {
        console.log(matchedIndices, "matchedIndices");                
        console.log(matchCount, "match count");
        const winMultiplier = accessData(firstSymbolId, matchCount, gameInstance); 
        console.log(winMultiplier, "winMultiplier");
        totalWin += winMultiplier*gameInstance.settings.BetPerLines; 
        winningLines.push(lineIndex);
       
      }
    }
    if(hasCoinSymbols && hasCashCollect){
    coinWins = handleCoinsAndCashCollect(gameInstance);
    totalWin += coinWins;
    }

    if(hasCashCollect && (hasLinkSymbols || hasMegaLinkSymbols)){
      handleCashCollectandLink(gameInstance);
    }    
    console.log(totalWin, "Total win before trigger of heisenberg ");


    if(settings.heisenberg.isTriggered){
      totalWin += settings.heisenberg.payout;
      console.log(totalWin, "Total win after trigger of heisenberg");
      settings.heisenberg.payout =0;
      settings.heisenberg.isTriggered = false;
    }
    console.log(totalWin, winningLines);
    return {
      totalWin,
      winningLines,
    };
  } catch (error) {
    console.error("Error in checkForWin", error);
    return {
      totalWin: 0,
      winningLines: [],
    };
  }
}


