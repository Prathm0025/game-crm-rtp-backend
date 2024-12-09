
import { Player } from "../../dashboard/users/userModel";
import { UserData } from "../../utils/globalTypes";
export enum specialIcons {
    bonus = "Bonus",
    scatter = "Scatter",
    jackpot = "Jackpot",
    wild = "Wild",
    any = "any",
    FreeSpin = "FreeSpin"
}
export interface RequiredSocketMethods {
    sendMessage(action: string, message: any): void;
    sendError(error: string): void;
    sendAlert(alert: string): void;
    messageHandler(data: any): void;
    updatePlayerBalance(amount: number): void;
    deductPlayerBalance(amount: number): void;
}
export enum bonusGameType {
    tap = "tap",
    spin = "spin",
    default = "default",
    miniSpin = "miniSpin",
    layerTap = "layerTap"
}

export const PlayerData: UserData = {
    Balance: 0,
    haveWon: 0,
    currentWining: 0
}

export const enum messageType {
    ALERT = "alert",
    MESSAGE = "message",
    ERROR = "internalError",
    CREDITSUPDATE = 'creditsUpdate',
    DATA = "data"
}

export const getCurrentRTP = {
    playerWon: 0,
    playerTotalBets: 0,
};


export enum gameCategory {
    SLOT = "SL",
    KENO = "KN",
}

export interface BonusPayEntry {
    symbolCount: number;
    symbolID: number;
    pay: number;
    highestPayMultiplier: number;
}
export interface ScatterPayEntry {
    symbolCount: number;
    symbolID: number;
    pay: number;
    freeSpins: number;
}

export enum ResultType {
    moolah = "moolah",
    normal = "normal",
}
export const betMultiplier = [0.1, 0.25, 0.5, 0.75, 1];


export const UiInitData = {
    paylines: null,
    spclSymbolTxt: [],
    AbtLogo: {
        logoSprite: "https://iili.io/JrMCqPf.png",
        link: "https://dingding-game.vercel.app/login",
    },
    ToULink: "https://dingding-game.vercel.app/login",
    PopLink: "https://dingding-game.vercel.app/login",
};


export function convertSymbols(data) {


    let uiData = {
        symbols: [],
    };


    if (!Array.isArray(data)) {
        // console.error("Input data is not an array");
        return uiData;
    }
    data.forEach((element) => {

        let symbolData = {
            ID: element.Id,
            Name: element.Name || {},
            "multiplier": element.multiplier || {},
            "defaultAmount": element.defaultAmount || {},
            "symbolsCount": element.symbolsCount || {},
            "increaseValue": element.increaseValue || {},
            "freeSpin": element.freeSpin,
            "description": element.description || {},
            "payout": element.payout || 0,
            "mixedPayout": element.mixedPayout || {},
            "defaultPayout": element.defaultPayout || {}
        };
        // if (element.multiplier) {
        //   const multiplierObject = {};
        //   element.multiplier.forEach((item, index) => {
        //     multiplierObject[(5 - index).toString() + "x"] = item[0];
        //   });
        //   symbolData.multiplier = multiplierObject;
        // }


        uiData.symbols.push(symbolData);
    });

    return uiData;
}


export function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
     let seed = Date.now() + Math.random() * 1000 ; 
        let j=  generateRandomNumber(seed, (i+1));
    let k = array[i];
        array[i] = array[j];
        array[j] = k;
    }
}

export async function getPlayerCredits(playerName: string) {
    try {
        const currentUser = await Player.findOne({ username: playerName }).exec();
        if (!currentUser) {
            return `No user found with playerName ${playerName}`;
        }
        return currentUser.credits;
    } catch (error) {
        console.error(`Error fetching credits for player ${playerName}:`, error);
        return `An error occurred while fetching credits for player ${playerName}.`;
    }
}




function newtonRng(seed, maxIterations = 10) {
    let x = seed;
    const constant = 71; 

    const epsilon = 1e-10;

    for (let i = 0; i < maxIterations; i++) {
        let fx = Math.sin(x * x) - constant; 
        let fpx = 2 * x * Math.cos(x);

        let nextX = x - fx / (fpx + epsilon);
      
        if (Math.abs(nextX - x) < epsilon) {
            break;
        }
        
        x = nextX + Math.random();
    }
    
    return Math.abs(x % 1);
}

function generateBetRng(seed, number,  maxIterations = 20,) {    
    const randomValue = newtonRng(seed, maxIterations);    
    return Math.floor(randomValue * number); 
}

export function generateRandomNumber(seed, number) {
         
        let randomNum = generateBetRng(seed, number);        
        seed = (seed * Math.random() * Math.sin(seed) + Date.now()) % (1e10 * Math.random()) + Math.random();
    return randomNum;
}


