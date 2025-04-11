"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGameSettings = initializeGameSettings;
exports.generateInitialReel = generateInitialReel;
exports.makePayLines = makePayLines;
exports.checkForWin = checkForWin;
exports.checkForFreeSpin = checkForFreeSpin;
exports.checkForTrumpFreeSpin = checkForTrumpFreeSpin;
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
        currentGamedata: gameData.gameSettings,
        resultSymbolMatrix: [],
        bets: gameData.gameSettings.bets,
        Symbols: gameInstance.initSymbols,
        lineData: [],
        _winData: new WinData_1.WinData(gameInstance),
        currentBet: 0,
        currentLines: 0,
        BetPerLines: 0,
        reels: [],
        isWining: false,
        freeSpin: {
            SymbolName: "",
            SymbolID: "-1",
            freeSpinMuiltiplier: [],
            freeSpinStarted: false,
            freeSpinsAdded: false,
            freeSpinCount: 0,
            noOfFreeSpins: 0,
            useFreeSpin: false,
            jokerSymbols: [],
            trumpSymbols: []
        },
        wild: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        trumpFreeSpin: {
            SymbolName: "",
            SymbolID: -1,
        }
    };
}
/**
 * Generates the initial reel setup based on the game settings.
 * @param gameSettings - The settings used to generate the reel setup.
 * @returns A 2D array representing the reels, where each sub-array corresponds to a reel.
 */
function generateInitialReel(gameSettings) {
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
        (0, gameUtils_1.shuffleArray)(reel);
    });
    return reels;
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
        case types_1.specialIcons.trumpFreeSpin:
            gameInstance.settings.trumpFreeSpin.SymbolName = symbol.Name;
            gameInstance.settings.trumpFreeSpin.SymbolID = symbol.Id;
            break;
        case types_1.specialIcons.freeSpin:
            gameInstance.settings.freeSpin.SymbolName = symbol.Name;
            gameInstance.settings.freeSpin.SymbolID = symbol.Id;
            gameInstance.settings.freeSpin.freeSpinMuiltiplier = symbol.multiplier;
            gameInstance.settings.freeSpin.useFreeSpin = true;
            break;
        default:
            break;
    }
}
//CHECK WINS ON PAYLINES WITH OR WITHOUT WILD
function checkForWin(gameInstance) {
    try {
        const { settings, playerData } = gameInstance;
        const winningLines = [];
        let totalPayout = 0;
        settings.lineData.forEach((line, index) => {
            const firstSymbolPosition = line[0];
            let firstSymbol = settings.resultSymbolMatrix[firstSymbolPosition][0];
            // Handle wild symbols
            if (settings.wild.useWild && firstSymbol === settings.wild.SymbolID) {
                firstSymbol = findFirstNonWildSymbol(line, gameInstance);
            }
            // Handle special icons
            if (Object.values(types_1.specialIcons).includes(settings.Symbols[firstSymbol].Name)) {
                return;
            }
            const { isWinningLine, matchCount, matchedIndices } = checkLineSymbols(firstSymbol, line, gameInstance);
            switch (true) {
                case isWinningLine && matchCount >= 3:
                    const symbolMultiplier = accessData(firstSymbol, matchCount, gameInstance);
                    switch (true) {
                        case symbolMultiplier > 0:
                            settings.isWining = true;
                            totalPayout += symbolMultiplier;
                            settings._winData.winningLines.push(index + 1);
                            winningLines.push({
                                line,
                                symbol: firstSymbol,
                                multiplier: symbolMultiplier,
                                matchCount,
                            });
                            console.log(`Line ${index + 1}:`, line);
                            console.log(`Payout for Line ${index + 1}:`, "payout", symbolMultiplier);
                            const formattedIndices = matchedIndices.map(({ col, row }) => `${col},${row}`);
                            const validIndices = formattedIndices.filter((index) => index.length > 2);
                            if (validIndices.length > 0) {
                                settings._winData.winningSymbols.push(validIndices);
                                settings._winData.totalWinningAmount = totalPayout * settings.BetPerLines;
                                playerData.currentWining = settings._winData.totalWinningAmount;
                            }
                            break;
                        default:
                            break;
                    }
            }
        });
        return winningLines;
    }
    catch (error) {
        console.error("Error in checkForWin", error);
        return [];
    }
}
//checking matching lines with first symbol and wild subs
function checkLineSymbols(firstSymbol, line, gameInstance) {
    try {
        const { settings } = gameInstance;
        const wildSymbol = settings.wild.SymbolID || "";
        let matchCount = 1;
        let currentSymbol = firstSymbol;
        const matchedIndices = [
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
    }
    catch (error) {
        console.error("Error in checkLineSymbols:", error);
        return { isWinningLine: false, matchCount: 0, matchedIndices: [] };
    }
}
//checking first non wild symbol in lines which start with wild symbol
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
//payouts to user according to symbols count in matched lines
function accessData(symbol, matchCount, gameInstance) {
    const { settings } = gameInstance;
    try {
        const symbolData = settings.currentGamedata.Symbols.find((s) => s.Id.toString() === symbol.toString());
        if (symbolData) {
            const multiplierArray = symbolData.multiplier;
            if (multiplierArray && multiplierArray[5 - matchCount]) {
                if (symbol == settings.freeSpin.SymbolID) {
                    return multiplierArray[5 - matchCount][1];
                }
                else {
                    return multiplierArray[5 - matchCount][0];
                }
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
 * Finds symbols for a special case element in the result matrix.
 * @param gameInstance - The instance of the SLPSF class containing the game settings and player data.
 * @param SymbolName - The name of the symbol to search for in the symbol matrix.
 * @returns An array of strings representing the positions of the matching symbols in the format "column,row".
 */
function findSymbol(gameInstance, SymbolName) {
    const { settings } = gameInstance;
    const foundArray = [];
    try {
        let symbolId = -1;
        settings.currentGamedata.Symbols.forEach((element) => {
            if (SymbolName === element.Name)
                symbolId = element.Id;
        });
        if (symbolId === -1)
            return foundArray;
        for (let i = 0; i < settings.resultSymbolMatrix.length; i++) {
            for (let j = 0; j < settings.resultSymbolMatrix[i].length; j++) {
                if (settings.resultSymbolMatrix[i][j] === symbolId) {
                    foundArray.push(`${j},${i}`);
                }
            }
        }
    }
    catch (error) {
        console.error("Error in findSymbol:", error);
    }
    return foundArray;
}
/**
 * Checks if the Free Spin condition is met and awards free spins to the player.
 * @param gameInstance - The instance of the SLPSF class containing the game settings and player data.
 */
function checkForFreeSpin(gameInstance) {
    const { settings, playerData } = gameInstance;
    try {
        // Find positions of Free Spin symbols in the result matrix
        const freeSpinsSymbol = findSymbol(gameInstance, types_1.specialIcons.freeSpin);
        if (freeSpinsSymbol.length > (5 - settings.freeSpin.freeSpinMuiltiplier.length) && freeSpinsSymbol.length <= 5) {
            // console.log("!!! FREE SPIN AWARDED !!!");
            const freeSpins = accessData(settings.freeSpin.SymbolID, freeSpinsSymbol.length, gameInstance);
            // console.log(freeSpins, 'freeSpins')
            settings.freeSpin.freeSpinStarted = true;
            settings.freeSpin.freeSpinsAdded = true;
            settings.freeSpin.freeSpinCount += freeSpins;
            playerData.totalSpin += freeSpins;
            // uncomment only for testing purpose 
            // playerData.rtpSpinCount += freeSpins;
            settings.freeSpin.jokerSymbols.push(freeSpinsSymbol);
        }
        else if (freeSpinsSymbol.length > 5) {
            // console.log("!!! FREE SPIN AWARDED !!!");
            const freeSpins = accessData(settings.freeSpin.SymbolID, 5, gameInstance);
            // console.log(freeSpins, 'freeSpins')
            settings.freeSpin.freeSpinStarted = true;
            settings.freeSpin.freeSpinsAdded = true;
            settings.freeSpin.freeSpinCount += freeSpins;
            playerData.totalSpin += freeSpins;
            // uncomment only for testing purpose 
            // playerData.rtpSpinCount += freeSpins;
            settings.freeSpin.jokerSymbols.push(freeSpinsSymbol);
        }
    }
    catch (error) {
        console.error("Error in checkForFreeSpin:", error);
    }
}
function checkForTrumpFreeSpin(gameInstance) {
    const { settings, playerData } = gameInstance;
    try {
        // Find positions of TrumpFreeSpin symbols in the result matrix
        const TrumpFreeSpinSymbol = findSymbol(gameInstance, types_1.specialIcons.trumpFreeSpin);
        if (TrumpFreeSpinSymbol.length > 0 && settings.isWining) {
            console.log(TrumpFreeSpinSymbol.length, 'checkForTrumpFreeSpin');
            settings.freeSpin.freeSpinStarted = true;
            settings.freeSpin.freeSpinsAdded = true;
            settings.freeSpin.freeSpinCount += TrumpFreeSpinSymbol.length;
            settings.freeSpin.trumpSymbols.push(TrumpFreeSpinSymbol);
            return;
        }
    }
    catch (error) {
        console.error("Error in checkForTrumpFreeSpin:", error);
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
            linesApiData: gameInstance.settings.currentGamedata.linesApiData,
            Bets: gameInstance.settings.currentGamedata.bets,
        },
        UIData: gameUtils_1.UiInitData,
        PlayerData: {
            Balance: gameInstance.getPlayerData().credits,
        },
    };
    gameInstance.sendMessage("InitData", dataToSend);
}
//MAKERESULT JSON FOR FRONTENT SIDE
function makeResultJson(gameInstance) {
    try {
        const { settings, playerData } = gameInstance;
        const credits = gameInstance.getPlayerData().credits + playerData.currentWining;
        const Balance = credits.toFixed(3);
        const sendData = {
            GameData: {
                resultSymbols: settings.resultSymbolMatrix,
                linesToEmit: settings._winData.winningLines,
                symbolsToEmit: settings._winData.winningSymbols,
                freeSpins: {
                    count: settings.freeSpin.freeSpinCount,
                    isNewAdded: settings.freeSpin.freeSpinsAdded,
                    jokerSymbols: settings.freeSpin.jokerSymbols,
                    trumpSymbols: settings.freeSpin.trumpSymbols
                },
            },
            PlayerData: {
                Balance: Balance,
                totalbet: playerData.totalbet,
                haveWon: playerData.haveWon,
                currentWining: playerData.currentWining
            }
        };
        gameInstance.sendMessage('ResultData', sendData);
    }
    catch (error) {
        console.error("Error generating result JSON or sending message:", error);
    }
}
