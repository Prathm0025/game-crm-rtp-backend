"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGameSettings = initializeGameSettings;
exports.generateInitialReel = generateInitialReel;
exports.makePayLines = makePayLines;
exports.checkForWin = checkForWin;
exports.sendInitData = sendInitData;
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
        Symbols: gameInstance.initSymbols,
        resultSymbolMatrix: [],
        currentGamedata: gameData.gameSettings,
        lineData: [],
        _winData: new WinData_1.WinData(gameInstance),
        currentBet: 0,
        currentLines: 0,
        BetPerLines: 0,
        reels: [],
        isLeftWinTrue: false,
        freeSpin: {
            symbolID: "-1",
            freeSpinCount: 0,
            isEnabled: gameData.gameSettings.freeSpin.isEnabled,
            countIncrement: gameData.gameSettings.freeSpin.countIncrement,
            isFreeSpin: false,
            isTriggered: false,
            substitutions: {
                bloodSplash: [],
                vampHuman: []
            }
        },
        wild: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        vampireMan: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        vampireWoman: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        HumanMan: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        HumanWoman: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        }
    };
}
/**
 * Generates the initial reel setup based on the game settings.
 * @param gameSettings - The settings used to generate the reel setup.
 * @returns A 2D array representing the reels, where each sub-array corresponds to a reel.
 */
function generateInitialReel(gameSettings) {
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
function handleSpecialSymbols(symbol, gameInstance) {
    switch (symbol.Name) {
        case types_1.specialIcons.wild:
            gameInstance.settings.wild.SymbolName = symbol.Name;
            gameInstance.settings.wild.SymbolID = symbol.Id;
            gameInstance.settings.wild.useWild = true;
            break;
        case types_1.specialIcons.VampireMan:
            gameInstance.settings.vampireMan.SymbolName = symbol.Name;
            gameInstance.settings.vampireMan.SymbolID = symbol.Id;
            gameInstance.settings.vampireMan.useWild = true;
            break;
        case types_1.specialIcons.VampireWoman:
            gameInstance.settings.vampireWoman.SymbolName = symbol.Name;
            gameInstance.settings.vampireWoman.SymbolID = symbol.Id;
            gameInstance.settings.vampireWoman.useWild = true;
            break;
        case types_1.specialIcons.HumanMan:
            gameInstance.settings.HumanMan.SymbolName = symbol.Name;
            gameInstance.settings.HumanMan.SymbolID = symbol.Id;
            gameInstance.settings.HumanMan.useWild = true;
            break;
        case types_1.specialIcons.HumanWoman:
            gameInstance.settings.HumanWoman.SymbolName = symbol.Name;
            gameInstance.settings.HumanWoman.SymbolID = symbol.Id;
            gameInstance.settings.HumanWoman.useWild = true;
            break;
        default:
    }
}
//CHECK WINS ON PAYLINES WITH OR WITHOUT WILD
//check for win function
function checkForWin(gameInstance) {
    try {
        const { settings } = gameInstance;
        const winningLines = [];
        let totalPayout = 0;
        // TODO: handle freespin . - 1. vamphumanunion should be wild (swap resmatrix)
        //                             - 2. bloodSplash feat  (swap resmatrix)
        //                             - 3. populate freespin.wildsubbed
        settings.lineData.forEach((line, index) => {
            const firstSymbolPositionLTR = line[0];
            const firstSymbolPositionRTL = line[line.length - 1];
            // Get first symbols for both directions
            let firstSymbolLTR = settings.resultSymbolMatrix[firstSymbolPositionLTR][0];
            let firstSymbolRTL = settings.resultSymbolMatrix[firstSymbolPositionRTL][line.length - 1];
            // Handle wild symbols for both directions
            if (settings.wild.useWild && firstSymbolLTR === settings.wild.SymbolID) {
                firstSymbolLTR = findFirstNonWildSymbol(line, gameInstance);
            }
            if (settings.wild.useWild && firstSymbolRTL === settings.wild.SymbolID) {
                firstSymbolRTL = findFirstNonWildSymbol(line, gameInstance);
            }
            // Left-to-right check
            const LTRResult = checkLineSymbols(firstSymbolLTR, line, gameInstance, 'LTR');
            if (LTRResult.isWinningLine && LTRResult.matchCount >= 3) {
                const symbolMultiplierLTR = accessData(firstSymbolLTR, LTRResult.matchCount, gameInstance);
                if (symbolMultiplierLTR > 0) {
                    const payout = symbolMultiplierLTR * gameInstance.settings.BetPerLines;
                    totalPayout += payout;
                    gameInstance.playerData.currentWining += payout;
                    settings._winData.winningLines.push(index + 1);
                    winningLines.push({
                        line,
                        symbol: firstSymbolLTR,
                        multiplier: symbolMultiplierLTR,
                        matchCount: LTRResult.matchCount,
                        direction: 'LTR'
                    });
                    // console.log(`Line ${index + 1} (LTR):`, line);
                    // console.log(`Payout for LTR Line ${index + 1}:`, "payout", payout);
                    return;
                }
            }
            // Right-to-left check
            const RTLResult = checkLineSymbols(firstSymbolRTL, line, gameInstance, 'RTL');
            if (RTLResult.isWinningLine && RTLResult.matchCount >= 3) {
                const symbolMultiplierRTL = accessData(firstSymbolRTL, RTLResult.matchCount, gameInstance);
                if (symbolMultiplierRTL > 0) {
                    const payout = symbolMultiplierRTL * gameInstance.settings.BetPerLines;
                    totalPayout += payout;
                    gameInstance.playerData.currentWining += payout;
                    settings._winData.winningLines.push(index + 1);
                    winningLines.push({
                        line,
                        symbol: firstSymbolRTL,
                        multiplier: symbolMultiplierRTL,
                        matchCount: RTLResult.matchCount,
                        direction: 'RTL'
                    });
                    // console.log(`Line ${index + 1} (RTL):`, line);
                    // console.log(`Payout for RTL Line ${index + 1}:`, "payout", payout);
                }
            }
        });
        checkforBats(gameInstance);
        //TODO: check for freespin 
        //    1. check if human vamp are adjacent 
        //    2. append to vampHuman
        //  3. sub blood splash back
        const { found, positions } = checkForFreeSpin(gameInstance);
        if (found) {
            settings.freeSpin.isTriggered = true;
            settings.freeSpin.isFreeSpin = true;
            settings.freeSpin.freeSpinCount += settings.freeSpin.countIncrement;
        }
        // Log and update game state after all lines are checked
        console.log("Total Winning", gameInstance.playerData.currentWining);
        console.log("Total Free Spins Won:", gameInstance.settings.freeSpin.freeSpinCount);
        gameInstance.playerData.haveWon += gameInstance.playerData.currentWining;
        makeResultJson(gameInstance);
        gameInstance.playerData.currentWining = 0;
        return winningLines;
    }
    catch (error) {
        console.error("Error in checkForWin:", error);
        return [];
    }
}
function checkForFreeSpin(gameInstance) {
    const manId = gameInstance.settings.HumanMan.SymbolID; // 13
    const womanId = gameInstance.settings.HumanWoman.SymbolID; // 14
    const VampireManId = gameInstance.settings.vampireMan.SymbolID; // 11
    const VampireWomanId = gameInstance.settings.vampireWoman.SymbolID; // 12
    const positions = [];
    let found = false;
    const matrix = gameInstance.settings.resultSymbolMatrix;
    matrix.forEach((row, i) => {
        row.forEach((symbol, j) => {
            // Check VampireMan + HumanWoman combination (11,14)
            if (symbol === VampireManId.toString()) {
                if (j + 1 < row.length && matrix[i][j + 1] === womanId.toString()) {
                    positions.push([`${i},${j}`, `${i},${j + 1}`]);
                    found = true;
                }
            }
            // Check HumanMan + VampireWoman combination (13,12)
            if (symbol === manId.toString()) {
                if (j + 1 < row.length && matrix[i][j + 1] === VampireWomanId.toString()) {
                    positions.push([`${i},${j}`, `${i},${j + 1}`]);
                    found = true;
                }
            }
        });
    });
    return { found, positions };
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
function checkforBats(gameInstance) {
    const { settings } = gameInstance;
    let batsCount = 0;
    settings.resultSymbolMatrix.forEach((row) => {
        row.forEach((symbol) => {
            batsCount += symbol === 9 ? 1 : symbol === 10 ? 2 : 0;
        });
    });
    console.log("Bats Count", batsCount);
}
//checking first non wild symbol in lines which start with wild symbol
function findFirstNonWildSymbol(line, gameInstance, direction = 'LTR') {
    try {
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
    catch (error) {
        console.error("Error in findFirstNonWildSymbol:", error);
        return null;
    }
}
//payouts to user according to symbols count in matched lines
function accessData(symbol, matchCount, gameInstance) {
    const { settings } = gameInstance;
    try {
        const symbolData = settings.currentGamedata.Symbols.find((s) => s.Id.toString() === symbol.toString());
        if (symbolData) {
            const multiplierArray = symbolData.multiplier;
            if (multiplierArray && multiplierArray[settings.matrix.x - matchCount]) {
                return multiplierArray[settings.matrix.x - matchCount][0];
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
function sendInitData(gameInstance) {
    gameInstance.settings.lineData =
        gameInstance.settings.currentGamedata.linesApiData;
    gameUtils_1.UiInitData.paylines = (0, gameUtils_1.convertSymbols)(gameInstance.settings.Symbols);
    const reels = generateInitialReel(gameInstance.settings);
    gameInstance.settings.reels = reels;
    const dataToSend = {
        GameData: {
            Reel: reels,
            Bets: gameInstance.settings.currentGamedata.bets,
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
function makeResultJson(gameInstance) {
    try {
        const { settings, playerData } = gameInstance;
        const credits = gameInstance.getPlayerData().credits;
        const Balance = credits.toFixed(2);
        const sendData = {
            GameData: {
                linesToEmit: settings._winData.winningLines,
                symbolsToEmit: settings._winData.winningSymbols,
                jackpot: settings._winData.jackpotwin,
            },
            PlayerData: {
                Balance: Balance,
                currentWining: settings._winData.totalWinningAmount,
                totalbet: playerData.totalbet,
                haveWon: playerData.haveWon,
            }
        };
        gameInstance.sendMessage('ResultData', sendData);
    }
    catch (error) {
        console.error("Error generating result JSON or sending message:", error);
    }
}
