"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInitGambleData = sendInitGambleData;
exports.getGambleResult = getGambleResult;
exports.getRandomCard = getRandomCard;
/*
 * function for gamble feature for SL-LOL
 * on a win player can choose to gamble ie double or nothing
 * on loss player will lose current win
 *
 *
 * */
const CARD_ARRAY = ["HEARTS", "DIAMONDS", "CLUBS", "SPADES"];
function sendInitGambleData() {
    // console.log("gamble init");
    let gambleData = {
        blCard: {
            suit: 'Spades',
            value: 'A'
        },
        rdCard: {
            suit: 'Hearts',
            value: 'A'
        }
    };
    return gambleData;
}
function getGambleResult(response) {
    // console.log("gamble result", response);
    const result = getRandomCard();
    switch (response.selected === result) {
        case true:
            return {
                playerWon: true,
                currentWinning: 0,
                cardId: result === "RED" ? (Math.random() >= 0.5 ? 0 : 1) : (Math.random() >= 0.5 ? 2 : 3),
                balance: 0
            };
        case false:
            return {
                playerWon: false,
                currentWinning: 0,
                cardId: result === "RED" ? (Math.random() >= 0.5 ? 0 : 1) : (Math.random() >= 0.5 ? 2 : 3),
                balance: 0,
            };
    }
}
// function to get random card
function getRandomCard() {
    //FIX: later
    return Math.random() >= 0.5 ? "RED" : "BLACK";
}
