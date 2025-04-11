"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGameSettings = initializeGameSettings;
exports.generateInitialReel = generateInitialReel;
exports.sendInitData = sendInitData;
exports.checkForBooster = checkForBooster;
exports.checkForLevelUp = checkForLevelUp;
exports.checkForWin = checkForWin;
exports.makeResultJson = makeResultJson;
const gameUtils_1 = require("../../Utils/gameUtils");
const WinData_1 = require("../BaseSlotGame/WinData");
function initializeGameSettings(gameData, gameInstance) {
    return {
        id: gameData.gameSettings.id,
        isSpecial: gameData.gameSettings.isSpecial,
        matrix: gameData.gameSettings.matrix,
        bets: gameData.gameSettings.bets,
        Symbols: gameInstance.initSymbols,
        resultSymbolMatrix: [],
        currentGamedata: gameData.gameSettings,
        _winData: new WinData_1.WinData(gameInstance),
        currentBet: 0,
        currentLines: 0,
        BetPerLines: 0,
        reels: [],
        scatterBlue: {
            isEnabled: gameData.gameSettings.scatterBlue.isEnabled,
            symbolsProbs: gameData.gameSettings.scatterBlue.symbolsProbs,
            featureProbs: gameData.gameSettings.scatterBlue.featureProbs,
            response: {
                isTriggered: false,
                symbols: [],
                payout: 0,
                levelUp: [],
                booster: [],
                count: []
            }
        },
        scatterPurple: Object.assign(Object.assign({}, gameData.gameSettings.scatterPurple), { response: {
                isTriggered: false,
                symbols: [],
                payout: 0,
                levelUp: [],
                booster: [],
                topSymbols: [],
                reTriggered: [],
                count: []
            } }),
        joker: {
            isEnabled: gameData.gameSettings.joker.isEnabled,
            isJoker: false,
            payout: gameData.gameSettings.joker.payout,
            blueRound: gameData.gameSettings.joker.blueRound,
            greenRound: gameData.gameSettings.joker.greenRound,
            redRound: gameData.gameSettings.joker.redRound,
            response: {
                isTriggered: false,
                payout: [],
                blueRound: 0,
                greenRound: 0,
                redRound: 0
            }
        },
        booster: {
            isEnabledSimple: false,
            isEnabledExhaustive: false,
            typeProbs: gameData.gameSettings.booster.typeProbs,
            multiplier: gameData.gameSettings.booster.multiplier,
            multiplierProbs: gameData.gameSettings.booster.multiplierProbs,
            response: {
                type: "NONE",
                multipliers: []
            }
        },
        levelUp: {
            isEnabled: gameData.gameSettings.levelUp.isEnabled,
            level: gameData.gameSettings.levelUp.level,
            levelProbs: gameData.gameSettings.levelUp.levelProbs,
            isLevelUp: false,
            response: {
                level: 0,
                isLevelUp: false
            }
        },
        defaultPayout: gameData.gameSettings.defaultPayout,
        SpecialType: gameData.gameSettings.SpecialType,
        freeSpinCount: 0,
        freeSpinType: "NONE",
        multiplierType: "NONE",
    };
}
function generateInitialReel(gameSettings) {
    const reel = [];
    gameSettings.Symbols.forEach(symbol => {
        const count = symbol.reelInstance[0] || 0; // Using reelInstance[0] for frequency
        for (let j = 0; j < count; j++) {
            reel.push(symbol.Id);
        }
    });
    (0, gameUtils_1.shuffleArray)(reel);
    return reel;
}
function sendInitData(gameInstance) {
    gameUtils_1.UiInitData.paylines = (0, gameUtils_1.convertSymbols)(gameInstance.settings.Symbols);
    const credits = gameInstance.getPlayerData().credits;
    const Balance = credits.toFixed(2);
    const reels = generateInitialReel(gameInstance.settings);
    gameInstance.settings.reels = reels;
    const dataToSend = {
        GameData: {
            // Reel: reels,
            Bets: gameInstance.settings.currentGamedata.bets,
            LevelUp: gameInstance.settings.levelUp.level,
            Booster: gameInstance.settings.booster.multiplier,
            Joker: gameInstance.settings.joker.payout,
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
function handleJoker(gameInstance) {
    let payout = 0;
    const jokerResponse = {
        isTriggered: true,
        payout: [],
        blueRound: 0,
        greenRound: 0,
        redRound: 0
    };
    //blueRound
    const matchesInBlue = getRandomIndex(gameInstance.settings.joker.blueRound);
    jokerResponse.blueRound = matchesInBlue;
    if (matchesInBlue === 3) {
        // console.log("blueRound cleared");
        payout = gameInstance.settings.joker.payout[0] * gameInstance.settings.BetPerLines;
        //move to green greenRound
        const matchesInGreen = getRandomIndex(gameInstance.settings.joker.greenRound);
        jokerResponse.greenRound = matchesInGreen;
        jokerResponse.payout.push(payout);
        if (matchesInGreen === 3) {
            // console.log("greenRound cleared");
            payout = gameInstance.settings.joker.payout[1] * gameInstance.settings.BetPerLines;
            //move to red redRound
            const matchesInRed = getRandomIndex(gameInstance.settings.joker.redRound);
            jokerResponse.redRound = matchesInRed;
            jokerResponse.payout.push(payout);
            if (matchesInRed === 3) {
                // console.log("redRound cleared");
                payout = gameInstance.settings.joker.payout[2] * gameInstance.settings.BetPerLines;
                jokerResponse.payout.push(payout);
            }
            else {
                // console.log("redRound not cleared");
                jokerResponse.payout.push(0);
            }
        }
        else {
            // console.log("greenRound not cleared");
            jokerResponse.payout.push(0);
        }
    }
    else {
        // console.log("blueRound not cleared");
        jokerResponse.payout.push(0);
    }
    // console.log("jokerResponse", jokerResponse);
    gameInstance.settings.joker = Object.assign(Object.assign({}, gameInstance.settings.joker), { response: jokerResponse });
    return jokerResponse.payout.reduce((a, b) => a + b, 0);
    // gameInstance.playerData.currentWining = jokerResponse.payout.reduce((a, b) => a + b, 0)
    // gameInstance.playerData.haveWon += gameInstance.playerData.currentWining
}
function handleNonSpecialSymbol(gameInstance) {
    try {
        let totalPayout = 0;
        // console.log("No special symbol found. Proceeding with normal payout calculation.");
        let symbol = gameInstance.settings.Symbols[gameInstance.settings.resultSymbolMatrix[0]];
        const levelUpResult = checkForLevelUp(gameInstance, false);
        // console.log("levelUpResult:", levelUpResult);
        if (levelUpResult.isLevelUp) {
            gameInstance.settings.levelUp.response = levelUpResult;
        }
        if (levelUpResult.isLevelUp) {
            symbol = gameInstance.settings.Symbols[levelUpResult.level];
        }
        const boosterResult = checkForBooster(gameInstance, false);
        // console.log("boosterResult:", boosterResult);
        if (boosterResult.type !== 'NONE') {
            gameInstance.settings.booster.response = boosterResult;
        }
        if (boosterResult.type !== 'NONE') {
            totalPayout = symbol.payout * gameInstance.settings.BetPerLines * boosterResult.multipliers.reduce((a, b) => a + b, 0);
            // gameInstance.playerData.currentWining = symbol.payout * gameInstance.settings.BetPerLines * boosterResult.multipliers.reduce((a, b) => a + b, 0)
        }
        else {
            totalPayout = symbol.payout * gameInstance.settings.BetPerLines;
            // gameInstance.playerData.currentWining = symbol.payout * gameInstance.settings.BetPerLines
        }
        // gameInstance.playerData.haveWon += gameInstance.playerData.currentWining;
        // gameInstance.settings.freeSpinCount = 0;
        // gameInstance.settings.freeSpinType = "NONE"
        // console.log("currWin:", gameInstance.playerData.currentWining);
        return totalPayout;
    }
    catch (err) {
        // console.log(err)
        // console.log("Error in handleNonSpecialSymbol")
    }
}
function handleScatterBlue(gameInstance) {
    try {
        let lives = 5;
        let totalPayout = 0;
        //NOTE: Scatter Blue Response
        let blueResponse = {
            isTriggered: true,
            symbols: [],
            payout: 0,
            levelUp: [],
            booster: [],
            count: []
        };
        gameInstance.settings.freeSpinType = "BLUE";
        while (lives > 0) {
            const index = getRandomIndex(gameInstance.settings.scatterBlue.symbolsProbs);
            let symbol = gameInstance.settings.Symbols[index];
            blueResponse.symbols.push(index);
            // console.log("Symbol", symbol.Id, "Payout:", symbol.payout);
            lives += symbol.freeSpinCount;
            --lives;
            blueResponse.count.push(lives);
            // console.log("Remaining lives:", lives);
            gameInstance.settings.freeSpinCount = lives;
            gameInstance.settings.resultSymbolMatrix = [symbol.Id];
            if (index !== 0) {
                const payout = applyScatterBlue(gameInstance, symbol, blueResponse);
                // console.log("payout:", payout);
                totalPayout += payout;
            }
            else if (index === 0) {
                blueResponse.levelUp.push({ isLevelUp: false, level: 0 });
                blueResponse.booster.push({ type: 'NONE', multipliers: [] });
            }
        }
        blueResponse.payout = totalPayout;
        // gameInstance.playerData.currentWining = totalPayout;
        // gameInstance.playerData.haveWon += gameInstance.playerData.currentWining;
        // console.log("currWin:", gameInstance.playerData.currentWining);
        // console.log("scatterBlueResponse:", blueResponse);
        gameInstance.settings.scatterBlue.response = blueResponse;
        // gameInstance.settings.freeSpinType = "NONE" as "NONE" | "BLUE" | "PURPLE";
        gameInstance.settings.freeSpinCount = 0;
        gameInstance.settings.resultSymbolMatrix = [14];
        return totalPayout;
    }
    catch (err) {
        // console.log(err)
        // console.log("Error in handleScatterBlue")
    }
}
function handleScatterPurple(gameInstance) {
    try {
        let lives = 10;
        let totalPayout = 0;
        let topSymbols = getTopSymbols(gameInstance);
        // console.log("init topSym", topSymbols);
        let purpleResponse = {
            isTriggered: true,
            topSymbols: [],
            symbols: [],
            payout: 0,
            levelUp: [],
            booster: [],
            reTriggered: [],
            count: []
        };
        gameInstance.settings.freeSpinType = "PURPLE";
        while (lives > 0) {
            const index = getRandomIndex(gameInstance.settings.scatterPurple.symbolsProbs);
            let symbol = gameInstance.settings.Symbols[index];
            // console.log("TOPSYM", topSymbols);
            // purpleResponse.symbols.push(index);
            purpleResponse.topSymbols.push([...topSymbols]); // Create a copy of topSymbols
            // console.log("Symbol", symbol.Id, "Payout:", symbol.payout);
            --lives;
            purpleResponse.count.push(lives);
            // console.log("Remaining lives:", lives);
            gameInstance.settings.freeSpinCount = lives;
            gameInstance.settings.resultSymbolMatrix = [symbol.Id];
            let payout = 0;
            if (index !== 0) {
                payout = applyScatterPurple(gameInstance, symbol, purpleResponse, topSymbols);
            }
            else {
                // Handle symbol 0 (empty symbol)
                purpleResponse.levelUp.push({ level: 0, isLevelUp: false });
                purpleResponse.booster.push({ type: 'NONE', multipliers: [] });
                purpleResponse.symbols.push(0);
                // Update topSymbols for symbol 0 as well
                // if (topSymbols.includes(0)) {
                //   const zeroIndex = topSymbols.indexOf(0);
                //   topSymbols[zeroIndex] = -1; // Mark as processed
                // }
            }
            // console.log("payout:", payout);
            totalPayout += payout;
            // Check if all the top symbols are empty (processed)
            if (topSymbols.every(symbol => symbol === 0)) {
                // console.log("All top symbols are empty. Re-triggering scatter purple feature.");
                lives = 10;
                topSymbols = getTopSymbols(gameInstance);
                purpleResponse.reTriggered.push(1);
            }
            else {
                purpleResponse.reTriggered.push(0);
            }
            purpleResponse.payout = totalPayout;
        }
        gameInstance.settings.scatterPurple.response = purpleResponse;
        // console.log("Scatter Purple response:", purpleResponse);
        // gameInstance.playerData.currentWining = totalPayout;
        // console.log("totalPayout:", totalPayout);
        // gameInstance.playerData.haveWon += totalPayout;
        // gameInstance.settings.freeSpinType = "NONE" as "NONE" | "BLUE" | "PURPLE";
        gameInstance.settings.resultSymbolMatrix = [15];
        return totalPayout;
    }
    catch (err) {
        // console.log(err);
        // console.log("Error in handleScatterPurple");
    }
}
function applyScatterBlue(gameInstance, symbol, response) {
    try {
        const feature = getRandomIndex(gameInstance.settings.scatterBlue.featureProbs);
        let sym = symbol;
        let multiplier = 0;
        let levelUpResult = { level: 0, isLevelUp: false };
        let boosterResult = { type: 'NONE', multipliers: [] };
        switch (feature) {
            case 1:
                // console.log("Level-up feature triggered");
                levelUpResult = checkForLevelUp(gameInstance, false);
                // console.log("lvlUp", levelUpResult);
                if (levelUpResult.isLevelUp) {
                    // console.log(`Leveled up to symbol: ${levelUpResult.level}`);
                    sym = gameInstance.settings.Symbols[levelUpResult.level];
                }
                break;
            case 2:
                // console.log("Booster feature triggered");
                boosterResult = checkForBooster(gameInstance, false);
                if (boosterResult.type !== 'NONE') {
                    // console.log(`Booster applied with multipliers: ${boosterResult.multipliers}`);
                    multiplier = boosterResult.multipliers.reduce((a, b) => a + b, 0);
                }
                // console.log("booster", boosterResult);
                break;
            case 3:
                // console.log("Level-up and booster both triggered");
                levelUpResult = checkForLevelUp(gameInstance, false);
                // console.log("lvlUp", levelUpResult);
                if (levelUpResult.isLevelUp) {
                    sym = gameInstance.settings.Symbols[levelUpResult.level];
                }
                boosterResult = checkForBooster(gameInstance, false);
                if (boosterResult.type !== 'NONE') {
                    multiplier = boosterResult.multipliers.reduce((a, b) => a + b, 0);
                }
                // console.log("booster", boosterResult);
                break;
            default:
            // console.log("No feature triggered.");
        }
        response.booster.push(boosterResult);
        response.levelUp.push(levelUpResult);
        let payout = 0;
        if (multiplier !== 0) {
            payout = sym.payout * gameInstance.settings.BetPerLines * multiplier;
        }
        else {
            payout = sym.payout * gameInstance.settings.BetPerLines;
        }
        return payout;
    }
    catch (err) {
        // console.log(err)
        // console.log("Error in applyScatterBlue")
    }
}
function applyScatterPurple(gameInstance, symbol, response, topSymbols) {
    try {
        const feature = getRandomIndex(gameInstance.settings.scatterPurple.featureProbs);
        let sym = symbol;
        let multiplier = 0;
        let levelUpResult = { level: 0, isLevelUp: false };
        let boosterResult = { type: 'NONE', multipliers: [] };
        response.symbols.push(sym.Id);
        switch (feature) {
            case 1:
                // console.log("Level-up feature triggered");
                levelUpResult = checkForLevelUp(gameInstance, true);
                // console.log("lvlUp", levelUpResult);
                if (levelUpResult.isLevelUp) {
                    // console.log(`Leveled up to symbol: ${levelUpResult.level}`);
                    if ((levelUpResult.level < gameInstance.settings.Symbols.length - 4)) {
                        sym = gameInstance.settings.Symbols[levelUpResult.level];
                    }
                }
                break;
            case 2:
                // console.log("Booster feature triggered");
                boosterResult = checkForBooster(gameInstance, true);
                if (boosterResult.type !== 'NONE') {
                    // console.log(`Booster applied with multipliers: ${boosterResult.multipliers}`);
                    multiplier = boosterResult.multipliers.reduce((a, b) => a + b, 0);
                }
                // console.log("booster", boosterResult);
                break;
            case 3:
                // console.log("Level-up and booster both triggered");
                levelUpResult = checkForLevelUp(gameInstance, true);
                // console.log("lvlUp", levelUpResult);
                if (levelUpResult.isLevelUp) {
                    if ((levelUpResult.level < gameInstance.settings.Symbols.length - 4)) {
                        sym = gameInstance.settings.Symbols[levelUpResult.level];
                    }
                }
                boosterResult = checkForBooster(gameInstance, true);
                if (boosterResult.type !== 'NONE') {
                    multiplier = boosterResult.multipliers.reduce((a, b) => a + b, 0);
                }
                // console.log("booster", boosterResult);
                break;
            default:
            // console.log("No feature triggered.");
        }
        //NOTE: match with topSymbols
        if (topSymbols.includes(sym.Id)) {
            //if os then change it to 0
            topSymbols.forEach((element, index) => {
                if (element === sym.Id) {
                    topSymbols[index] = 0;
                }
            });
        }
        // console.log("topSymbols", topSymbols);
        // response.topSymbols.push(topSymbols)
        response.booster.push(boosterResult);
        response.levelUp.push(levelUpResult);
        let payout = 0;
        if (multiplier !== 0) {
            payout = sym.payout * gameInstance.settings.BetPerLines * multiplier;
        }
        else {
            payout = sym.payout * gameInstance.settings.BetPerLines;
        }
        return payout;
    }
    catch (err) {
        // console.log(err)
        // console.log("Error in applyScatterPurple")
    }
}
function checkForBooster(gameInstance, trigger) {
    try {
        const { typeProbs, multiplier, multiplierProbs } = gameInstance.settings.booster;
        const boosterType = trigger ? forceBoosterActivation(typeProbs) : getRandomIndex(typeProbs);
        switch (boosterType) {
            case 1:
                return handleSimpleBooster(gameInstance);
            case 2:
                return handleExhaustiveBooster(gameInstance);
            default:
                return { type: 'NONE', multipliers: [] };
        }
    }
    catch (err) {
        // console.log(err)
        // console.log("Error in checkForBooster")
    }
}
function forceBoosterActivation(typeProbs) {
    let boosterType;
    do {
        boosterType = getRandomIndex(typeProbs);
    } while (boosterType === 0);
    return boosterType;
}
//NOTE: for booster
function getSimpleMultiplier(multipliers, multiplierProb) {
    const idx = getRandomIndex(multiplierProb);
    return multipliers[idx];
}
//NOTE: for booster
function getExhaustiveMultipliers(multipliers, multiplierProb) {
    try {
        const allMultipliers = [];
        const usedIndices = new Set();
        while (true) {
            const index = getRandomIndex(multiplierProb);
            if (usedIndices.has(index)) {
                break;
            }
            usedIndices.add(index);
            allMultipliers.push(multipliers[index]);
        }
        return allMultipliers;
    }
    catch (err) {
        // console.log(err)
        // console.log("Error in getExhaustiveMultipliers")
    }
}
//NOTE: for booster
function handleSimpleBooster(gameInstance) {
    try {
        const { multiplier, multiplierProbs } = gameInstance.settings.booster;
        return {
            type: 'SIMPLE',
            multipliers: [getSimpleMultiplier(multiplier, multiplierProbs)]
        };
    }
    catch (err) {
        // console.log(err)
        // console.log("Error in handleSimpleBooster")
    }
}
//NOTE: for booster
function handleExhaustiveBooster(gameInstance) {
    const { multiplier, multiplierProbs } = gameInstance.settings.booster;
    return {
        type: 'EXHAUSTIVE',
        multipliers: getExhaustiveMultipliers(multiplier, multiplierProbs)
    };
}
//NOTE: for level up feature
function getNonSpecialSymbols(symbols) {
    return symbols.filter(symbol => !symbol.isSpecial && symbol.Id !== 0)
        .sort((a, b) => a.payout - b.payout);
}
//NOTE: for level up feature
function findNextSymbol(currentSymbol, levelUp, nonSpecialSymbols) {
    const currentIndex = nonSpecialSymbols.findIndex(s => s.Id === currentSymbol.Id);
    if (currentIndex === -1)
        return currentSymbol; // If not found, return the current symbol
    const targetIndex = Math.min(currentIndex + levelUp, nonSpecialSymbols.length - 1);
    return nonSpecialSymbols[targetIndex];
}
//NOTE: level up feature
function checkForLevelUp(gameInstance, trigger) {
    try {
        const { resultSymbolMatrix, Symbols, levelUp } = gameInstance.settings;
        const resultSymbolIndex = resultSymbolMatrix[0];
        const resultSymbol = Symbols[resultSymbolIndex];
        // Ensure resultSymbol is defined
        if (!resultSymbol) {
            console.error(`Symbol with index ${resultSymbolIndex} not found.`);
            return { level: 0, isLevelUp: false };
        }
        // Check if the result symbol is eligible for level up
        if (resultSymbol.isSpecial || resultSymbol.Id === 0) {
            console.error(`Symbol with index ${resultSymbolIndex} is not eligible for level up.`);
            return { level: 0, isLevelUp: false };
        }
        const nonSpecialSymbols = getNonSpecialSymbols(Symbols);
        const { levelProbs, level } = levelUp;
        // Log the levelProbs and level arrays
        // console.log("levelProbs:", levelProbs);
        // console.log("level array:", level);
        let levelUpAmount;
        if (trigger) {
            // When trigger is true, ensure a level up spin
            do {
                const idx = getRandomIndex(levelProbs);
                levelUpAmount = level[idx];
                // console.log("Selected index (trigger):", idx, "LevelUpAmount:", levelUpAmount);
            } while (levelUpAmount === 0);
        }
        else {
            // When trigger is false, behave as before
            const idx = getRandomIndex(levelProbs);
            levelUpAmount = level[idx];
            // console.log("Selected index:", idx, "LevelUpAmount:", levelUpAmount);
        }
        if (levelUpAmount === 0 || levelUpAmount === undefined) {
            console.error("LevelUpAmount is undefined or zero.");
            return { level: 0, isLevelUp: false };
        }
        //check if levelup is possible 
        if ((levelUpAmount + resultSymbol.Id > Symbols.length - 1) || (Symbols[levelUpAmount + resultSymbol.Id].isSpecial)) {
            console.error("Level up is not possible.");
            return { level: 0, isLevelUp: false };
        }
        const newSymbol = findNextSymbol(resultSymbol, levelUpAmount, nonSpecialSymbols);
        if (newSymbol.Id <= resultSymbol.Id) {
            console.error("Level up is not possible.");
            return { level: 0, isLevelUp: false };
        }
        //addressing bug
        if (newSymbol.Id == resultSymbol.Id) {
            console.error("Level up is not possible.same symbol");
            return { level: 0, isLevelUp: false };
        }
        // console.log("levelUp", newSymbol.Id, newSymbol.payout);
        return {
            isLevelUp: newSymbol.Id !== resultSymbol.Id,
            level: newSymbol.Id
        };
    }
    catch (error) {
        console.error("Error in checkForLevelUp:", error);
        return { level: 0, isLevelUp: false };
    }
}
//NOTE: Reservoir Sampling or Monte Carlo Sampling is helpful if probabilities are dynamic and you need a different approach for randomness.
function getRandomIndex(probArray) {
    try {
        const totalWeight = probArray.reduce((sum, prob) => sum + prob, 0);
        let result = 0;
        let maxProb = 0;
        for (let i = 0; i < probArray.length; i++) {
            const rand = Math.random();
            const normalizedProb = probArray[i] / totalWeight;
            if (rand < normalizedProb && normalizedProb > maxProb) {
                maxProb = normalizedProb;
                result = i;
            }
        }
        return result;
    }
    catch (err) {
        // console.log(err)
        // console.log("Error in getRandomIndex")
    }
}
// get 5 unique non special and non zero symbols 
function getTopSymbols(gameInstance) {
    try {
        const { topSymbolProbs } = gameInstance.settings.scatterPurple;
        const topSymbols = [];
        while (topSymbols.length < 5) {
            const index = getRandomIndex(topSymbolProbs);
            if (!topSymbols.includes(index) && index !== 0) {
                topSymbols.push(index);
            }
        }
        return topSymbols;
    }
    catch (err) {
        // console.log(err)
        // console.log("Error in getTopSymbols")
    }
}
function checkForWin(gameInstance) {
    const outerSymbol = gameInstance.settings.Symbols.find(sym => sym.Id === gameInstance.settings.resultSymbolMatrix[0]);
    if (!outerSymbol)
        throw new Error(`Symbol with Id ${gameInstance.settings.resultSymbolMatrix[0]} not found.`);
    // console.log("freespin", gameInstance.settings.freeSpinCount, gameInstance.settings.freeSpinType);
    let payout = 0;
    switch (outerSymbol.Name) {
        case "ScatterBlue":
            // console.log("Scatter Blue feature triggered");
            payout = handleScatterBlue(gameInstance);
            break;
        case "ScatterPurple":
            // console.log("Scatter Purple feature triggered");
            payout = handleScatterPurple(gameInstance);
            break;
        case "Joker":
            // console.log("Joker feature triggered");
            payout = handleJoker(gameInstance);
            break;
        default:
            payout = handleNonSpecialSymbol(gameInstance);
    }
    gameInstance.playerData.currentWining = payout;
    gameInstance.playerData.haveWon += payout;
    gameInstance.updatePlayerBalance(gameInstance.playerData.currentWining);
    //TODO: if there is scatterPurple replace -1 with 0 in topSymbols 
    // if (gameInstance.settings.freeSpinType == "PURPLE") {
    //   gameInstance.settings.scatterPurple.response.topSymbols.map((round) => {
    //     round.map((symbol) => {
    //       if (symbol == -1) {
    //         return 0
    //       }return symbol
    //     })
    //   })
    // }
    makeResultJson(gameInstance);
    gameInstance.settings.booster.response = {
        type: 'NONE',
        multipliers: []
    };
    gameInstance.settings.levelUp.response = {
        isLevelUp: false,
        level: 0
    };
    gameInstance.settings.joker.response = {
        isTriggered: false,
        payout: [],
        blueRound: 0,
        greenRound: 0,
        redRound: 0
    };
    gameInstance.settings.freeSpinType = "NONE";
    gameInstance.settings.scatterBlue.response = {
        isTriggered: false,
        symbols: [],
        payout: 0,
        levelUp: [],
        booster: [],
        count: []
    };
    gameInstance.settings.scatterPurple.response = {
        isTriggered: false,
        topSymbols: [],
        symbols: [],
        payout: 0,
        levelUp: [],
        booster: [],
        reTriggered: [],
        count: []
    };
    // console.log("________________x_______x___________________");
}
function makeResultJson(gameInstance) {
    try {
        const { settings, playerData } = gameInstance;
        const credits = gameInstance.getPlayerData().credits;
        const Balance = credits.toFixed(2);
        const sendData = {
            GameData: {
                resultSymbols: settings.resultSymbolMatrix[0],
                jokerResponse: settings.joker.response,
                levelup: settings.levelUp.response,
                booster: settings.resultSymbolMatrix[0] == 0 ? {
                    type: 'NONE',
                    multipliers: []
                } : settings.booster.response,
                freespinType: settings.freeSpinType,
                freeSpinResponse: settings.freeSpinType == "NONE" ?
                    {} :
                    settings.freeSpinType == "BLUE" ?
                        settings.scatterBlue.response :
                        settings.scatterPurple.response
            },
            PlayerData: {
                Balance: Balance,
                currentWining: playerData.currentWining,
                totalbet: playerData.totalbet,
                haveWon: playerData.haveWon,
            }
        };
        gameInstance.sendMessage('ResultData', sendData);
        console.log("ResultData sent");
        console.log(JSON.stringify(sendData, null, 2));
        // console.log("levlup resp", sendData.GameData.levelup);
        // console.log("booster resp", sendData.GameData.booster);
        // console.log("scatter resp", sendData.GameData.freeSpinResponse);
        // console.log("joker resp", sendData.GameData.jokerResponse);
    }
    catch (error) {
        console.error("Error generating result JSON or sending message:", error);
    }
}
