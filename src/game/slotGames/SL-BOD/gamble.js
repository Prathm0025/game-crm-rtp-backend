"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGambleResult = getGambleResult;
/*
 * function for gamble feature for SL-BOD
 * on a win player can choose to gamble ie double(or even 4 times) or nothing
 * on loss player will lose current win
 * player can choose to gamble on suits (4times) or colors (2times)
 * */
// export function sendInitGambleData() {
//   // console.log("gamble init");
//   let gambleData: {
//     blCard: Card,
//     rdCard: Card
//   } = {
//     blCard: {
//       suit: 'Spades',
//       value: 'A'
//     },
//     rdCard: {
//       suit: 'Hearts',
//       value: 'A'
//     }
//   }
//   return gambleData
// }
function getGambleResult(response) {
    if (["BLACK", "RED", "Hearts", "Spades", "Clubs", "Diamonds"].includes(response.selected)) {
        const randomSuit = getRandomSuit();
        const playerWon = response.selected === "BLACK" || response.selected === "RED"
            ? colorMap[randomSuit] === response.selected
            : randomSuit === response.selected;
        return {
            playerWon,
            currentWinning: 0,
            card: randomSuit,
            balance: 0,
        };
    }
    else {
        throw new Error("Invalid card type");
    }
}
function getRandomSuit() {
    const suits = ["Hearts", "Spades", "Clubs", "Diamonds"];
    return suits[Math.floor(Math.random() * suits.length)];
}
const colorMap = {
    Hearts: "RED",
    Diamonds: "RED",
    Spades: "BLACK",
    Clubs: "BLACK",
};
