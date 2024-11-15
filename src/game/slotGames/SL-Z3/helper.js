"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGameSettings = initializeGameSettings;
exports.generateInitialReel = generateInitialReel;
exports.makePayLines = makePayLines;
exports.sendInitData = sendInitData;
exports.checkForWin = checkForWin;
exports.makeResultJson = makeResultJson;
const WinData_1 = require("../BaseSlotGame/WinData");
const gameUtils_1 = require("../../Utils/gameUtils");
const types_1 = require("./types");
/**
 * Initializes the game settings using the provided game data and game instance.
 * @param gameData - The data used to configure the game settings.
 * @param gameInstance - The instance of the SLCM class that manages the game logic.
 * @returns An object containing initialized game settings.
 */
function initializeGameSettings(gameData, gameInstance) {
    return {
        id: gameData.gameSettings.id,
        matrix: gameData.gameSettings.matrix,
        bets: gameData.gameSettings.bets,
        baseBet: gameData.gameSettings.baseBet,
        BetMultiplier: gameData.gameSettings.betMultiplier,
        Symbols: gameInstance.initSymbols,
        resultSymbolMatrix: [],
        currentGamedata: gameData.gameSettings,
        lineData: [],
        _winData: new WinData_1.WinData(gameInstance),
        currentBet: 0,
        baseBetAmount: gameData.gameSettings.baseBet,
        currentLines: 0,
        BetPerLines: 0,
        reels: [],
        lastReel: [],
        tempReel: [],
        firstReel: [],
        tempReelSym: [],
        freeSpinData: gameData.gameSettings.freeSpinData,
        freeSpin: {
            symbolID: "-1",
            freeSpinMuiltiplier: [],
            freeSpinStarted: false,
            freeSpinsAdded: false,
            freeSpinCount: 0,
            noOfFreeSpins: 0,
            useFreeSpin: false,
        },
        replacedToWildIndices: [],
        wild: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        scatter: {
            symbolID: 11,
            useScatter: false,
        }
    };
}
/**
 * Generates the initial reel setup based on the game settings.
 * @param gameSettings - The settings used to generate the reel setup.
 * @returns A 2D array representing the reels, where each sub-array corresponds to a reel.
 */
function generateInitialReel(gameSettings) {
    const reels = [[], [], [], [], [], [], []];
    gameSettings.Symbols.forEach((symbol) => {
        for (let i = 0; i < 7; i++) {
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
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function makePayLines(gameInstance) {
    const { settings } = gameInstance;
    settings.currentGamedata.Symbols.forEach((element) => {
        if (!element.useWildSub) {
            handleSpecialSymbols(element, gameInstance);
        }
    });
}
function sendInitData(gameInstance) {
    gameInstance.settings.lineData =
        gameInstance.settings.currentGamedata.linesApiData;
    gameUtils_1.UiInitData.paylines = (0, gameUtils_1.convertSymbols)(gameInstance.settings.Symbols);
    const reels = generateInitialReel(gameInstance.settings);
    gameInstance.settings.reels = reels;
    const dataToSend = {
        GameData: {
            Reel: reels,
            linesApiData: gameInstance.settings.currentGamedata.linesApiData,
            Bets: gameInstance.settings.currentGamedata.bets,
            freeSpinData: gameInstance.settings.freeSpinData,
            baseBet: gameInstance.settings.baseBetAmount,
            betMultiplier: gameInstance.settings.currentGamedata.betMultiplier
        },
        UIData: gameUtils_1.UiInitData,
        PlayerData: {
            Balance: gameInstance.getPlayerData().credits,
            haveWon: gameInstance.playerData.haveWon,
            currentWining: gameInstance.playerData.currentWining,
            totalbet: gameInstance.playerData.totalbet,
        },
    };
    gameInstance.sendMessage("InitData", dataToSend);
}
//CHECK WINS ON PAYLINES WITH OR WITHOUT WILD
//check for win function
function checkForWin(gameInstance) {
    try {
        const { settings } = gameInstance;
        handleFullReelOfZeus(gameInstance);
        // Remove elements from each reel in the specified sequence: 5, 4, 3, 2, 1, 0
        settings.resultSymbolMatrix = reduceMatrix(settings.resultSymbolMatrix);
        console.log(settings.resultSymbolMatrix, "result symbol matrix column replace to wild(10)");
        // Subsitute full reel of zeus with wild
        const winningLines = [];
        let totalPayout = 0;
        const { isFreeSpin, scatterCount } = checkForFreeSpin(gameInstance);
        if (isFreeSpin) {
            handleFreeSpins(scatterCount, gameInstance);
        }
        settings.lineData.forEach((line, index) => {
            //RTL for free spins
            const direction = isFreeSpin ? 'RTL' : 'LTR';
            const firstSymbolPositionLTR = line[0];
            const firstSymbolPositionRTL = line[line.length - 1];
            let firstSymbolLTR = settings.resultSymbolMatrix[firstSymbolPositionLTR][0];
            let firstSymbolRTL = settings.resultSymbolMatrix[firstSymbolPositionRTL][line.length - 1];
            const firstSymbol = isFreeSpin ? firstSymbolRTL : firstSymbolLTR;
            if (settings.wild.useWild && firstSymbolLTR === settings.wild.SymbolID) {
                firstSymbolLTR = findFirstNonWildSymbol(line, gameInstance);
            }
            if (settings.wild.useWild && firstSymbolRTL === settings.wild.SymbolID) {
                firstSymbolRTL = findFirstNonWildSymbol(line, gameInstance, 'RTL');
            }
            const { isWinningLine, matchCount, matchedIndices } = checkLineSymbols(firstSymbol, line, gameInstance, direction);
            switch (true) {
                case isWinningLine && matchCount >= 3 && !settings.freeSpin.useFreeSpin:
                    // console.log("NOT FREE SPIN");
                    const symbolMultiplierLTR = accessData(firstSymbolLTR, matchCount, gameInstance);
                    settings.lastReel = settings.resultSymbolMatrix;
                    // console.log(settings.lastReel, 'lastReel')
                    switch (true) {
                        case symbolMultiplierLTR > 0:
                            const payout = symbolMultiplierLTR * settings.BetPerLines;
                            totalPayout += payout;
                            settings._winData.winningLines.push(index + 1);
                            winningLines.push({
                                line,
                                symbol: firstSymbolLTR,
                                multiplier: symbolMultiplierLTR,
                                matchCount,
                            });
                            // console.log(`Line ${index + 1}:`, line);
                            // console.log(
                            //     `Payout for Line ${index + 1}:`,
                            //     "payout",
                            //     symbolMultiplierLTR
                            // );
                            const formattedIndices = matchedIndices.map(({ col, row }) => `${col},${row}`);
                            const validIndices = formattedIndices.filter((index) => index.length > 2);
                            if (validIndices.length > 0) {
                                // console.log(settings.lastReel, 'settings.lastReel')
                                console.log(validIndices);
                                settings._winData.winningSymbols.push(validIndices);
                                settings._winData.totalWinningAmount = totalPayout;
                                console.log(settings._winData.totalWinningAmount);
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                case isWinningLine && matchCount >= 3 && settings.freeSpin.useFreeSpin:
                    // console.log("FREE SPIN");
                    const symbolMultiplierRTL = accessData(firstSymbolRTL, matchCount, gameInstance);
                    settings.lastReel = settings.resultSymbolMatrix;
                    // console.log(settings.lastReel, 'lastReel')
                    switch (true) {
                        case symbolMultiplierRTL > 0:
                            const payout = symbolMultiplierRTL * settings.BetPerLines;
                            totalPayout += payout;
                            settings._winData.winningLines.push(index + 1);
                            winningLines.push({
                                line,
                                symbol: firstSymbolLTR,
                                multiplier: symbolMultiplierRTL,
                                matchCount,
                            });
                            console.log(`Line ${index + 1}:`, line);
                            console.log(`Payout for Line ${index + 1}:`, "payout", symbolMultiplierRTL);
                            const formattedIndices = matchedIndices.map(({ col, row }) => `${col},${row}`);
                            const validIndices = formattedIndices.filter((index) => index.length > 2);
                            if (validIndices.length > 0) {
                                // console.log(settings.lastReel, 'settings.lastReel')
                                console.log(validIndices);
                                settings._winData.winningSymbols.push(validIndices);
                                settings._winData.totalWinningAmount = totalPayout;
                                console.log(settings._winData.totalWinningAmount);
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        });
        if (settings.freeSpin.useFreeSpin && settings.freeSpin.freeSpinCount > 0) {
            settings.freeSpin.freeSpinCount -= 1;
            if (settings.freeSpin.freeSpinCount <= 0) {
                settings.freeSpin.useFreeSpin = false;
            }
        }
        if (isFreeSpin) {
            settings.freeSpin.useFreeSpin = true;
        }
        gameInstance.playerData.currentWining += totalPayout;
        gameInstance.playerData.haveWon += gameInstance.playerData.currentWining;
        gameInstance.updatePlayerBalance(gameInstance.playerData.currentWining);
        makeResultJson(gameInstance);
        settings._winData.totalWinningAmount = 0;
        gameInstance.playerData.currentWining = 0;
        settings._winData.winningLines = [];
        settings._winData.winningSymbols = [];
        settings.replacedToWildIndices = [];
        return winningLines;
    }
    catch (error) {
        console.error("Error in checkForWin", error);
        return [];
    }
}
function checkLineSymbols(firstSymbol, line, gameInstance, direction = 'LTR') {
    try {
        const { settings } = gameInstance;
        const wildSymbol = settings.wild.SymbolID || "";
        let matchCount = 1;
        let currentSymbol = firstSymbol;
        const matchedIndices = [];
        const start = direction === 'LTR' ? 0 : line.length - 1;
        const end = direction === 'LTR' ? line.length : -1;
        const step = direction === 'LTR' ? 1 : -1;
        matchedIndices.push({ col: start, row: line[start] });
        for (let i = start + step; i !== end; i += step) {
            const rowIndex = line[i];
            const symbol = settings.resultSymbolMatrix[rowIndex][i];
            if (symbol === undefined) {
                console.error(`Symbol at position [${rowIndex}, ${i}] is undefined.`);
                return { isWinningLine: false, matchCount: 0, matchedIndices: [] };
            }
            switch (true) {
                case symbol === currentSymbol || symbol === wildSymbol:
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
    }
    catch (error) {
        console.error("Error in checkLineSymbols:", error);
        return { isWinningLine: false, matchCount: 0, matchedIndices: [] };
    }
}
//checking first non wild symbol in lines which start with wild symbol
function findFirstNonWildSymbol(line, gameInstance, direction = 'LTR') {
    const { settings } = gameInstance;
    const wildSymbol = settings.wild.SymbolID;
    const start = direction === 'LTR' ? 0 : line.length - 1;
    const end = direction === 'LTR' ? line.length : -1;
    const step = direction === 'LTR' ? 1 : -1;
    for (let i = start; i !== end; i += step) {
        const rowIndex = line[i];
        const symbol = settings.resultSymbolMatrix[rowIndex][i];
        if (symbol !== wildSymbol) {
            return symbol;
        }
    }
    return wildSymbol;
}
//payouts to user according to symbols count in matched lines
function accessData(symbol, matchCount, gameInstance) {
    const { settings } = gameInstance;
    try {
        const symbolData = settings.currentGamedata.Symbols.find((s) => s.Id.toString() === symbol.toString());
        if (symbolData) {
            const multiplierArray = symbolData.multiplier;
            if (multiplierArray && multiplierArray[5 - matchCount]) {
                return multiplierArray[5 - matchCount][0];
            }
        }
        return 0;
    }
    catch (error) {
        // console.error("Error in accessData:");
        return 0;
    }
}
/**
 * Sends the initial game and player data to the client.
 * @param gameInstance - The instance of the SLCM class containing the game settings and player data.
 */
function handleSpecialSymbols(symbol, gameInstance) {
    switch (symbol.Name) {
        case types_1.specialIcons.wild:
            gameInstance.settings.wild.SymbolName = symbol.Name;
            gameInstance.settings.wild.SymbolID = symbol.Id;
            gameInstance.settings.wild.useWild = true;
            break;
        case types_1.specialIcons.FreeSpin:
            gameInstance.settings.freeSpin.symbolID = symbol.Id;
            gameInstance.settings.freeSpin.freeSpinMuiltiplier = symbol.multiplier;
            gameInstance.settings.freeSpin.useFreeSpin = true;
            break;
        case types_1.specialIcons.scatter:
            (gameInstance.settings.scatter.symbolID = symbol.Id),
                //   (gameInstance.settings.scatter.multiplier = symbol.multiplier);
                gameInstance.settings.scatter.useScatter = true;
            break;
        default:
            break;
            ``;
    }
}
function handleFullReelOfZeus(gameInstance, symbolIdToCheck = 0) {
    try {
        const { settings } = gameInstance;
        const resultSymbolMatrix = settings.resultSymbolMatrix;
        for (let col = 0; col < resultSymbolMatrix[0].length; col++) {
            const isFullColumn = resultSymbolMatrix.every(row => row[col] === symbolIdToCheck || row[col] === null);
            if (isFullColumn) {
                for (let row = 0; row < resultSymbolMatrix.length; row++) {
                    resultSymbolMatrix[row][col] = settings.wild.SymbolID;
                }
                settings.replacedToWildIndices.push(col);
            }
        }
    }
    catch (error) {
        console.error("Error handling full reel of Zeus:", error);
    }
}
function checkForFreeSpin(gameInstance) {
    const { resultSymbolMatrix, scatter } = gameInstance.settings;
    let scatterCount = 0;
    for (let i = 1; i < 6; i++) {
        const reel = resultSymbolMatrix[i];
        scatterCount += reel.filter(symbol => symbol === scatter.symbolID).length;
    }
    const isFreeSpin = scatterCount >= 3;
    console.log(`Scatter Count: ${scatterCount}`);
    console.log(`Free Spin Triggered: ${isFreeSpin}`);
    return { isFreeSpin, scatterCount };
}
function handleFreeSpins(scatterCount, gameInstance) {
    const { settings, playerData } = gameInstance;
    switch (scatterCount) {
        case 5:
            settings.freeSpin.freeSpinCount += 50;
            playerData.currentWining += settings.currentBet * 50;
            break;
        case 4:
            settings.freeSpin.freeSpinCount += 25;
            playerData.currentWining += settings.currentBet * 10;
            break;
        case 3:
            settings.freeSpin.freeSpinCount += 10;
            break;
        default:
            // console.log("No Free Spins awarded or case not handled");
            break;
    }
}
function reduceMatrix(matrix) {
    const removeCounts = [5, 4, 3, 2, 1];
    for (let col = 0; col < removeCounts.length && col < matrix[0].length; col++) {
        let countToRemove = removeCounts[col];
        let rows = matrix.length;
        for (let row = rows - 1; row >= 0 && countToRemove > 0; row--) {
            matrix[row][col] = null;
            countToRemove--;
        }
    }
    // matrix = matrix.map(row => row.filter(element => element !== null));
    return matrix;
}
function makeResultJson(gameInstance) {
    try {
        const { settings, playerData } = gameInstance;
        const credits = gameInstance.getPlayerData().credits + playerData.currentWining;
        const Balance = credits.toFixed(2);
        const sendData = {
            GameData: {
                resultSymbols: settings.firstReel,
                linesToEmit: settings._winData.winningLines,
                symbolsToEmit: settings._winData.winningSymbols,
                wildSymbolIndices: settings.replacedToWildIndices,
                isFreeSpin: settings.freeSpin.useFreeSpin,
                freeSpinCount: settings.freeSpin.freeSpinCount,
            },
            PlayerData: {
                Balance: Balance,
                currentWining: playerData.currentWining,
                totalbet: playerData.totalbet,
                haveWon: playerData.haveWon,
            }
        };
        gameInstance.sendMessage('ResultData', sendData);
        console.log(sendData, "send Data");
    }
    catch (error) {
        console.error("Error generating result JSON or sending message:", error);
    }
}
