import { WinData } from "../BaseSlotGame/WinData";
import {
    convertSymbols,
    UiInitData,
} from "../../Utils/gameUtils";
import { RandomResultGenerator } from "../RandomResultGenerator";
import { SLBE } from "./bloodEternalBase";
import { specialIcons } from "./types";

/**
 * Initializes the game settings using the provided game data and game instance.
 * @param gameData - The data used to configure the game settings.
 * @param gameInstance - The instance of the SLCM class that manages the game logic.
 * @returns An object containing initialized game settings.
 */
export function initializeGameSettings(gameData: any, gameInstance: SLBE) {
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
        isLeftWinTrue: false,
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
        vampireMan: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        vampireWomen: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        HumanMan: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        HumanWomen: {
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

export function makePayLines(gameInstance: SLBE) {
    const { settings } = gameInstance;
    settings.currentGamedata.Symbols.forEach((element) => {
        if (!element.useWildSub) {
            handleSpecialSymbols(element, gameInstance);
        }
    });
}

function handleSpecialSymbols(symbol: any, gameInstance: SLBE) {
    switch (symbol.Name) {
        case specialIcons.wild:
            gameInstance.settings.wild.SymbolName = symbol.Name;
            gameInstance.settings.wild.SymbolID = symbol.Id;
            gameInstance.settings.wild.useWild = true;
            break;
        case specialIcons.VampireMan:
            gameInstance.settings.vampireMan.SymbolName = symbol.Name;
            gameInstance.settings.vampireMan.SymbolID = symbol.Id;
            gameInstance.settings.vampireMan.useWild = true;
            break;
        case specialIcons.VampireWomen:
            gameInstance.settings.vampireWomen.SymbolName = symbol.Name;
            gameInstance.settings.vampireWomen.SymbolID = symbol.Id;
            gameInstance.settings.vampireWomen.useWild = true;
            break;
        case specialIcons.HumanMan:
            gameInstance.settings.HumanMan.SymbolName = symbol.Name;
            gameInstance.settings.HumanMan.SymbolID = symbol.Id;
            gameInstance.settings.HumanMan.useWild = true;
            break;
        case specialIcons.HumanWomen:
            gameInstance.settings.HumanWomen.SymbolName = symbol.Name;
            gameInstance.settings.HumanWomen.SymbolID = symbol.Id;
            gameInstance.settings.HumanWomen.useWild = true;
            break;
        default:
    }
}


//CHECK WINS ON PAYLINES WITH OR WITHOUT WILD
//check for win function
export function checkForWin(gameInstance: SLBE) {
    try {
        const { settings } = gameInstance;
        const winningLines = [];
        let totalPayout = 0;

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
                    console.log(`Line ${index + 1} (LTR):`, line);
                    console.log(`Payout for LTR Line ${index + 1}:`, "payout", payout);
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
                    console.log(`Line ${index + 1} (RTL):`, line);
                    console.log(`Payout for RTL Line ${index + 1}:`, "payout", payout);
                }
            }
        });

        // Log and update game state after all lines are checked
        console.log("Total Winning", gameInstance.playerData.currentWining);
        console.log("Total Free Spins Won:", gameInstance.settings.freeSpin.freeSpinCount);

        gameInstance.playerData.haveWon += gameInstance.playerData.currentWining;
        makeResultJson(gameInstance);
        gameInstance.playerData.currentWining = 0;

        return winningLines;
    } catch (error) {
        console.error("Error in checkForWin:", error);
        return [];
    }
}




type MatchedIndex = { col: number; row: number };
type CheckLineResult = { isWinningLine: boolean; matchCount: number; matchedIndices: MatchedIndex[] };
type WinningLineDetail = { direction: 'LTR' | 'RTL'; lineIndex: number; details: CheckLineResult };

function checkLineSymbols(
    firstSymbol: string,
    line: number[],
    gameInstance: SLBE,
    direction: 'LTR' | 'RTL' = 'LTR'
): CheckLineResult {
    try {
        const { settings } = gameInstance;
        const wildSymbol = settings.wild.SymbolID || "";
        let matchCount = 1;
        let currentSymbol = firstSymbol;

        const matchedIndices: MatchedIndex[] = [];
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
    } catch (error) {
        console.error("Error in checkLineSymbols:", error);
        return { isWinningLine: false, matchCount: 0, matchedIndices: [] };
    }
}
//checking first non wild symbol in lines which start with wild symbol
function findFirstNonWildSymbol(line: number[], gameInstance: SLBE, direction: 'LTR' | 'RTL' = 'LTR') {
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
    } catch (error) {
        console.error("Error in findFirstNonWildSymbol:", error);
        return null;
    }
}


//payouts to user according to symbols count in matched lines
function accessData(symbol, matchCount, gameInstance: SLBE) {
    const { settings } = gameInstance;

    try {
        const symbolData = settings.currentGamedata.Symbols.find(
            (s) => s.Id.toString() === symbol.toString()
        );
        if (symbolData) {
            const multiplierArray = symbolData.multiplier;

            if (multiplierArray && multiplierArray[settings.matrix.x - matchCount]) {
                return multiplierArray[settings.matrix.x - matchCount][0];

            }
        }
        return 0;
    } catch (error) {
        // console.error("Error in accessData:");
        return 0;
    }
}

/**
 * Sends the initial game and player data to the client.
 * @param gameInstance - The instance of the SLCM class containing the game settings and player data.
 */
export function sendInitData(gameInstance: SLBE) {
    gameInstance.settings.lineData =
        gameInstance.settings.currentGamedata.linesApiData;
    UiInitData.paylines = convertSymbols(gameInstance.settings.Symbols);
    const reels = generateInitialReel(gameInstance.settings);
    gameInstance.settings.reels = reels;
    const dataToSend = {
        GameData: {
            Reel: reels,
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

export function makeResultJson(gameInstance: SLBE) {
    try {
        const { settings, playerData } = gameInstance;
        const credits = gameInstance.getPlayerData().credits
        const Balance = credits.toFixed(2)
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
    } catch (error) {
        console.error("Error generating result JSON or sending message:", error);
    }
}