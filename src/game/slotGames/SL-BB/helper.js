"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGameSettings = initializeGameSettings;
exports.makePayLines = makePayLines;
exports.generateInitialReel = generateInitialReel;
exports.generateInitialBonusReel = generateInitialBonusReel;
exports.sendInitData = sendInitData;
exports.getRandomValue = getRandomValue;
exports.getCoinsValues = getCoinsValues;
exports.handleCoinsAndCashCollect = handleCoinsAndCashCollect;
exports.checkForWin = checkForWin;
exports.makeResultJson = makeResultJson;
const WinData_1 = require("../BaseSlotGame/WinData");
const gameUtils_1 = require("../../Utils/gameUtils");
const types_1 = require("./types");
const bonus_1 = require("./bonus");
const utils_1 = require("../../../utils/utils");
function initializeGameSettings(gameData, gameInstance) {
    // const getSymbolIdByName = (name: string) => {
    //   const symbol = gameData.gameSettings.Symbols.find((s: any) => s.Name === name);
    //   return symbol ? symbol.Id : -1;
    // };
    return {
        id: gameData.gameSettings.id,
        matrix: gameData.gameSettings.matrix,
        bets: gameData.gameSettings.bets,
        Symbols: gameInstance.initSymbols,
        resultSymbolMatrix: [],
        bonusResultMatrix: [],
        currentGamedata: gameData.gameSettings,
        lineData: gameData.gameSettings.linesApiData,
        _winData: new WinData_1.WinData(gameInstance),
        currentBet: 0,
        currentLines: 0,
        BetPerLines: 0,
        reels: [],
        bonusReels: [],
        isCoinCollect: false,
        jackpot: {
            isTriggered: false,
            payout: gameData.gameSettings.jackpot.payout,
            payoutProbs: gameData.gameSettings.jackpot.payoutProbs,
            win: 0
        },
        isCashCollect: false,
        bonus: {
            isBonus: false,
            isTriggered: false,
            isWalterStash: false,
            isMegaLink: false,
            count: 0,
            payout: 0,
            megaLinkCoinValue: gameData.gameSettings.megaLinkCoinValue,
            megaLinkCoinProb: gameData.gameSettings.megaLinkCoinProb
        },
        freeSpin: {
            isEnabled: gameData.gameSettings.freeSpin.isEnabled,
            isTriggered: false,
            isFreeSpin: false,
            cashCollectValues: [],
            count: 0,
            LPValues: gameData.gameSettings.freeSpin.LPValue,
            LPProbs: gameData.gameSettings.freeSpin.LPValueProbs,
        },
        wild: {
            SymbolName: "Wild",
            SymbolID: "-1",
            useWild: false,
        },
        link: {
            SymbolName: "Link",
            SymbolID: "-1",
            useWild: false,
        },
        megalink: {
            SymbolName: "MegaLink",
            SymbolID: "-1",
            useWild: false,
        },
        cashCollect: {
            SymbolName: "CashCollect",
            SymbolID: "-1",
            useWild: false,
            values: [],
        },
        coins: {
            SymbolName: "Coins",
            SymbolID: "-1",
            useWild: false,
            values: [],
            bonusValues: []
        },
        prizeCoin: {
            SymbolName: "PrizeCoin",
            SymbolID: "-1",
            useWild: false,
        },
        losPollos: {
            SymbolName: "LosPollos",
            SymbolID: "-1",
            useWild: false,
            values: []
        },
        blanks: ["9"],
        cashCollectPrize: {
            isTriggered: false,
            payout: 0
        }
    };
}
function makePayLines(gameInstance) {
    const { settings } = gameInstance;
    settings.currentGamedata.Symbols.forEach((element) => {
        if (!element.useWildSub) {
            handleSpecialSymbols(element, gameInstance);
        }
    });
}
function handleSpecialSymbols(symbol, gameInstance) {
    switch (symbol.Name) {
        case types_1.specialIcons.wild:
            gameInstance.settings.wild.SymbolName = symbol.Name;
            gameInstance.settings.wild.SymbolID = symbol.Id;
            gameInstance.settings.wild.useWild = false;
            break;
        case types_1.specialIcons.losPollos:
            gameInstance.settings.losPollos.SymbolName = symbol.Name;
            gameInstance.settings.losPollos.SymbolID = symbol.Id;
            gameInstance.settings.losPollos.useWild = false;
            break;
        case types_1.specialIcons.coins:
            gameInstance.settings.coins.SymbolName = symbol.Name;
            gameInstance.settings.coins.SymbolID = symbol.Id;
            gameInstance.settings.coins.useWild = false;
            break;
        case types_1.specialIcons.link:
            gameInstance.settings.link.SymbolName = symbol.Name;
            gameInstance.settings.link.SymbolID = symbol.Id;
            gameInstance.settings.link.useWild = false;
            break;
        case types_1.specialIcons.megalink:
            gameInstance.settings.megalink.SymbolName = symbol.Name;
            gameInstance.settings.megalink.SymbolID = symbol.Id;
            gameInstance.settings.megalink.useWild = false;
            break;
        case types_1.specialIcons.prizeCoin:
            gameInstance.settings.prizeCoin.SymbolName = symbol.Name;
            gameInstance.settings.prizeCoin.SymbolID = symbol.Id;
            gameInstance.settings.prizeCoin.useWild = false;
            break;
        case types_1.specialIcons.cashCollect:
            gameInstance.settings.cashCollect.SymbolName = symbol.Name;
            gameInstance.settings.cashCollect.SymbolID = symbol.Id;
            gameInstance.settings.cashCollect.useWild = false;
            break;
        default:
    }
}
function generateInitialReel(gameSettings) {
    const reels = [[], [], [], [], []];
    const validSymbols = gameSettings.Symbols.filter(symbol => !symbol.useHeisenberg ||
        // symbol.Name === gameSettings.cashCollect.SymbolName ||
        symbol.Name === gameSettings.coins.SymbolName);
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
        (0, gameUtils_1.shuffleArray)(reel);
    });
    gameSettings.reels = reels;
    return reels;
}
//GENERATE INITIAL HEISENBERG REEL
function generateInitialBonusReel(gameSettings) {
    const reels = [[], [], [], [], []];
    //FIX: alter later
    // const ccReelInstance = [
    //   1,
    //   1,
    //   1,
    //   1,
    //   1
    // ]
    const bonusSymbols = gameSettings.Symbols.filter(symbol => symbol.useHeisenberg);
    bonusSymbols.forEach(symbol => {
        for (let i = 0; i < 5; i++) {
            let count = symbol.reelInstance[i] || 0;
            // //FIX: alter later
            // if (symbol.Id == gameSettings.cashCollect.SymbolID) {
            //   count = ccReelInstance[i]
            // }
            for (let j = 0; j < count; j++) {
                reels[i].push(symbol.Id);
            }
        }
    });
    reels.forEach(reel => {
        (0, gameUtils_1.shuffleArray)(reel);
    });
    gameSettings.bonusReels = reels;
    return reels;
}
function sendInitData(gameInstance) {
    gameUtils_1.UiInitData.paylines = (0, gameUtils_1.convertSymbols)(gameInstance.settings.Symbols);
    const credits = gameInstance.getPlayerData().credits;
    const Balance = credits.toFixed(2);
    // const reels = generateInitialReel(gameInstance.settings);
    // const heisenbergReels = generateInitialBonusReel(gameInstance.settings);
    // gameInstance.settings.reels = reels;
    // gameInstance.settings.bonusReels = heisenbergReels;
    const dataToSend = {
        GameData: {
            Reel: gameInstance.settings.reels,
            BonusReel: gameInstance.settings.bonusReels,
            Lines: gameInstance.currentGameData.gameSettings.linesApiData,
            Bets: gameInstance.settings.currentGamedata.bets,
            Jackpot: gameInstance.settings.jackpot.payout
        },
        UIData: gameUtils_1.UiInitData,
        PlayerData: {
            Balance: Balance,
            haveWon: gameInstance.playerData.haveWon,
            currentWining: gameInstance.playerData.currentWining,
            totalbet: gameInstance.playerData.totalbet,
        },
    };
    gameInstance.sendMessage("InitData", dataToSend);
}
function getRandomValue(gameInstance, type) {
    const { currentGameData, settings } = gameInstance;
    let values;
    let probabilities;
    if (type === 'coin') {
        values = currentGameData.gameSettings.coinsvalue.map((value) => (0, utils_1.precisionRound)(value * settings.BetPerLines, 5));
        probabilities = currentGameData.gameSettings.coinsvalueprob;
    }
    else if (type === 'freespin') {
        values = settings.freeSpin.LPValues;
        probabilities = settings.freeSpin.LPProbs;
    }
    else if (type === 'prizes') {
        values = settings.jackpot.payout;
        probabilities = settings.jackpot.payoutProbs;
    }
    else if (type === 'mega') {
        values = settings.bonus.megaLinkCoinValue.map((value) => (0, utils_1.precisionRound)(value * settings.BetPerLines, 5));
        probabilities = settings.bonus.megaLinkCoinProb;
    }
    else {
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
// Function to set "Coins" symbols with their respective values
function getCoinsValues(gameInstance, matrixType) {
    const { settings } = gameInstance;
    const matrix = matrixType === 'result'
        ? settings.resultSymbolMatrix
        : settings.bonusResultMatrix;
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            const symbol = matrix[row][col];
            if (symbol == settings.coins.SymbolID.toString()) {
                let coinValue = getRandomValue(gameInstance, "coin");
                if (matrixType === 'result') {
                    // Check if index already exists in settings.coins.values
                    const indexExists = settings.coins.values.find(item => item.index[0] === row && item.index[1] === col);
                    // Only add the new value if the index does not already exist
                    if (!indexExists) {
                        settings.coins.values.push({ index: [row, col], value: coinValue });
                    }
                }
                else if (matrixType === 'bonus') {
                    // Check if index already exists in settings.coins.bonusValues
                    const indexExists = settings.coins.bonusValues.find(item => item.index[0] === row && item.index[1] === col);
                    // Only add the new value if the index does not already exist
                    if (!indexExists) {
                        settings.coins.bonusValues.push({ index: [row, col], value: coinValue });
                        settings.bonus.count = 3;
                        //NOTE: add rtpcount 
                        // gameInstance.playerData.rtpSpinCount += 3
                    }
                }
                else if (matrixType === 'mega') {
                    coinValue = getRandomValue(gameInstance, "mega");
                    // Check if index already exists in settings.coins.bonusValues
                    const indexExists = settings.coins.bonusValues.find(item => item.index[0] === row && item.index[1] === col);
                    // Only add the new value if the index does not already exist
                    if (!indexExists) {
                        settings.coins.bonusValues.push({ index: [row, col], value: coinValue });
                        settings.bonus.count = 3;
                        //NOTE: add rtpcount 
                        // gameInstance.playerData.rtpSpinCount += 3
                    }
                    // Only add the new value if the index does not already exist
                    if (!indexExists) {
                        settings.coins.values.push({ index: [row, col], value: coinValue });
                    }
                }
            }
        }
    }
}
//COINS +CASH COLLECT ON 0 OR 4 -> triggers coin collection with cash collect
function handleCoinsAndCashCollect(gameInstance, matrixType) {
    const { settings } = gameInstance;
    settings.isCashCollect = true;
    let totalCoinValue = 0;
    let cashCollectCount = 0;
    const cashCollectSymbolId = settings.cashCollect.SymbolID;
    const coinSymbolId = settings.coins.SymbolID;
    let hasCoinSymbols;
    let matrix = matrixType === 'result' ? settings.resultSymbolMatrix : settings.bonusResultMatrix;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrixType == 'bonus') {
                if (matrix[i][j] == cashCollectSymbolId.toString()) {
                    cashCollectCount++;
                }
            }
            else if (matrixType == 'result' && (j == 0 || j == matrix[i].length - 1)) {
                if (matrix[i][j] == cashCollectSymbolId.toString()) {
                    cashCollectCount++;
                }
            }
        }
    }
    const coinValues = matrixType === 'result' ? settings.coins.values : settings.coins.bonusValues;
    if (coinValues.length > 0) {
        const totalCoins = coinValues.reduce((total, coin) => total + coin.value, 0);
        totalCoinValue = totalCoins;
    }
    if (cashCollectCount > 0) {
        totalCoinValue *= cashCollectCount;
        return totalCoinValue;
    }
    return 0;
}
//NOTE: lp freespin
function handleFreeSpin(gameInstance) {
    const { settings } = gameInstance;
    settings.losPollos.values = [];
    const matrix = settings.resultSymbolMatrix;
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            // check if lpvalues is already there 
            const lpIndices = settings.losPollos.values.map(lp => `${lp.index[0]},${lp.index[1]}`);
            if (lpIndices.includes(`${row},${col}`))
                continue;
            const losPollosValue = getRandomValue(gameInstance, "freespin");
            const symbol = matrix[row][col];
            if (symbol === settings.losPollos.SymbolID) {
                settings.losPollos.values.push({ index: [row, col], value: losPollosValue });
            }
        }
    }
    let count = 0;
    settings.losPollos.values.map((value) => {
        count += value.value;
    });
    if (count > 0) {
        settings.freeSpin.isTriggered = true;
    }
    settings.freeSpin.isFreeSpin = true;
    settings.freeSpin.count += count;
    //NOTE: add rtpcount 
    // gameInstance.playerData.rtpSpinCount += count
}
function accessData(symbol, matchCount, gameInstance) {
    const { settings } = gameInstance;
    try {
        const symbolData = settings.Symbols.find((s) => s.Id.toString() === symbol.toString());
        if (symbolData) {
            const multiplierArray = symbolData.multiplier;
            if (multiplierArray && multiplierArray[5 - matchCount]) {
                return multiplierArray[5 - matchCount][0];
            }
        }
        return 0;
    }
    catch (error) {
        console.error("Error in accessData:");
        return 0;
    }
}
//TODO: jackpot or prize
function handleJackpot(gameInstance) {
    const { settings } = gameInstance;
    settings.jackpot.win = getRandomValue(gameInstance, "prizes") * settings.BetPerLines;
    if (settings.jackpot.win > 0) {
        settings.jackpot.isTriggered = true;
    }
}
//HAS SYMBOL IN MATRIX
function hasSymbolInMatrix(matrix, symbolId) {
    return matrix.some(row => row.find(symbol => symbol == symbolId));
}
function findFirstNonWildSymbol(line, gameInstance) {
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
    }
    catch (error) {
        // console.error("Error in findFirstNonWildSymbol:");
        return null;
    }
}
//checking matching lines with first symbol and wild subs
function checkLineSymbols(firstSymbol, line, gameInstance) {
    try {
        const { settings } = gameInstance;
        const wildSymbol = settings.wild.SymbolID.toString() || "";
        let matchCount = 1;
        let currentSymbol = firstSymbol;
        const matchedIndices = [{ col: 0, row: line[0] }];
        for (let i = 1; i < line.length; i++) {
            const rowIndex = line[i];
            const symbol = settings.resultSymbolMatrix[rowIndex][i];
            if (symbol == undefined) {
                console.error(`Symbol at position [${rowIndex}, ${i}] is undefined.`);
                return { isWinningLine: false, matchCount: 0, matchedIndices: [] };
            }
            // if (i === 1 && currentSymbol !== wildSymbol) {
            //     break;
            // }
            if (symbol == currentSymbol || symbol == wildSymbol) {
                matchCount++;
                matchedIndices.push({ col: i, row: rowIndex });
            }
            else if (currentSymbol == wildSymbol) {
                currentSymbol = symbol;
                matchCount++;
                matchedIndices.push({ col: i, row: rowIndex });
            }
            else {
                break;
            }
        }
        return { isWinningLine: matchCount >= 3, matchCount, matchedIndices };
    }
    catch (error) {
        console.error('Error in checkLineSymbols:', error);
        return { isWinningLine: false, matchCount: 0, matchedIndices: [] };
    }
}
function checkForWin(gameInstance) {
    try {
        let coinWins = 0;
        let totalWin = 0;
        const { settings } = gameInstance;
        settings.isCashCollect = false;
        const coinSymbolId = settings.coins.SymbolID;
        const cashCollectId = settings.cashCollect.SymbolID;
        const linkSymbolId = settings.link.SymbolID;
        const megaLinkSymbolId = settings.megalink.SymbolID;
        const losPollosId = settings.losPollos.SymbolID;
        const prizeCoinId = settings.prizeCoin.SymbolID;
        const resultSymbolMatrix = settings.resultSymbolMatrix;
        const hasCoinSymbols = hasSymbolInMatrix(resultSymbolMatrix, coinSymbolId);
        const hasCashCollect = hasSymbolInMatrix(resultSymbolMatrix, cashCollectId);
        const hasLinkSymbols = hasSymbolInMatrix(resultSymbolMatrix, linkSymbolId);
        const hasMegaLinkSymbols = hasSymbolInMatrix(resultSymbolMatrix, megaLinkSymbolId);
        const hasLosPollosSymbols = hasSymbolInMatrix(resultSymbolMatrix, losPollosId);
        const hasPrizeCoinSymbols = hasSymbolInMatrix(resultSymbolMatrix, prizeCoinId);
        // console.log("Result Matrix", gameInstance.settings.resultSymbolMatrix);
        //NOTE: freespin lp
        settings.freeSpin.isTriggered = false;
        // if()
        //TODO: bonus spin
        if (settings.bonus.isBonus) {
            (0, bonus_1.handleBonusSpin)(gameInstance);
        }
        else {
            if (hasCoinSymbols) {
                getCoinsValues(gameInstance, 'result');
            }
            settings.lineData.forEach((line, index) => {
                const firstSymbolPosition = line[0];
                let firstSymbol = settings.resultSymbolMatrix[firstSymbolPosition][0];
                if (settings.wild.useWild && firstSymbol == settings.wild.SymbolID.toString()) {
                    firstSymbol = findFirstNonWildSymbol(line, gameInstance);
                }
                const { isWinningLine, matchCount, matchedIndices } = checkLineSymbols(firstSymbol, line, gameInstance);
                if (isWinningLine && matchCount >= 3) {
                    const symbolMultiplier = accessData(firstSymbol, matchCount, gameInstance);
                    // console.log(matchedIndices)
                    if (symbolMultiplier > 0) {
                        totalWin += symbolMultiplier * settings.BetPerLines;
                        settings._winData.winningLines.push(index);
                        // console.log(`Line ${index + 1}:`, line);
                        // console.log(`Payout multiplier for Line ${index + 1}:`, 'payout', symbolMultiplier);
                        const formattedIndices = matchedIndices.map(({ col, row }) => `${col},${row}`);
                        const validIndices = formattedIndices.filter(index => index.length > 2);
                        if (validIndices.length > 0) {
                            settings._winData.winningSymbols.push(validIndices);
                        }
                    }
                }
            });
            // console.log(totalWin, "Total win before coins ");
            if (hasCoinSymbols && hasCashCollect && !settings.bonus.isBonus) {
                //check if cc is in 1st or 
                coinWins = handleCoinsAndCashCollect(gameInstance, "result");
                // console.log(coinWins, "coin collected");
                totalWin += coinWins;
                if (coinWins > 0) {
                    settings.isCoinCollect = true;
                }
            }
            if (settings.bonus.isTriggered) {
                totalWin += settings.bonus.payout;
                settings.bonus.payout = 0;
            }
        }
        //TODO: bonus check. if not bonus
        if (!settings.bonus.isBonus) {
            (0, bonus_1.checkForBonus)(gameInstance, hasCashCollect, hasLinkSymbols, hasMegaLinkSymbols);
            //TODO: freespin check 
            if (hasCashCollect && hasLosPollosSymbols) {
                handleFreeSpin(gameInstance);
            }
            if (hasPrizeCoinSymbols && hasCashCollect) {
                handleJackpot(gameInstance);
            }
        }
        if (settings.bonus.count <= 0 || settings.bonus.isWalterStash) {
            totalWin += settings.bonus.payout;
        }
        if (settings.jackpot.win > 0) {
            totalWin += settings.jackpot.win;
        }
        gameInstance.playerData.currentWining = (0, utils_1.precisionRound)(totalWin, 4);
        gameInstance.playerData.haveWon = (0, utils_1.precisionRound)((gameInstance.playerData.currentWining + gameInstance.playerData.haveWon), 4);
        gameInstance.incrementPlayerBalance(gameInstance.playerData.currentWining);
        makeResultJson(gameInstance);
        if (settings.freeSpin.count <= 0) {
            settings.freeSpin.isFreeSpin = false;
        }
        /*
         *
         * */
        if (settings.bonus.count <= 0) {
            settings.bonusResultMatrix = [];
            settings.bonus.isBonus = false;
            settings.bonus.isWalterStash = false;
            settings.bonus.isMegaLink = false;
            settings.bonus.payout = 0;
            settings.cashCollect.values = [];
            settings.coins.bonusValues = [];
            settings.coins.values = [];
            if (!settings.freeSpin.isFreeSpin) {
                settings.losPollos.values = [];
            }
        }
        settings.isCoinCollect = false;
        settings._winData.winningLines = [];
        settings._winData.winningSymbols = [];
        settings.losPollos.values = [];
        settings._winData.winningLines = [];
        settings.jackpot.win = 0;
        settings.jackpot.isTriggered = false;
    }
    catch (error) {
        console.error("Error in checkForWin", error);
        return {
            totalWin: 0,
            winningLines: [],
        };
    }
}
function makeResultJson(gameInstance) {
    try {
        const { settings, playerData } = gameInstance;
        const credits = gameInstance.getPlayerData().credits;
        const Balance = Number(credits.toFixed(2));
        let copyCoins = [...settings.coins.values.map(v => {
                return Object.assign(Object.assign({}, v), { value: v.value / settings.BetPerLines });
            })];
        let bonusCoins = [...settings.coins.bonusValues.map(v => {
                return Object.assign(Object.assign({}, v), { value: v.value / settings.BetPerLines });
            })];
        const sendData = {
            GameData: {
                ResultReel: settings.resultSymbolMatrix,
                linesToEmit: settings._winData.winningLines,
                symbolsToEmit: settings._winData.winningSymbols,
                WinAmount: gameInstance.playerData.currentWining,
                isCoinCollect: settings.isCoinCollect,
                freeSpins: {
                    count: settings.freeSpin.count,
                    isNewAdded: settings.freeSpin.isTriggered
                },
                winData: {
                    // coinValues: settings.coins.values,
                    coinValues: copyCoins,
                    losPollos: settings.losPollos.values
                },
                jackpot: {
                    isTriggered: settings.jackpot.isTriggered,
                    payout: settings.jackpot.win
                },
                bonus: {
                    isBonus: settings.bonus.isTriggered,
                    isWalterStash: settings.bonus.isWalterStash,
                    isMegaLink: settings.bonus.isMegaLink,
                    BonusResult: settings.bonusResultMatrix.map(row => row.map(item => Number(item))),
                    payout: settings.bonus.payout,
                    spinCount: settings.bonus.count,
                    // coins: settings.coins.bonusValues,
                    coins: bonusCoins
                },
            },
            PlayerData: {
                Balance: Balance,
                currentWining: playerData.currentWining,
                totalbet: playerData.totalbet,
                haveWon: playerData.haveWon,
            }
        };
        gameInstance.sendMessage('ResultData', sendData);
        console.log(JSON.stringify(sendData));
        // console.log("coins", sendData.GameData.winData.coinValues);
        // console.info("Bonus coins", sendData.GameData.bonus);
        // console.info("freespin", sendData.GameData.freeSpins);
        // console.log("cc", settings.cashCollect.values);
        // console.log("lp", sendData.GameData.winData.losPollos);
        // console.log("symbolsToEmit", sendData.GameData.symbolsToEmit);
    }
    catch (error) {
        console.error("Error generating result JSON or sending message:", error);
    }
}
