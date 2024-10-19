"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLLOL = void 0;
const helper_1 = require("./helper");
const RandomResultGenerator_1 = require("../RandomResultGenerator");
class SLLOL {
    constructor(currentGameData) {
        this.currentGameData = currentGameData;
        this.playerData = {
            haveWon: 0,
            currentWining: 0,
            totalbet: 0,
            rtpSpinCount: 0,
            totalSpin: 0,
            currentPayout: 0
        };
        console.log("Initializing SLLOL game");
        // console.log("currentGameData:", JSON.stringify(currentGameData, null, 2));
        try {
            this.settings = (0, helper_1.initializeGameSettings)(currentGameData, this);
            console.log("Game settings initialized");
            this.settings.reels = (0, helper_1.generateInitialReel)(this.settings);
            // console.log("Initial reels generated:", this.settings.reels);
            (0, helper_1.sendInitData)(this);
        }
        catch (error) {
            console.error("Error initializing SLLOL game:", error);
        }
    }
    logSafeSettings() {
        const _a = this.settings, { _winData } = _a, safeSettings = __rest(_a, ["_winData"]);
        return JSON.stringify(safeSettings, null, 2);
    }
    get initSymbols() {
        console.log("Getting initial symbols");
        const Symbols = this.currentGameData.gameSettings.Symbols || [];
        // console.log("Initial symbols:", Symbols);
        return Symbols;
    }
    getSymbol(id) {
        return this.settings.Symbols.find(s => s.Id === id);
    }
    isWild(symbolId) {
        // const symbol = this.getSymbol(symbolId);
        // return symbol ? symbol.Name === "Wild" : false;
        return symbolId === 11;
    }
    sendMessage(action, message) {
        this.currentGameData.sendMessage(action, message);
    }
    sendError(message) {
        this.currentGameData.sendError(message);
    }
    sendAlert(message) {
        this.currentGameData.sendAlert(message);
    }
    updatePlayerBalance(amount) {
        this.currentGameData.updatePlayerBalance(amount);
    }
    deductPlayerBalance(amount) {
        this.currentGameData.deductPlayerBalance(amount);
    }
    getPlayerData() {
        return this.currentGameData.getPlayerData();
    }
    messageHandler(response) {
        switch (response.id) {
            case "SPIN":
                this.prepareSpin(response.data);
                // this.spinResult();
                this.getRTP(response.data.spins || 1);
                break;
        }
    }
    prepareSpin(data) {
        this.settings.currentLines = data.currentLines;
        this.settings.BetPerLines = this.settings.currentGamedata.bets[data.currentBet];
        this.settings.currentBet = this.settings.BetPerLines * this.settings.currentLines;
    }
    spinResult() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const playerData = this.getPlayerData();
                if (this.settings.currentBet > playerData.credits) {
                    this.sendError("Low Balance");
                    return;
                }
                yield this.deductPlayerBalance(this.settings.currentBet);
                this.playerData.totalbet += this.settings.currentBet;
                new RandomResultGenerator_1.RandomResultGenerator(this);
                this.checkResult();
            }
            catch (error) {
                this.sendError("Spin error");
                console.error("Failed to generate spin results:", error);
            }
        });
    }
    getRTP(spins) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let spend = 0;
                let won = 0;
                this.playerData.rtpSpinCount = spins;
                for (let i = 0; i < this.playerData.rtpSpinCount; i++) {
                    yield this.spinResult();
                    spend = this.playerData.totalbet;
                    won = this.playerData.haveWon;
                    console.log("Balance:", this.getPlayerData().credits);
                    console.log(`Spin ${i + 1} completed. ${this.playerData.totalbet} , ${won}`);
                }
                let rtp = 0;
                if (spend > 0) {
                    rtp = won / spend;
                }
                console.log('RTP calculated:', rtp * 100);
                return;
            }
            catch (error) {
                console.error("Failed to calculate RTP:", error);
                this.sendError("RTP calculation error");
            }
        });
    }
    checkResult() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultMatrix = this.settings.resultSymbolMatrix;
                // console.log("Result Matrix:", resultMatrix);
                const { payout, winningCombinations } = this.checkWin(resultMatrix);
                // console.log("winning comb:", winningCombinations);
                (0, helper_1.printWinningCombinations)(winningCombinations);
                this.playerData.currentWining = payout;
                this.playerData.haveWon += payout;
                if (payout > 0) {
                    this.updatePlayerBalance(this.playerData.currentWining);
                }
                (0, helper_1.makeResultJson)(this);
                console.log("Total Payout:", payout);
                // console.log("Winning Combinations:", winningCombinations);
            }
            catch (error) {
                console.error("Error in checkResult:", error);
            }
        });
    }
    checkWin(result) {
        let totalPayout = 0;
        let winningCombinations = [];
        const findCombinations = (symbolId, col, path) => {
            // Stop if we've checked all columns or path is complete
            if (col === this.settings.matrix.x) {
                if (path.length >= this.settings.minMatchCount) {
                    const symbol = this.getSymbol(symbolId);
                    // Fix the payout index based on path length (5 -> 0, 4 -> 1, 3 -> 2)
                    const multiplierIndex = path.length - this.settings.minMatchCount;
                    const multiplier = symbol.multiplier[multiplierIndex][0];
                    winningCombinations.push({ symbolId, positions: path, payout: multiplier * this.settings.BetPerLines });
                    // console.log("payouttttt", symbol.payout[payoutIndex] );
                    // console.log("asdasd");
                }
                return;
            }
            for (let row = 0; row < this.settings.matrix.y; row++) {
                const currentSymbolId = result[row][col];
                if (currentSymbolId === symbolId || this.isWild(currentSymbolId)) {
                    findCombinations(symbolId, col + 1, [...path, [row, col]]);
                }
            }
            // End the combination if it's long enough
            if (path.length >= this.settings.minMatchCount) {
                const symbol = this.getSymbol(symbolId);
                // Fix the payout index based on path length (5 -> 0, 4 -> 1, 3 -> 2)
                const multiplierIndex = path.length - this.settings.minMatchCount;
                const multiplier = symbol.multiplier[multiplierIndex][0];
                winningCombinations.push({ symbolId, positions: path, payout: multiplier * this.settings.BetPerLines });
            }
        };
        // Iterate over each symbol in the first column
        this.settings.Symbols.forEach(symbol => {
            if (symbol.Name !== "Wild") {
                for (let row = 0; row < this.settings.matrix.y; row++) {
                    const startSymbolId = result[row][0]; // Start in the leftmost column (0)
                    if (startSymbolId === symbol.Id || this.isWild(startSymbolId)) {
                        findCombinations(symbol.Id, 1, [[row, 0]]);
                    }
                }
            }
        });
        // Filter out shorter combinations that are subsets of longer ones
        winningCombinations = winningCombinations.filter((combo, index, self) => !self.some((otherCombo, otherIndex) => index !== otherIndex &&
            combo.symbolId === otherCombo.symbolId &&
            combo.positions.length < otherCombo.positions.length &&
            combo.positions.every((pos, i) => pos[0] === otherCombo.positions[i][0] && pos[1] === otherCombo.positions[i][1])));
        winningCombinations.forEach(combo => {
            // alter payout . multiply betsperline with payout
            combo.payout = combo.payout * this.settings.BetPerLines;
        });
        // Calculate total payout
        totalPayout = winningCombinations.reduce((sum, combo) => sum + combo.payout, 0);
        return { payout: totalPayout, winningCombinations };
    }
}
exports.SLLOL = SLLOL;
