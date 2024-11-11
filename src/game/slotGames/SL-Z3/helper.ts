import { WinData } from "../BaseSlotGame/WinData";
import {
    convertSymbols,
    UiInitData,
} from "../../Utils/gameUtils";
import { SLZEUS } from "./zeusBase";
import { specialIcons } from "./types";

/**
 * Initializes the game settings using the provided game data and game instance.
 * @param gameData - The data used to configure the game settings.
 * @param gameInstance - The instance of the SLCM class that manages the game logic.
 * @returns An object containing initialized game settings.
 */
export function initializeGameSettings(gameData: any, gameInstance: SLZEUS) {
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
        replacedToWildIndices:[],
        wild: {
            SymbolName: "",
            SymbolID: -1,
            useWild: false,
        },
        scatter:{
            symbolID:11,
           useScatter:false,
        }
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
function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function makePayLines(gameInstance: SLZEUS) {
    const { settings } = gameInstance;
    settings.currentGamedata.Symbols.forEach((element) => {
        if (!element.useWildSub) {
            handleSpecialSymbols(element, gameInstance);
        }
    });
}



//CHECK WINS ON PAYLINES WITH OR WITHOUT WILD
//check for win function
export function checkForWin(gameInstance: SLZEUS) {
    try {
        const { settings } = gameInstance;
        handleFullReelOfZeus(gameInstance);        
        const winningLines = [];
        let totalPayout = 0;
        settings.lineData.forEach((line, index) => {
            const firstSymbolPosition = line[0];
            let firstSymbol = settings.resultSymbolMatrix[firstSymbolPosition][0];
            if (settings.wild.useWild && firstSymbol === settings.wild.SymbolID) {
                firstSymbol = findFirstNonWildSymbol(line, gameInstance);
            }
            // Handle special icons
            if (
                Object.values(specialIcons).includes(
                    settings.Symbols[firstSymbol].Name as specialIcons
                )
            ) {

                return;
            }
            const { isWinningLine, matchCount, matchedIndices } = checkLineSymbols(
                firstSymbol,
                line,
                gameInstance
            );

            
            switch (true) {
                case isWinningLine && matchCount >= 3:
                    const symbolMultiplier = accessData(
                        firstSymbol,
                        matchCount,
                        gameInstance
                    );
                    settings.lastReel = settings.resultSymbolMatrix;
                    // console.log(settings.lastReel, 'lastReel')
                    switch (true) {
                        case symbolMultiplier > 0:
                            totalPayout += symbolMultiplier;
                            settings._winData.winningLines.push(index + 1);
                            winningLines.push({
                                line,
                                symbol: firstSymbol,
                                multiplier: symbolMultiplier,
                                matchCount,
                            });
                            console.log(`Line ${index + 1}:`, line);
                            console.log(
                                `Payout for Line ${index + 1}:`,
                                "payout",
                                symbolMultiplier
                            );
                            const formattedIndices = matchedIndices.map(({ col, row }) => `${col},${row}`);
                            const validIndices = formattedIndices.filter(
                                (index) => index.length > 2
                            );
                            if (validIndices.length > 0) {
                                // console.log(settings.lastReel, 'settings.lastReel')
                                console.log(validIndices);
                                settings._winData.winningSymbols.push(validIndices);
                                settings._winData.totalWinningAmount = totalPayout * settings.BetPerLines;
                                console.log(settings._winData.totalWinningAmount)
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

       const {isFreeSpin, scatterCount} = checkForFreeSpin(gameInstance);
       if(isFreeSpin){
        handleFreeSpins(scatterCount);
       }

        console.log(totalPayout, "totalPayout");
        
        gameInstance.playerData.currentWining = totalPayout;
        gameInstance.playerData.haveWon += totalPayout;

        
        makeResultJson(gameInstance)

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
    gameInstance: SLZEUS
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

//checking first non wild symbol in lines which start with wild symbol
function findFirstNonWildSymbol(line, gameInstance: SLZEUS) {
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
function accessData(symbol, matchCount, gameInstance: SLZEUS) {
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
        // console.error("Error in accessData:");
        return 0;
    }
}

/**
 * Sends the initial game and player data to the client.
 * @param gameInstance - The instance of the SLCM class containing the game settings and player data.
 */
export function sendInitData(gameInstance: SLZEUS) {
    gameInstance.settings.lineData =
        gameInstance.settings.currentGamedata.linesApiData;
    UiInitData.paylines = convertSymbols(gameInstance.settings.Symbols);
    const reels = generateInitialReel(gameInstance.settings);
    gameInstance.settings.reels = reels;
    const dataToSend = {
        GameData: {
            Reel: reels,
            linesApiData: gameInstance.settings.currentGamedata.linesApiData,
            Bets: gameInstance.settings.currentGamedata.bets,
            freeSpinData: gameInstance.settings.freeSpinData,
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

export function makeResultJson(gameInstance: SLZEUS) {
    try {
        const { settings, playerData } = gameInstance;
        const credits = gameInstance.getPlayerData().credits + playerData.currentWining
        const Balance = credits.toFixed(2)
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
        
    } catch (error) {
        console.error("Error generating result JSON or sending message:", error);
    }
}

function handleSpecialSymbols(symbol: any, gameInstance: SLZEUS) {
    switch (symbol.Name) {
        case specialIcons.wild:
            gameInstance.settings.wild.SymbolName = symbol.Name;
            gameInstance.settings.wild.SymbolID = symbol.Id;
            gameInstance.settings.wild.useWild = true;

            break;
        case specialIcons.FreeSpin:
            gameInstance.settings.freeSpin.symbolID = symbol.Id;
            gameInstance.settings.freeSpin.freeSpinMuiltiplier = symbol.multiplier;
            gameInstance.settings.freeSpin.useFreeSpin = true;
            break;
        case specialIcons.scatter:
        (gameInstance.settings.scatter.symbolID = symbol.Id),
        //   (gameInstance.settings.scatter.multiplier = symbol.multiplier);
          gameInstance.settings.scatter.useScatter = true;

        break;    
        default:
            break; ``
    }
}

function handleFullReelOfZeus(gameInstance: SLZEUS, symbolIdToCheck = 0){
    try {        
        const { settings } = gameInstance;
        const resultSymbolMatrix = settings.resultSymbolMatrix;
        for (let i = 0; i < resultSymbolMatrix.length; i++) {
            const reel = resultSymbolMatrix[i];        
            const isFullReel = reel.every(symbol => symbol === symbolIdToCheck);
            if (isFullReel) {
              for (let j = 0; j < reel.length; j++) {
                reel[j] = settings.wild.SymbolID; 
              }
              settings.replacedToWildIndices.push(i);
            }
          }
    } catch (error) {
        console.log(error);
        
    }
}

function checkForFreeSpin(gameInstance: SLZEUS) {
    const { resultSymbolMatrix, scatter } = gameInstance.settings;
    
    let scatterCount = 0;
    
    for (let i = 1; i < 6; i++) {
        const reel = resultSymbolMatrix[i];        
        scatterCount += reel.filter(symbol => symbol === scatter.symbolID).length;
    }
    const isFreeSpin = scatterCount >= 3;
    
    console.log(`Scatter Count: ${scatterCount}`);
    console.log(`Free Spin Triggered: ${isFreeSpin}`);
    return {isFreeSpin, scatterCount};
}

function handleFreeSpins(scatterCount: number) {
    switch (scatterCount) {
        case 5:
            console.log("Awarded: 50 Free Spins + 50x Total Bet");
            // Add logic to award 50 free spins and 50x total bet
            break;

        case 4:
            console.log("Awarded: 25 Free Spins + 10x Total Bet");
            // Add logic to award 25 free spins and 10x total bet
            break;

        case 3:
            console.log("Awarded: 10 Free Spins");
            // Add logic to award 10 free spins
            break;

        default:
            console.log("No Free Spins awarded");
            break;
    }
}
