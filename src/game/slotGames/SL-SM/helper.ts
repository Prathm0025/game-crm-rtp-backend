import { WinData } from "../BaseSlotGame/WinData";
import {
    convertSymbols,
    UiInitData,
} from "../../Utils/gameUtils";
import { SLSM } from "./sizzlingMoonBase";
import { FrozenIndex, specialIcons } from "./types";
import { calculatePayoutOfBonusGame, handleBonusGameSpin } from "./bonus";

/**
 * Initializes the game settings using the provided game data and game instance.
 * @param gameData - The data used to configure the game settings.
 * @param gameInstance - The instance of the SLCM class that manages the game logic.
 * @returns An object containing initialized game settings.
 */

export function initializeGameSettings(gameData: any, gameInstance: SLSM) {
    return {
        id: gameData.gameSettings.id,
        matrix: gameData.gameSettings.matrix,
        bets: gameData.gameSettings.bets,
        baseBet: gameData.gameSettings.baseBet,
        BetMultiplier: gameData.gameSettings.betMultiplier,
        Symbols: gameInstance.initSymbols,
        BonusSymbols: gameInstance.initBonusSymbols,
        resultSymbolMatrix: [],
        bonusResultMatrix: [],
        tempResultSymbolMatrix: [],
        currentGamedata: gameData.gameSettings,
        lineData: [],
        _winData: new WinData(gameInstance),
        currentBet: 0,
        baseBetAmount: gameData.gameSettings.baseBet,
        currentLines: 0,
        BetPerLines: 0,
        reels: [],
        bonusReels: [],
        stickyBonusValue: [],
        stickySymbolCount: gameData.gameSettings.stickyBonusCount,
        stickySymbolCountProb: gameData.gameSettings.stickySymbolCountProb,
        prizeValue: gameData.gameSettings.prizeValue,
        prizeValueProb: gameData.gameSettings.prizeValueProb,
        mysteryValues: gameData.gameSettings.mysteryValues,
        mysteryValueProb: gameData.gameSettings.mysteryValueProb,
        moonMysteryValues: gameData.gameSettings.moonMysteryValues,
        moonMysteryValueProb: gameData.gameSettings.moonMysteryValueProb,
        bonusSymbolValue: [],
        frozenIndices: [],
        miniMultiplier: gameData.gameSettings.miniMultiplier,
        minorMultiplier: gameData.gameSettings.minorMultiplier,
        majorMultiplier: gameData.gameSettings.majorMultiplier,
        grandMultiplier: gameData.gameSettings.grandMultiplier,
        moonMultiplier: gameData.gameSettings.moonMultiplier,
        moonMysteryData: [],
        isMoonJackpot: false,
        isStickyBonusSymbol: false,
        isGrandPrize: false,
        isStickyBonus: false,
        freeSpin: {
            freeSpinsAdded: false,
            freeSpinAwarded: gameData.gameSettings.freeSpinCount,
            freeSpinCount: 0,
            useFreeSpin: false,
            freeSpinPayout: 0
        },
        wild: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        bonus: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        stickyBonus: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        mystery: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        moonMystery: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        mini: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        minor: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        major: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        moon: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },


    };
}

/**
 * Generates the initial reel setup based on the game settings.
 * @param gameSettings - The settings used to generate the reel setup.
 * @returns A 2D array representing the reels, where each sub-array corresponds to a reel.
 */

export function generateInitialReel(gameSettings: any): string[][] {
    const reels = [[], [], [], [], [], [], []];
    gameSettings.Symbols.forEach((symbol) => {
        for (let i = 0; i < 4; i++) {
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
 * Generates the initial configuration for bonus reels based on game settings.
 * @param gameSettings - The settings containing the bonus symbols and their reel configurations.
 * @returns A 2D array representing the shuffled bonus reels.
 */

export function generateInitialBonusReel(gameSettings: any): string[][] {
    const reels = [[], [], [], [], [], [], []];
    gameSettings.BonusSymbols.forEach((symbol) => {
        for (let i = 0; i < 4; i++) {
            const count = symbol.reelInstance[i] || 0;
            for (let j = 0; j < count; j++) {
                reels[i].push(symbol.Id);
            }
        }
    });
    reels.forEach((reel) => {
        shuffleArray(reel);
    });

    gameSettings.bonusReels = reels;
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

/**
 * Configures paylines based on the game's settings and handles special symbols.
 * @param gameInstance - The instance of the game.
 */

export function makePayLines(gameInstance: SLSM) {
    const { settings } = gameInstance;
    settings.currentGamedata.Symbols.forEach((element) => {
        if (!element.useWildSub) {
            handleSpecialSymbols(element, gameInstance);
        }
    });
}

/**
 * Retrieves the multipliers associated with bonus symbols from the game instance.
 * @param gameInstance - The instance of the SLCM class that manages the game logic.
 * @returns An array of objects, each containing the name and value of a bonus symbol multiplier.
 */

function getMultipliersForBonusSymbols(gameInstance: SLSM) {
    const { settings } = gameInstance;
    const multipliers = [
        { name: "Mini Multiplier", value: settings.miniMultiplier },
        { name: "Minor Multiplier", value: settings.minorMultiplier },
        { name: "Major Multiplier", value: settings.majorMultiplier },
        { name: "Grand Multiplier", value: settings.grandMultiplier },
        { name: "Moon Multiplier", value: settings.moonMultiplier },
    ];

    return multipliers;
}

/**
 * Sends initial game and player data to the client.
 * @param gameInstance - The instance of the game containing settings and player data.
 */

export function sendInitData(gameInstance: SLSM) {
    gameInstance.settings.lineData =
        gameInstance.settings.currentGamedata.linesApiData;
    UiInitData.paylines = convertSymbols(gameInstance.settings.Symbols);
    const reels = generateInitialReel(gameInstance.settings);
    const bonusReels = generateInitialBonusReel(gameInstance.settings);
    const bonusMulipliers = getMultipliersForBonusSymbols(gameInstance);
    gameInstance.settings.reels = reels;
    const dataToSend = {
        GameData: {
            Reel: reels,
            BonusReel: bonusReels,
            linesApiData: gameInstance.settings.currentGamedata.linesApiData,
            Bets: gameInstance.settings.currentGamedata.bets,
            baseBet: gameInstance.settings.baseBetAmount,
            betMultiplier: gameInstance.settings.currentGamedata.betMultiplier,
            specialBonusSymbolMulipliers: bonusMulipliers,

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

/**
 * Checks for wins on paylines, processes free spins, and updates game state.
 * @param gameInstance - The instance of the game.
 * @returns An array of winning lines.
 */

export function checkForWin(gameInstance: SLSM) {
    try {
        const { settings } = gameInstance;

        const winningLines = [];
        let totalPayout = 0;
        if (!settings.freeSpin.useFreeSpin) {
            // check for stickybonussymbol and freeze
            if (settings.stickyBonusValue.length > 0) {
                settings.stickyBonusValue[0].value--;
                freezeSymbolonSpecificIndex(gameInstance);
                if (settings.stickyBonusValue[0].value <= 0) {
                    settings.stickyBonusValue.splice(0, 1);
                    // console.log("After Decrementedto zero:", settings.stickyBonusValue.length);
                }
                // console.log("After Decrement:", settings.stickyBonusValue[0]?.value);
            } else {
                settings.isStickyBonus = false;
                handleStickyBonus(gameInstance);
            }
            //check for free spin
            const { isFreeSpin } = checkForFreeSpin(gameInstance);
            if (!isFreeSpin) {
                //BASE GAME LOGIC    
                const validWinSymbols = countOccurenceOfSymbolsAndIndices(gameInstance);
                validWinSymbols.map(([symbol, matchCount]) => {
                    const multiplier =
                        accessData(symbol, matchCount, gameInstance)
                    const payout = multiplier * settings.currentBet;
                    totalPayout += payout;
                })
            }
        } else {
            if (settings.freeSpin.useFreeSpin && settings.freeSpin.freeSpinCount > 0) {
                settings.freeSpin.freeSpinCount -= 1;
                if (settings.freeSpin.freeSpinCount <= 0) {
                    const payoutOfBonusGame = calculatePayoutOfBonusGame(gameInstance);
                    // console.log(payoutOfBonusGame, "Payout");
                    settings.freeSpin.freeSpinPayout = payoutOfBonusGame;
                    settings.freeSpin.useFreeSpin = false;
                    settings.frozenIndices = [];
                }
            }
            handleBonusGameSpin(gameInstance);
        }

        // console.log(gameInstance.settings.bonusSymbolValue, "bonus symbol value");
        // console.log(gameInstance.settings.stickyBonusValue, "stcky symbol value");
        totalPayout += settings.freeSpin.freeSpinPayout;
        gameInstance.playerData.currentWining += totalPayout;
        gameInstance.playerData.haveWon += gameInstance.playerData.currentWining;
        gameInstance.updatePlayerBalance(gameInstance.playerData.currentWining);

        makeResultJson(gameInstance)
        settings._winData.totalWinningAmount = 0;
        gameInstance.playerData.currentWining = 0;
        settings.freeSpin.freeSpinPayout = 0;
        settings._winData.winningSymbols = []
        settings.freeSpin.freeSpinsAdded = false;
        gameInstance.settings.bonusSymbolValue = []



        return winningLines;
    } catch (error) {
        console.error("Error in checkForWin", error);
        return [];
    }
}

/**
 * Counts the occurrences of symbols and their indices in the result symbol matrix, including handling wild symbol substitutions.
 * Determines valid winning symbols based on their counts and combines indices for symbols to emit winnings.
 * 
 * @param gameInstance - The instance of the SLCM class that manages the game logic.
 * @returns An array of valid winning symbols where each entry is a tuple of the symbol ID and its count.
 */

function countOccurenceOfSymbolsAndIndices(gameInstance: SLSM) {
    const { settings } = gameInstance;
    const counts: Record<string | number, number> = {};
    const indices: Record<string | number, [number, number][]> = {};
    let wildCount = 0;
    let combinedIndices: Set<string> = new Set();

    // count symbols and track their indices
    settings.resultSymbolMatrix.forEach((row, rowIndex) => {
        row.forEach((num: number, colIndex: number) => {
            if (num === settings.wild.SymbolID) {
                wildCount++;
                if (!indices[settings.wild.SymbolID]) indices[settings.wild.SymbolID] = [];
                indices[settings.wild.SymbolID].push([rowIndex, colIndex]);
            } else {
                counts[num] = (counts[num] || 0) + 1;
                if (!indices[num]) indices[num] = [];
                indices[num].push([rowIndex, colIndex]);
            }
        });
    });
    /**
     * substitute wild symbol with every symbol
     * wild can substitute more than one symbol and give winnigs
     * for each symbol whose count is greater or equal to 8 combined with wild symbols
    */
    settings.Symbols.forEach((symbol: any) => {
        if (symbol.useWildSub && symbol.Id in counts) {
            counts[symbol.Id] += wildCount;
        }
    });

    // valid winning symbols(count greater or equal to 8)
    const validWinSymbols = Object.entries(counts).filter(([_, count]) => count >= 8);

    // combine indices for valid symbols and wild symbols for symbols to emit
    validWinSymbols.forEach(([symbolId]) => {
        [symbolId, settings.wild.SymbolID].forEach(id => {
            if (indices[id]) {
                indices[id].forEach(([row, col]) => {
                    combinedIndices.add(`${col},${row}`);
                });
            }
        });
    });

    const formattedIndices = Array.from(combinedIndices);
    settings._winData.winningSymbols = formattedIndices;
    // console.log(settings._winData.winningSymbols);

    return validWinSymbols;
}




/**
 * Retrieves the multiplier associated with a symbol and match count.
 * @param symbol - The symbol for which the multiplier is retrieved.
 * @param matchCount - The number of matching symbols.
 * @param gameInstance - The game instance containing symbol data.
 * @returns The multiplier value or 0 if no data is found.
 */

function accessData(symbol, matchCount, gameInstance: SLSM) {
    const { settings } = gameInstance;
    try {
        const symbolData = settings.currentGamedata.Symbols.find(
            (s) => s.Id.toString() === symbol.toString()
        );
        if (symbolData) {
            const multiplierArray = symbolData.multiplier;
            if (multiplierArray && multiplierArray[16 - matchCount]) {
                return multiplierArray[16 - matchCount][0];
            }
        }
        return 0;
    } catch (error) {
        // console.error("Error in accessData:");
        return 0;
    }
}

/**
 * Configures game settings based on the special symbol provided.
 * Updates the relevant symbol properties in the game instance based on the type of the special symbol.
 * 
 * @param symbol - The symbol object containing details such as name and ID.
 * @param gameInstance - The instance of the SLSM class that manages the game logic.
 */

function handleSpecialSymbols(symbol: any, gameInstance: SLSM) {
    switch (symbol.Name) {
        case specialIcons.wild:
            gameInstance.settings.wild.SymbolName = symbol.Name;
            gameInstance.settings.wild.SymbolID = symbol.Id;
            gameInstance.settings.wild.useWild = true;
            break;
        case specialIcons.bonus:
            gameInstance.settings.bonus.SymbolName = symbol.Name;
            gameInstance.settings.bonus.SymbolID = symbol.Id;
            gameInstance.settings.bonus.useWild = true;
            break;
        case specialIcons.stickyBonus:
            gameInstance.settings.stickyBonus.SymbolName = symbol.Name;
            gameInstance.settings.stickyBonus.SymbolID = symbol.Id;
            gameInstance.settings.stickyBonus.useWild = true;
            break;
        //TO DO: FIX INITIALISATION
        case specialIcons.mystery:
            gameInstance.settings.mystery.SymbolName = symbol.Name;
            gameInstance.settings.mystery.SymbolID = symbol.Id;
            gameInstance.settings.mystery.useWild = false;
            break;
        case specialIcons.moonMystery:
            gameInstance.settings.moonMystery.SymbolName = symbol.Name;
            gameInstance.settings.moonMystery.SymbolID = symbol.Id;
            gameInstance.settings.moonMystery.useWild = false;
            break;
        case specialIcons.mini:
            gameInstance.settings.mini.SymbolName = symbol.Name;
            gameInstance.settings.mini.SymbolID = symbol.Id;
            gameInstance.settings.mini.useWild = false;
            break;
        case specialIcons.minor:
            gameInstance.settings.minor.SymbolName = symbol.Name;
            gameInstance.settings.minor.SymbolID = symbol.Id;
            gameInstance.settings.minor.useWild = false;
            break;
        case specialIcons.major:
            gameInstance.settings.major.SymbolName = symbol.Name;
            gameInstance.settings.major.SymbolID = symbol.Id;
            gameInstance.settings.major.useWild = false;
            break;
        case specialIcons.moon:
            gameInstance.settings.moon.SymbolName = symbol.Name;
            gameInstance.settings.moon.SymbolID = symbol.Id;
            gameInstance.settings.moon.useWild = false;
            break;
        default:
            break; ``
    }
}

/**
 * Handles the logic for sticky bonus symbols in the game.
 * Identifies sticky bonus symbols in the result symbol matrix, assigns random sticky counts and prize values,
 * and updates the game settings with the highest sticky bonus object.
 * 
 * @param gameInstance - The instance of the SLSM class that manages the game logic.
 */

function handleStickyBonus(gameInstance: SLSM) {
    const { settings } = gameInstance;
    const { resultSymbolMatrix, stickyBonus, stickyBonusValue } = settings;
    let stickyBonusIndices: FrozenIndex[] = [];

    if (!stickyBonus?.SymbolID) {
        console.warn("Sticky Bonus SymbolID is not defined.");
        return;
    }

    resultSymbolMatrix.forEach((row, rowIndex) => {
        row.forEach((symbol, colIndex) => {
            if (symbol === stickyBonus.SymbolID) {
                const stickyCount = getRandomValue(gameInstance, 'sticky');
                const prizeValue = getRandomValue(gameInstance, 'prize')
                stickyBonusIndices.push({ position: [colIndex, rowIndex], prizeValue: prizeValue, value: stickyCount, symbol: symbol });
            }
        });
    });
    if (stickyBonusIndices.length > 0) {
        const maxFrozenObject = stickyBonusIndices.reduce((max, frozenObject) =>
            frozenObject.value > max.value ? frozenObject : max,
            stickyBonusIndices[0]
        );
        stickyBonusValue.push(maxFrozenObject);
        settings.isStickyBonus = true;
    }
    // console.log(stickyBonusValue, "FROZEN INDEX");    
}

/**
 * Retrieves a random value based on the specified type and its associated probabilities.
 * The function uses weighted probabilities to select a value from a predefined set.
 * 
 * @param gameInstance - The instance of the SLSM class that manages the game logic.
 * @param type - The type of random value to retrieve, such as 'sticky', 'prize', 'mystery', or 'moonMystery'.
 * @returns A randomly selected value based on the weighted probabilities for the specified type.
 * @throws An error if an invalid type is provided.
 */

export function getRandomValue(gameInstance: SLSM, type: 'sticky' | 'prize' | 'mystery' | 'moonMystery'): number {
    const { settings } = gameInstance;

    let values: number[];
    let probabilities: number[];
    if (type === 'sticky') {
        values = settings?.stickySymbolCount;
        probabilities = settings?.stickySymbolCountProb;
    } else if (type === 'prize') {
        values = settings?.prizeValue;
        probabilities = settings?.prizeValueProb;
    } else if (type === 'mystery') {
        values = settings?.mysteryValues;
        probabilities = settings?.mysteryValueProb;
    } else if (type === 'moonMystery') {
        values = settings?.moonMysteryValues;
        probabilities = settings?.moonMysteryValueProb;
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

/**
 * Freezes a sticky bonus symbol at a specific index in the result symbol matrix.
 * Updates the matrix to place the sticky bonus symbol at the position defined in the game settings.
 * 
 * @param gameInstance - The instance of the SLSM class that manages the game logic.
 */

function freezeSymbolonSpecificIndex(gameInstance: SLSM) {
    const { settings } = gameInstance;
    const index = settings.stickyBonusValue[0].position;
    const row = index[1];
    const col = index[0];

    settings.resultSymbolMatrix[row][col] = settings.stickyBonus.SymbolID;
}

/**
 * Checks if free spins are triggered based on the occurrence of bonus symbols in the result symbol matrix.
 * Updates the game settings with bonus symbol values and manages the sticky bonus logic for free spins.
 * 
 * @param gameInstance - The instance of the SLSM class that manages the game logic.
 * @returns An object containing the free spin status and the count of bonus symbols.
 */

function checkForFreeSpin(gameInstance: SLSM) {
    const { resultSymbolMatrix, bonus, stickyBonusValue, freeSpin } = gameInstance.settings;
    gameInstance.settings.frozenIndices = [];
    let bonusSymbolCount = 0
    resultSymbolMatrix.forEach((row, rowIndex) => {
        row.forEach((num: number, colIndex: number) => {
            if (num === bonus.SymbolID) {
                const bonusSymbolValue = getRandomValue(gameInstance, "prize");
                gameInstance.settings.bonusSymbolValue.push({ position: [colIndex, rowIndex], prizeValue: bonusSymbolValue, symbol: num })
                bonusSymbolCount++;
            }
        });
    });

    if (stickyBonusValue.length > 0) {
        bonusSymbolCount += 1;
    }
    const isFreeSpin = bonusSymbolCount >= 6;


    if (isFreeSpin) {
        if (stickyBonusValue.length > 0) {
            const index = stickyBonusValue[0].position;
            const bonusSymbolValue = stickyBonusValue[0].prizeValue;
            const row = index[1];
            const col = index[0];
            const symbol = stickyBonusValue[0].symbol
            gameInstance.settings.bonusSymbolValue.push({ position: [col, row], prizeValue: bonusSymbolValue, symbol: symbol })
        }
        gameInstance.settings.tempResultSymbolMatrix = resultSymbolMatrix
        stickyBonusValue.splice(0, 1);
        freeSpin.useFreeSpin = true;
        freeSpin.freeSpinCount += freeSpin.freeSpinAwarded
        gameInstance.settings.frozenIndices = gameInstance.settings.bonusSymbolValue;
        // console.log(gameInstance.settings.tempResultSymbolMatrix);
    }
    // console.log(`bonus symbol Count: ${bonusSymbolCount}`);
    // console.log(`Free Spin Triggered: ${isFreeSpin}`);
    return { isFreeSpin, bonusSymbolCount };
}



/**
 * Prepares and sends the result data for the current game state to the client.
 * Includes game data, player data, and details of any free spins or winnings.
 * @param gameInstance - The instance of the SLSM class containing the game state and settings.
 */

export function makeResultJson(gameInstance: SLSM) {
    try {
        const { settings, playerData } = gameInstance;
        const credits = gameInstance.getPlayerData().credits + playerData.currentWining
        const sendData = {
            GameData: {
                ResultReel: settings.resultSymbolMatrix,
                linesToEmit: settings._winData.winningLines,
                symbolsToEmit: settings._winData.winningSymbols,
                isFreeSpin: settings.freeSpin.useFreeSpin,
                freeSpinCount: settings.freeSpin.freeSpinCount,
                freeSpinAdded: settings.freeSpin.freeSpinsAdded,
                frozenIndices: settings.frozenIndices,
                isGrandPrize: settings.isGrandPrize,
                isMoonJackpot: settings.isMoonJackpot,
                moonMysteryData: settings.moonMysteryData,
                isStickyBonus: settings.isStickyBonusSymbol,
                stickyBonusValue: settings.stickyBonusValue,

            },
            PlayerData: {
                Balance: gameInstance.getPlayerData().credits,
                currentWining: playerData.currentWining,
                totalbet: playerData.totalbet,
                haveWon: playerData.haveWon,
            }
        };
        gameInstance.sendMessage('ResultData', sendData);

        console.log(sendData, "send Data");

    } catch (error) {
        console.error("Error generating result JSON or sending message:", error);
    }
}