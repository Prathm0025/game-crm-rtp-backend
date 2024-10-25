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
        handleSpecialSymbols(element, gameInstance);
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
            const firstSymbolPosition = line[0];
            const firstSymbolRightPosition = line[line.length - 1];
            let firstSymbol = settings.resultSymbolMatrix[firstSymbolPosition][0];
            let firstSymbolRight = settings.resultSymbolMatrix[firstSymbolRightPosition][line.length - 1];

            // Handle wild symbols
            if (settings.wild.useWild && firstSymbol === settings.wild.SymbolID) {
                firstSymbol = findFirstNonWildSymbol(line, gameInstance);
            }
            if (settings.wild.useWild && firstSymbolRight === settings.wild.SymbolID) {
                firstSymbolRight = findFirstNonWildSymbol(line, gameInstance);
            }

            // Handle special icons
            if (Object.values(specialIcons).includes(settings.Symbols[firstSymbol].Name as specialIcons)) {
                // Special icon logic can be handled here if needed
            }

            // Check for matching symbols on the line (left to right)
            const { isWinningLine, matchCount } = checkLineSymbols(firstSymbol, line, gameInstance);

            // Only check right side if left side win is zero or doesn't exist
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
                    console.log(`Payout for Left Line ${index}:`, "payout", totalPayout);
                    return
                }
            }


            const { isWinningRight, matchCountRight } = checkLineSymbolsRight(firstSymbolRight, line, gameInstance);

            if (isWinningRight && matchCountRight >= 3) {
                const symbolMultiplierRight = accessData(firstSymbolRight, matchCountRight, gameInstance);

                if (symbolMultiplierRight > 0) {
                    totalPayout = symbolMultiplierRight * gameInstance.settings.BetPerLines;
                    gameInstance.playerData.currentWining += totalPayout;
                    settings._winData.winningLines.push(index + 1);
                    winningLines.push({
                        line,
                        symbol: firstSymbolRight,
                        multiplier: symbolMultiplierRight,
                        matchCountRight,
                    });
                    console.log(`Line ${index}:`, line);
                    console.log(`Payout for Right Line ${index}:`, "payout", totalPayout);
                }
            }

        });

        // Calculate total Free Spins won (5 free spins per line with Free Spin win)
        console.log("Total Winning", gameInstance.playerData.currentWining);
        console.log("Total Free Spins Won: ", gameInstance.settings.freeSpin.freeSpinCount);

        gameInstance.playerData.haveWon += gameInstance.playerData.currentWining;
        makeResultJson(gameInstance);
        gameInstance.playerData.currentWining = 0;
        return winningLines;
    } catch (error) {
        console.error("Error in checkForWin", error);
        return [];
    }
}


//checking matching lines with first symbol and wild subs
function checkLineSymbols(
    firstSymbol: string,
    line: number[],
    gameInstance: SLBE
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
function checkLineSymbolsRight(
    firstSymbol: string,
    line: number[],
    gameInstance: SLBE
): {
    isWinningRight: boolean;
    matchCountRight: number;
    matchedIndices: { col: number; row: number }[];
} {
    try {
        const { settings } = gameInstance;
        const wildSymbol = settings.wild.SymbolID || "";
        let matchCountRight = 1;
        let currentSymbol = firstSymbol;

        // Start at the right-most column for right-to-left check
        const matchedIndices: { col: number; row: number }[] = [
            { col: line.length - 1, row: line[line.length - 1] },
        ];

        for (let i = 1; i < line.length; i++) {
            // Reverse both row and column for right-to-left check
            const rowIndex = line[line.length - 1 - i]; // Reverse row traversal
            const colIndex = line.length - 1 - i; // Reverse column traversal

            const symbol = settings.resultSymbolMatrix[rowIndex][colIndex];

            if (symbol === undefined) {
                console.error(`Symbol at position [${rowIndex}, ${colIndex}] is undefined.`);
                return { isWinningRight: false, matchCountRight: 0, matchedIndices: [] };
            }

            if (symbol === currentSymbol || symbol === wildSymbol) {
                matchCountRight++;
                matchedIndices.push({ col: colIndex, row: rowIndex });
            } else if (currentSymbol === wildSymbol) {
                currentSymbol = symbol;
                matchCountRight++;
                matchedIndices.push({ col: colIndex, row: rowIndex });
            } else {
                return { isWinningRight: matchCountRight >= 3, matchCountRight, matchedIndices };
            }
        }

        return { isWinningRight: matchCountRight >= 3, matchCountRight, matchedIndices };
    } catch (error) {
        console.error("Error in checkLineSymbolsRight:", error);
        return { isWinningRight: false, matchCountRight: 0, matchedIndices: [] };
    }
}


//checking first non wild symbol in lines which start with wild symbol
function findFirstNonWildSymbol(line, gameInstance: SLBE) {
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
        // console.error("Error in findFirstNonWildSymbol:");
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