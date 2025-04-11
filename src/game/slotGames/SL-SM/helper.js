"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGameSettings = initializeGameSettings;
exports.generateInitialReel = generateInitialReel;
exports.generateInitialBonusReel = generateInitialBonusReel;
exports.makePayLines = makePayLines;
exports.sendInitData = sendInitData;
exports.checkForWin = checkForWin;
exports.getRandomValue = getRandomValue;
exports.makeResultJson = makeResultJson;
const WinData_1 = require("../BaseSlotGame/WinData");
const gameUtils_1 = require("../../Utils/gameUtils");
const types_1 = require("./types");
const bonus_1 = require("./bonus");
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
        BonusSymbols: gameInstance.initBonusSymbols,
        resultSymbolMatrix: [],
        bonusResultMatrix: [],
        tempResultSymbolMatrix: [],
        currentGamedata: gameData.gameSettings,
        lineData: [],
        _winData: new WinData_1.WinData(gameInstance),
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
        minMatchCount: gameData.gameSettings.minMatchCount,
        freeSpinMatchCount: gameData.gameSettings.freeSpinMatchCount,
        moonMysteryData: [],
        isMoonJackpot: false,
        isStickyBonusSymbol: false,
        isGrandPrize: false,
        isStickyBonus: false,
        wildPayout: gameData.gameSettings.wildPayout,
        isAllWild: false,
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
function generateInitialReel(gameSettings) {
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
        (0, gameUtils_1.shuffleArray)(reel);
    });
    return reels;
}
/**
 * Generates the initial configuration for bonus reels based on game settings.
 * @param gameSettings - The settings containing the bonus symbols and their reel configurations.
 * @returns A 2D array representing the shuffled bonus reels.
 */
function generateInitialBonusReel(gameSettings) {
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
        (0, gameUtils_1.shuffleArray)(reel);
    });
    gameSettings.bonusReels = reels;
    return reels;
}
/**
 * Configures paylines based on the game's settings and handles special symbols.
 * @param gameInstance - The instance of the game.
 */
function makePayLines(gameInstance) {
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
function getMultipliersForBonusSymbols(gameInstance) {
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
function sendInitData(gameInstance) {
    gameInstance.settings.lineData =
        gameInstance.settings.currentGamedata.linesApiData;
    const symbols = [...gameInstance.settings.Symbols, ...gameInstance.settings.BonusSymbols];
    gameUtils_1.UiInitData.paylines = (0, gameUtils_1.convertSymbols)(symbols);
    const reels = generateInitialReel(gameInstance.settings);
    const bonusReels = generateInitialBonusReel(gameInstance.settings);
    const bonusMulipliers = getMultipliersForBonusSymbols(gameInstance);
    gameInstance.settings.reels = reels;
    const dataToSend = {
        GameData: {
            Reel: reels,
            // BonusReel: bonusReels,
            linesApiData: gameInstance.settings.currentGamedata.linesApiData,
            Bets: gameInstance.settings.currentGamedata.bets,
            baseBet: gameInstance.settings.baseBetAmount,
            betMultiplier: gameInstance.settings.currentGamedata.betMultiplier,
            specialBonusSymbolMulipliers: bonusMulipliers,
            allWildMultiplier: gameInstance.settings.wildPayout
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
/**
 * Checks for a win in the game and handles various game mechanics such as sticky bonuses, free spins, and base game wins.
 * The function performs the following tasks:
 * 1. **Sticky Bonus**: If there are sticky bonus symbols, it decrements their value and freezes the symbol on the grid.
 * 2. **Free Spin Logic**: If free spins are active, it reduces the free spin count and calculates the payout for free spins once they are exhausted.
 * 3. **Base Game Logic**: If free spins are not active, it checks for occurrences of winning symbols on the grid, calculates the corresponding payout, and updates the total payout.
 * 4. **Payout Calculation**: Based on the game state, it calculates the total payout for both free spins and base game wins.
 * 5. **Player Data Update**: Updates the player's current winnings and adds the win amount to the player's balance.
 * 6. **Game State Reset**: Resets relevant game settings and variables to prepare for the next round.
 *
 * @param gameInstance - The instance of the SLSM class managing the game logic.
 */
function checkForWin(gameInstance) {
    var _a;
    try {
        const { settings } = gameInstance;
        const winningLines = [];
        let totalPayout = 0;
        if (!settings.freeSpin.useFreeSpin) {
            // handle stickybonussymbol and freeze
            if (((_a = settings.stickyBonusValue[0]) === null || _a === void 0 ? void 0 : _a.value) > 0) {
                settings.stickyBonusValue = settings.stickyBonusValue.filter(frozenObject => frozenObject.value !== 0);
                handleStickySymbol(gameInstance);
                settings.stickyBonusValue[0].value--;
                freezeSymbolonSpecificIndex(gameInstance);
                if (settings.stickyBonusValue[0].value <= 0) {
                    //remove stickyBonusSymbol
                    settings.stickyBonusValue.splice(0, 1);
                    // console.log("After Decrementedto zero:", settings.stickyBonusValue.length);
                }
                // console.log("After Decrement:", settings.stickyBonusValue[0]?.value);
            }
            else {
                settings.isStickyBonus = false;
                handleStickyBonus(gameInstance);
            }
            //check for free spin trigger
            const { isFreeSpin } = checkForFreeSpin(gameInstance);
            if (!settings.freeSpin.useFreeSpin) {
                // BASE GAME LOGIC: Count occurrences of symbols and calculate payout
                const validWinSymbols = countOccurenceOfSymbolsAndIndices(gameInstance);
                validWinSymbols.map(([symbol, matchCount]) => {
                    const multiplier = accessData(symbol, matchCount, gameInstance);
                    const payout = multiplier * settings.currentBet;
                    totalPayout += payout;
                });
                const alllWild = isEverySymbolWild(gameInstance);
                if (alllWild) {
                    settings.isAllWild = true;
                    totalPayout += settings.wildPayout & settings.currentBet;
                }
            }
        }
        else {
            (0, bonus_1.handleBonusGameSpin)(gameInstance);
            // Handle logic for free spins
            if (settings.freeSpin.useFreeSpin && settings.freeSpin.freeSpinCount >= 0) {
                console.log("free");
                settings.freeSpin.freeSpinCount -= 1;
            }
        }
        // console.log(gameInstance.settings.bonusSymbolValue, "bonus symbol value");
        // console.log(gameInstance.settings.stickyBonusValue, "stcky symbol value"); 
        // Add free spin payout to total payout
        totalPayout += settings.freeSpin.freeSpinPayout;
        // Update player's current winnings and balance
        gameInstance.playerData.currentWining += totalPayout;
        gameInstance.playerData.haveWon = parseFloat((gameInstance.playerData.haveWon + parseFloat(gameInstance.playerData.currentWining.toFixed(4))).toFixed(4));
        gameInstance.updatePlayerBalance(gameInstance.playerData.currentWining);
        // Reset game state after payout
        makeResultJson(gameInstance);
        if (settings.isMoonJackpot) {
            settings.isMoonJackpot = false;
        }
        settings._winData.totalWinningAmount = 0;
        gameInstance.playerData.currentWining = 0;
        settings.freeSpin.freeSpinPayout = 0;
        settings._winData.winningSymbols = [];
        settings.freeSpin.freeSpinsAdded = false;
        gameInstance.settings.bonusSymbolValue = [];
        settings.isGrandPrize = false;
        settings.isAllWild = false;
    }
    catch (error) {
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
function countOccurenceOfSymbolsAndIndices(gameInstance) {
    const { settings } = gameInstance;
    const counts = {};
    const indices = {};
    let wildCount = 0;
    let combinedIndices = new Set();
    settings.stickyBonusValue = settings.stickyBonusValue.filter(frozenObject => frozenObject.symbol !== settings.bonus.SymbolID);
    // count symbols and track their indices
    settings.resultSymbolMatrix.forEach((row, rowIndex) => {
        row.forEach((num, colIndex) => {
            if (num === settings.wild.SymbolID) {
                wildCount++;
                if (!indices[settings.wild.SymbolID])
                    indices[settings.wild.SymbolID] = [];
                indices[settings.wild.SymbolID].push([rowIndex, colIndex]);
            }
            else {
                counts[num] = (counts[num] || 0) + 1;
                if (!indices[num])
                    indices[num] = [];
                indices[num].push([rowIndex, colIndex]);
            }
        });
    });
    settings.resultSymbolMatrix.forEach((row, rowIndex) => {
        row.forEach((num, colIndex) => {
            if (num === settings.bonus.SymbolID) {
                const stickyCount = 0;
                const prizeValue = getRandomValue(gameInstance, 'prize');
                settings.stickyBonusValue.push({ position: [colIndex, rowIndex], prizeValue: prizeValue, value: stickyCount, symbol: num });
            }
        });
    });
    /**
     * substitute wild symbol with every symbol
     * wild can substitute more than one symbol and give winnigs if
     * (symbol count + wild count) is greater or equal to 8.
    */
    settings.Symbols.forEach((symbol) => {
        if (symbol.useWildSub && symbol.Id in counts) {
            counts[symbol.Id] += wildCount;
        }
    });
    // valid winning symbols(count greater or equal to 8)
    const validWinSymbols = Object.entries(counts).filter(([_, count]) => count >= settings.minMatchCount);
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
//check if every Symbol Wild
function isEverySymbolWild(gameInstance) {
    const { settings } = gameInstance;
    const { resultSymbolMatrix, wild } = settings;
    // Check if all symbols are wild
    return resultSymbolMatrix.every(row => row.every(num => num === wild.SymbolID));
}
/**
 * Retrieves the multiplier associated with a symbol and match count.
 * @param symbol - The symbol for which the multiplier is retrieved.
 * @param matchCount - The number of matching symbols.
 * @param gameInstance - The game instance containing symbol data.
 * @returns The multiplier value or 0 if no data is found.
 */
function accessData(symbol, matchCount, gameInstance) {
    const { settings } = gameInstance;
    try {
        const symbolData = settings.currentGamedata.Symbols.find((s) => s.Id.toString() === symbol.toString());
        if (symbolData) {
            const multiplierArray = symbolData.multiplier;
            if (multiplierArray && multiplierArray[16 - matchCount]) {
                return multiplierArray[16 - matchCount][0];
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
 * Configures game settings based on the special symbol provided.
 * Updates the relevant symbol properties in the game instance based on the type of the special symbol.
 *
 * @param symbol - The symbol object containing details such as name and ID.
 * @param gameInstance - The instance of the SLSM class that manages the game logic.
 */
function handleSpecialSymbols(symbol, gameInstance) {
    switch (symbol.Name) {
        case types_1.specialIcons.wild:
            gameInstance.settings.wild.SymbolName = symbol.Name;
            gameInstance.settings.wild.SymbolID = symbol.Id;
            gameInstance.settings.wild.useWild = true;
            break;
        case types_1.specialIcons.bonus:
            gameInstance.settings.bonus.SymbolName = symbol.Name;
            gameInstance.settings.bonus.SymbolID = symbol.Id;
            gameInstance.settings.bonus.useWild = true;
            break;
        case types_1.specialIcons.stickyBonus:
            gameInstance.settings.stickyBonus.SymbolName = symbol.Name;
            gameInstance.settings.stickyBonus.SymbolID = symbol.Id;
            gameInstance.settings.stickyBonus.useWild = true;
            break;
        case types_1.specialIcons.mystery:
            gameInstance.settings.mystery.SymbolName = symbol.Name;
            gameInstance.settings.mystery.SymbolID = symbol.Id;
            break;
        case types_1.specialIcons.moonMystery:
            gameInstance.settings.moonMystery.SymbolName = symbol.Name;
            gameInstance.settings.moonMystery.SymbolID = symbol.Id;
            gameInstance.settings.moonMystery.useWild = false;
            break;
        case types_1.specialIcons.mini:
            gameInstance.settings.mini.SymbolName = symbol.Name;
            gameInstance.settings.mini.SymbolID = symbol.Id;
            gameInstance.settings.mini.useWild = false;
            break;
        case types_1.specialIcons.minor:
            gameInstance.settings.minor.SymbolName = symbol.Name;
            gameInstance.settings.minor.SymbolID = symbol.Id;
            gameInstance.settings.minor.useWild = false;
            break;
        case types_1.specialIcons.major:
            gameInstance.settings.major.SymbolName = symbol.Name;
            gameInstance.settings.major.SymbolID = symbol.Id;
            gameInstance.settings.major.useWild = false;
            break;
        case types_1.specialIcons.moon:
            gameInstance.settings.moon.SymbolName = symbol.Name;
            gameInstance.settings.moon.SymbolID = symbol.Id;
            gameInstance.settings.moon.useWild = false;
            break;
        default:
            break;
            ``;
    }
}
/**
 * Handles the logic for sticky bonus symbols in the game.
 * Identifies sticky bonus symbols in the result symbol matrix, assigns random sticky counts and prize values,
 * and updates the game settings with the highest sticky bonus object.
 *
 * @param gameInstance - The instance of the SLSM class that manages the game logic.
 */
function handleStickyBonus(gameInstance) {
    const { settings } = gameInstance;
    const { resultSymbolMatrix, stickyBonus, stickyBonusValue } = settings;
    let stickyBonusIndices = [];
    // check if the sticky bonus symbol is defined
    if (!(stickyBonus === null || stickyBonus === void 0 ? void 0 : stickyBonus.SymbolID)) {
        console.warn("Sticky Bonus SymbolID is not defined.");
        return;
    }
    // Iterate through the result symbol matrix to identify sticky bonus symbols
    resultSymbolMatrix.forEach((row, rowIndex) => {
        row.forEach((symbol, colIndex) => {
            if (symbol === stickyBonus.SymbolID) {
                const stickyCount = getRandomValue(gameInstance, 'sticky');
                const prizeValue = getRandomValue(gameInstance, 'prize');
                stickyBonusIndices.push({ position: [colIndex, rowIndex], prizeValue: prizeValue, value: stickyCount, symbol: symbol });
            }
        });
    });
    settings.stickyBonusValue = stickyBonusIndices;
    // console.log(settings.stickyBonusValue, "DD"); 
    // If sticky bonus symbols exist, find the highest sticky bonus and set others to 0
    if (settings.stickyBonusValue.length > 0) {
        const maxFrozenObject = settings.stickyBonusValue.reduce((max, frozenObject) => frozenObject.value > max.value ? frozenObject : max, settings.stickyBonusValue[0]);
        settings.stickyBonusValue = [
            maxFrozenObject,
            ...settings.stickyBonusValue
                .filter(frozenObject => frozenObject !== maxFrozenObject)
                .map(frozenObject => (Object.assign(Object.assign({}, frozenObject), { value: 0, prizeValue: 0 })))
        ];
        settings.isStickyBonus = true;
    }
    // console.log(settings.stickyBonusValue, "FROZEN INDEX");
}
function handleStickySymbol(gameInstance) {
    const { settings } = gameInstance;
    const { resultSymbolMatrix, stickyBonus } = settings;
    let stickyBonusIndices = [];
    // Check if the sticky bonus symbol is defined
    if (!(stickyBonus === null || stickyBonus === void 0 ? void 0 : stickyBonus.SymbolID)) {
        console.warn("Sticky Bonus SymbolID is not defined.");
        return;
    }
    // Iterate through the result symbol matrix to identify sticky bonus symbols
    resultSymbolMatrix.forEach((row, rowIndex) => {
        row.forEach((symbol, colIndex) => {
            if (symbol === stickyBonus.SymbolID) {
                const prizeValue = getRandomValue(gameInstance, 'prize');
                const position = [colIndex, rowIndex];
                // Check if the position already exists in stickyBonusValue
                const alreadyExists = settings.stickyBonusValue.some((existing) => existing.position[0] === position[0] && existing.position[1] === position[1]);
                // If not, add it to the indices
                if (!alreadyExists) {
                    stickyBonusIndices.push({
                        position,
                        prizeValue,
                        value: 0,
                        symbol,
                    });
                }
            }
        });
    });
    // Add all unique sticky bonus symbols to stickyBonusValue
    if (stickyBonusIndices.length > 0) {
        stickyBonusIndices.forEach((frozenObject) => {
            settings.stickyBonusValue.push(frozenObject);
        });
    }
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
function getRandomValue(gameInstance, type) {
    const { settings } = gameInstance;
    let values;
    let probabilities;
    // determine the values and probabilities based on the type
    if (type === 'sticky') {
        values = settings === null || settings === void 0 ? void 0 : settings.stickySymbolCount;
        probabilities = settings === null || settings === void 0 ? void 0 : settings.stickySymbolCountProb;
    }
    else if (type === 'prize') {
        values = settings === null || settings === void 0 ? void 0 : settings.prizeValue;
        probabilities = settings === null || settings === void 0 ? void 0 : settings.prizeValueProb;
    }
    else if (type === 'mystery') {
        values = settings === null || settings === void 0 ? void 0 : settings.mysteryValues;
        probabilities = settings === null || settings === void 0 ? void 0 : settings.mysteryValueProb;
    }
    else if (type === 'moonMystery') {
        values = settings === null || settings === void 0 ? void 0 : settings.moonMysteryValues;
        probabilities = settings === null || settings === void 0 ? void 0 : settings.moonMysteryValueProb;
    }
    else {
        throw new Error("Invalid type, expected 'coin' or 'freespin'");
    }
    // Calculate the total probability and select a random value
    const totalProbability = probabilities.reduce((sum, prob) => sum + prob, 0);
    const randomValue = Math.random() * totalProbability;
    let cumulativeProbability = 0;
    for (let i = 0; i < probabilities.length; i++) {
        cumulativeProbability += probabilities[i];
        if (randomValue < cumulativeProbability) {
            return values[i];
        }
    }
    //default to first value
    return values[0];
}
/**
 * Freezes a sticky bonus symbol at a specific index in the result symbol matrix.
 * Updates the matrix to place the sticky bonus symbol at the position defined in the game settings.
 *
 * @param gameInstance - The instance of the SLSM class that manages the game logic.
 */
function freezeSymbolonSpecificIndex(gameInstance) {
    const { settings } = gameInstance;
    const index = settings.stickyBonusValue[0].position;
    const row = index[1];
    const col = index[0];
    //freeze or replace spicky bonus at specifc index
    settings.resultSymbolMatrix[row][col] = settings.stickyBonus.SymbolID;
}
/**
 * Checks if free spins are triggered based on the occurrence of bonus symbols in the result symbol matrix.
 * Updates the game settings with bonus symbol values and manages the sticky bonus logic for free spins.
 *
 * @param gameInstance - The instance of the SLSM class that manages the game logic.
 * @returns An object containing the free spin status and the count of bonus symbols.
 */
function checkForFreeSpin(gameInstance) {
    const { resultSymbolMatrix, bonus, stickyBonusValue, freeSpin } = gameInstance.settings;
    // reset frozen indices and count bonus symbols
    gameInstance.settings.frozenIndices = [];
    let bonusSymbolCount = 0;
    // count bonusSymbols in the resultSymbolMatrix and store their values
    resultSymbolMatrix.forEach((row, rowIndex) => {
        row.forEach((num, colIndex) => {
            if (num === bonus.SymbolID) {
                const bonusSymbolValue = getRandomValue(gameInstance, "prize");
                gameInstance.settings.bonusSymbolValue.push({ position: [colIndex, rowIndex], prizeValue: bonusSymbolValue, symbol: num });
                bonusSymbolCount++;
            }
        });
    });
    // includes stickyBonusSymbol in the count
    if (stickyBonusValue.length > 0) {
        bonusSymbolCount += 1;
    }
    // determine if free spins are triggered
    const isFreeSpin = bonusSymbolCount >= gameInstance.settings.freeSpinMatchCount;
    if (isFreeSpin) {
        // handle sticky bonus symbol if it exists
        if (stickyBonusValue.length > 0) {
            const index = stickyBonusValue[0].position;
            const bonusSymbolValue = stickyBonusValue[0].prizeValue;
            const row = index[1];
            const col = index[0];
            const symbol = stickyBonusValue[0].symbol;
            gameInstance.settings.bonusSymbolValue.push({ position: [col, row], prizeValue: bonusSymbolValue, symbol: symbol });
        }
        //gameSettings update for freespins
        gameInstance.settings.tempResultSymbolMatrix = resultSymbolMatrix;
        stickyBonusValue.splice(0, 1);
        freeSpin.useFreeSpin = true;
        freeSpin.freeSpinCount += freeSpin.freeSpinAwarded;
        gameInstance.settings.frozenIndices = gameInstance.settings.bonusSymbolValue;
        gameInstance.settings.isStickyBonus = false;
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
function makeResultJson(gameInstance) {
    try {
        const { settings, playerData } = gameInstance;
        const credits = gameInstance.getPlayerData().credits + playerData.currentWining;
        const sendData = {
            GameData: {
                ResultReel: settings.resultSymbolMatrix,
                BonusResultReel: settings.bonusResultMatrix,
                symbolsToEmit: settings._winData.winningSymbols,
                isFreeSpin: settings.freeSpin.useFreeSpin,
                freeSpinCount: settings.freeSpin.freeSpinCount,
                freeSpinAdded: settings.freeSpin.freeSpinsAdded,
                frozenIndices: settings.frozenIndices,
                isGrandPrize: settings.isGrandPrize,
                isMoonJackpot: settings.isMoonJackpot,
                moonMysteryData: settings.moonMysteryData.map((item) => [
                    item.id,
                    ...item.position,
                    item.prizeValue,
                    item.symbol
                ]),
                isStickyBonus: settings.isStickyBonus,
                stickyBonusValue: settings.stickyBonusValue,
                isAllWild: settings.isAllWild,
            },
            PlayerData: {
                Balance: gameInstance.getPlayerData().credits,
                currentWining: playerData.currentWining,
                totalbet: playerData.totalbet,
                haveWon: playerData.haveWon,
            }
        };
        gameInstance.sendMessage('ResultData', sendData);
        console.log(sendData.GameData.BonusResultReel, "Send Data");
        console.log(sendData, "Send Data");
    }
    catch (error) {
        console.error("Error generating result JSON or sending message:", error);
    }
}
