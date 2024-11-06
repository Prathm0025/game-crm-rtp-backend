import { WinData } from "../BaseSlotGame/WinData";
import { SLBB } from "./breakingBadBase";
import { convertSymbols, UiInitData } from "../../Utils/gameUtils";
import { specialIcons } from "./types";

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
    bonusResultMatrix: [],
    currentGamedata: gameData.gameSettings,
    lineData: [],
    _winData: new WinData(gameInstance),
    currentBet: 0,
    currentLines: 0,
    BetPerLines: 0,
    reels: [],
    bonusReels: [],
    jackpot: {
      isTriggered: false,
      payout: 0,
    },
    grandPrize: {
      isTriggered: false,
      payout: 0
    },
    isCashCollect: false,
    freeSpin: {
      isEnabled: gameData.gameSettings.freeSpin.isEnabled,
      isTriggered: false,
      isFreeSpin: false,
      cashCollectValues: [],
      count: 0,
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
    bonus: {
      isTriggered: false,
      count: 0,
      payout: 0,
    },
    cashCollectPrize: {
      isTriggered: false,
      payout: 0
    }
  }
}

export function generateInitialReel(gameSettings: any): string[][] {
  const reels = [[], [], [], [], []];
  const validSymbols = gameSettings.Symbols.filter(symbol =>
    !symbol.useHeisenberg || symbol.Name === "CashCollect" || symbol.Name === "Coins"
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
export function makePayLines(gameInstance: SLBB) {
  const { settings } = gameInstance;
  settings.currentGamedata.Symbols.forEach((element) => {
    if (!element.useWildSub) {
      handleSpecialSymbols(element, gameInstance);
    }
  });
}

function handleSpecialSymbols(symbol: any, gameInstance: SLBB) {
  switch (symbol.Name) {
    case specialIcons.wild:
      gameInstance.settings.wild.SymbolName = symbol.Name;
      gameInstance.settings.wild.SymbolID = symbol.Id;
      gameInstance.settings.wild.useWild = false;
      break;
    case specialIcons.losPollos:
      gameInstance.settings.losPollos.SymbolName = symbol.Name;
      gameInstance.settings.losPollos.SymbolID = symbol.Id;
      gameInstance.settings.losPollos.useWild = false;
      break;
    case specialIcons.coins:
      gameInstance.settings.coins.SymbolName = symbol.Name;
      gameInstance.settings.coins.SymbolID = symbol.Id;
      gameInstance.settings.coins.useWild = false;
      break;
    case specialIcons.link:
      gameInstance.settings.link.SymbolName = symbol.Name;
      gameInstance.settings.link.SymbolID = symbol.Id;
      gameInstance.settings.link.useWild = false;
      break;
    case specialIcons.megalink:
      gameInstance.settings.megalink.SymbolName = symbol.Name;
      gameInstance.settings.megalink.SymbolID = symbol.Id;
      gameInstance.settings.megalink.useWild = false;
      break;
    case specialIcons.prizeCoin:
      gameInstance.settings.prizeCoin.SymbolName = symbol.Name;
      gameInstance.settings.prizeCoin.SymbolID = symbol.Id;
      gameInstance.settings.prizeCoin.useWild = false;
      break;
    case specialIcons.cashCollect:
      gameInstance.settings.cashCollect.SymbolName = symbol.Name;
      gameInstance.settings.cashCollect.SymbolID = symbol.Id;
      gameInstance.settings.cashCollect.useWild = false;
      break;
    default:
  }
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

export function sendInitData(gameInstance: SLBB) {
  UiInitData.paylines = convertSymbols(gameInstance.settings.Symbols);
  const credits = gameInstance.getPlayerData().credits
  const Balance = credits.toFixed(2)
  const reels = generateInitialReel(gameInstance.settings);
  // const heisenbergReels = generateInitialHeisenberg(gameInstance.settings);
  gameInstance.settings.reels = reels;
  // gameInstance.settings.heisenbergReels = heisenbergReels;
  const dataToSend = {
    GameData: {
      Reel: reels,
      Lines: gameInstance.currentGameData.gameSettings.linesApiData,
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
      if (symbol === undefined) {
        console.error(`Symbol at position [${rowIndex}, ${i}] is undefined.`);
        return { isWinningLine: false, matchCount: 0, matchedIndices: [] };
      }
      switch (true) {
        case (symbol == currentSymbol || symbol === wildSymbol) && isWildSubAllowed(symbol):
          // console.log(symbol, "SYMBOL HERE");

          matchCount++;
          matchedIndices.push({ col: i, row: rowIndex });
          break;
        case currentSymbol === wildSymbol:
          // console.log(currentSymbol, "wild symbol");

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
export function getCoinsValues(gameInstance: SLBB, matrixType: 'result' | 'heisenberg' | 'prev') {
  const { settings } = gameInstance;
  const matrix = matrixType === 'result'
    ? settings.resultSymbolMatrix
    : settings.bonusResultMatrix
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      const symbol = matrix[row][col];

      if (symbol == settings.coins.SymbolID.toString()) {
        const coinValue = getRandomValue(gameInstance, "coin");

        // Check if index already exists in settings.coins.values
        const indexExists = settings.coins.values.find(
          item => item.index[0] === row && item.index[1] === col
        );

        // Only add the new value if the index does not already exist
        if (!indexExists) {
          settings.coins.values.push({ index: [row, col], value: coinValue });
        }
      }
    }
  }
}

//COINS +CASH COLLECT ON 0 OR 4 -> triggers coin collection with cash collect
function handleCoinsAndCashCollect(
  gameInstance: SLBB,
  matrixType: 'result' | 'heisenberg'
): number {
  const { settings } = gameInstance;
  settings.isCashCollect = true;
  let totalCoinValue = 0;
  let cashCollectCount = 0;
  const cashCollectSymbolId = settings.cashCollect.SymbolID;
  const coinSymbolId = settings.coins.SymbolID;
  let hasCoinSymbols: boolean
  if (matrixType == 'heisenberg') {
    hasCoinSymbols = hasSymbolInMatrix(settings.bonusResultMatrix, coinSymbolId.toString());
    //handle cc count 
    for (let i = 0; i < settings.bonusResultMatrix.length; i++) {
      for (let j = 0; j < settings.bonusResultMatrix[i].length; j++) {
        if (settings.bonusResultMatrix[i][j] == cashCollectSymbolId.toString()) {
          cashCollectCount++;
        }
      }
    }
  } else if (matrixType == 'result') {
    hasCoinSymbols = hasSymbolInMatrix(settings.resultSymbolMatrix, coinSymbolId.toString());
    console.log("hasCoinSymbols", hasCoinSymbols);

    //handle cc count 
    if (hasSymbolInMatrix(settings.resultSymbolMatrix, cashCollectSymbolId.toString())) {
      for (let i = 0; i < settings.resultSymbolMatrix.length; i++) {
        for (let j of [0, 4]) {
          if (settings.resultSymbolMatrix[i][j] == cashCollectSymbolId.toString()) {
            cashCollectCount++;
          }
        }
      }
    }
  }

  if (settings.coins.values.length > 0) {
    const coinValue = settings.coins.values.reduce((total, coin) => total + coin.value, 0);
    totalCoinValue += coinValue;
  }

  console.log("cashCollectCount", cashCollectCount);

  if (cashCollectCount > 0) {
    totalCoinValue *= cashCollectCount;
    return totalCoinValue;
  }
  return 0;
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
function getPayoutIndexBasedOnProbability(probabilities) {
  const randomNum = Math.random();
  let cumulativeProbability = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulativeProbability += probabilities[i];

    if (randomNum <= cumulativeProbability) {
      return i;
    }
  }
  return -1;
}

//HAS SYMBOL IN MATRIX
function hasSymbolInMatrix(matrix: any[][], symbolId: string): boolean {
  return matrix.some(row => row.find(symbol => symbol == symbolId));
}


//NOTE: 
//TO CALCUALTE AND CHECK WINNINGS
export function checkForWin(gameInstance: SLBB) {
  try {
    let coinWins: number = 0;
    let totalWin: number = 0;
    let winningLines: number[] = [];

    const { settings, currentGameData } = gameInstance;
    settings.isCashCollect = false;

    // if (settings.heisenberg.isTriggered) {
    //   handleHeisenbergSpin(gameInstance)
    // }

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

    console.log("Result Matrix", gameInstance.settings.resultSymbolMatrix);


    //NOTE: freespin lp
    settings.freeSpin.isTriggered = false
    // if()
    handleFreeSpin(hasLosPollosSymbols, hasCashCollect, gameInstance)

    // console.log("freespin", settings.freeSpin);

    if (settings.bonus.isTriggered && hasPrizeCoinSymbols) {
      gameInstance.currentGameData.gameSettings.diamondWinnings.selectedIndexForDiamond =
        getPayoutIndexBasedOnProbability(gameInstance.currentGameData.gameSettings.diamondWinnings.probability);
    }
    if (hasCoinSymbols) {
      getCoinsValues(gameInstance, 'result');
    }

    // console.log(resultSymbolMatrix, "result");
    for (let lineIndex = 0; lineIndex < linesApiData.length; lineIndex++) {
      const line = linesApiData[lineIndex];
      const firstSymbolId = resultSymbolMatrix[line[0]]?.[0];
      const { isWinningLine, matchCount, matchedIndices } = checkLineSymbols(firstSymbolId, line, gameInstance);

      if (isWinningLine && !settings.bonus.isTriggered) {
        const winMultiplier = accessData(firstSymbolId, matchCount, gameInstance);
        totalWin += winMultiplier * gameInstance.settings.BetPerLines;

        winningLines.push(lineIndex);

        settings._winData.winningLines.push(lineIndex)
        const formattedIndices = matchedIndices.map(
          ({ col, row }) => `${col},${row}`
        );
        settings._winData.winningSymbols.push(formattedIndices);

      }
    }

    if (hasCoinSymbols && hasCashCollect && !settings.bonus.isTriggered) {
      coinWins = handleCoinsAndCashCollect(gameInstance, "result");
      console.log(coinWins, "coin collected");
      totalWin += coinWins;
    }

    if (settings.bonus.isTriggered) {
      totalWin += settings.bonus.payout;
      // console.log(totalWin, "Total win after trigger of heisenberg");
      settings.bonus.payout = 0;
    }
    // console.log("winning ", winningLines);

    gameInstance.playerData.currentWining = totalWin;
    gameInstance.playerData.haveWon += totalWin;
    settings._winData.winningLines = winningLines;
    // console.log("PLAYERDATA:", gameInstance.playerData);

    makeResultJson(gameInstance)
    gameInstance.incrementPlayerBalance(gameInstance.playerData.currentWining)
    // settings.coins.values = [];
    settings._winData.winningLines = [];
    settings._winData.winningSymbols = [];
    settings.losPollos.values = [];
    settings.coins.values = [];
    gameInstance.playerData.currentWining = 0
    settings._winData.winningLines = [];
    // gameInstance.currentGameData.gameSettings.diamondWinnings.selectedIndexForDiamond = -1;


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
        // isFreeSpin: settings.freeSpin.isTriggered,
        // freeSpinCount: settings.freeSpin.freeSpinCount,
        linesToEmit: settings._winData.winningLines,
        symbolsToEmit: settings._winData.winningSymbols,
        WinAmount: gameInstance.playerData.currentWining,
        freeSpins: {
          count: settings.freeSpin.count,
          isNewAdded: settings.freeSpin.isTriggered
        },
        winData: {
          coinValues: settings.coins.values,
          losPollos: settings.losPollos.values
        },
        // isCashCollect: settings.isCashCollect,
        jackpot: settings.jackpot.payout,
        // bonus: {
        //   isBonus: settings.heisenberg.isTriggered,
        //   BonusResult: settings.heisenbergSymbolMatrix.map(row => row.map(item => Number(item))),
        //   payout: settings.heisenberg.payout,
        //   spinCount: settings.heisenberg.freeSpin.noOfFreeSpins,
        //   freeSpinAdded: settings.heisenberg.freeSpin.freeSpinsAdded,
        //   isWalterStash: settings.jackpot.isTriggered,
        //   walterStashPayout: settings.jackpot.payout,
        //   isGrandPrize: settings.grandPrize.isTriggered,
        //   grandPrizePayout: settings.grandPrize.payout,
        //   freezeIndices: Array.from(settings.heisenbergFreeze, item =>
        //     item.split(',').map(Number)
        //   ),
        // },

      },
      PlayerData: {
        Balance: Balance,
        currentWining: playerData.currentWining,
        totalbet: playerData.totalbet,
        haveWon: playerData.haveWon,
      }
    };
    //FIX: remove logs
    // console.log("losPollosValues", settings.losPollos.values);
    // console.log("coins", settings.coins.values);
    // console.log("linestoemit", settings._winData.winningLines);
    // console.log("symtoemit", settings._winData.winningSymbols);

    gameInstance.sendMessage('ResultData', sendData);
    console.log(sendData);
    console.log("coins", sendData.GameData.winData.coinValues);
    console.log("lp", sendData.GameData.winData.losPollos);
    console.log("symbolsToEmit", sendData.GameData.symbolsToEmit);

  } catch (error) {
    console.error("Error generating result JSON or sending message:", error);
  }
}

//NOTE: lp freespin
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
    if (count > 0) {
      settings.freeSpin.isTriggered = true
    }
    settings.freeSpin.isFreeSpin = true
    settings.freeSpin.count += count
  }
}

