"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomFlip = exports.getGambleResult = exports.sendInitGambleData = void 0;
/*
 * function for gamble feature for SL-LOL
 * on a win player can choose to gamble ie double or nothing
 * on loss player will lose current win
 *
 *
 * */
function sendInitGambleData() {
    console.log("gamble init");
}
exports.sendInitGambleData = sendInitGambleData;
function getGambleResult(response) {
    console.log("gamble result", response);
    const result = getRandomFlip();
    switch (response.selected === result) {
        case true:
            return {
                playerWon: true,
                currentWinning: 0,
                coin: result
            };
        case false:
            return {
                playerWon: false,
                currentWinning: 0,
                coin: result
            };
    }
}
exports.getGambleResult = getGambleResult;
// function to get random card
function getRandomFlip() {
    //FIX: later
    return Math.random() >= 0.5 ? "HEAD" : "TAIL";
}
exports.getRandomFlip = getRandomFlip;
