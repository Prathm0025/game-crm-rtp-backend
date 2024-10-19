import { Card } from "../BaseSlotGame/newGambleGame";
export interface gambleResponse {
  playerWon: boolean,
  currentWinning: number,
  Balance: number
}

/*
 * function for gamble feature for SL-LOL
 * on a win player can choose to gamble ie double or nothing 
 * on loss player will lose current win 
 *
 *
 * */
export function sendInitGambleData() {
  console.log("gamble init");
  let gambleData: {
    blCard: Card,
    rdCard: Card
  } = {
    blCard: {
      suit: 'Spades',
      value: 'A'
    },
    rdCard: {
      suit: 'Hearts',
      value: 'A'
    }
  }
  return gambleData
}

export function getGambleResult(response: {
  selected: "BLACK" | "RED"
})
  : gambleResponse {
  console.log("gamble result", response);
  const result = getRandomCard()


  switch (response.selected === result) {
    case true:
      return {
        playerWon: true,
        currentWinning: 0,
        Balance: 0
      }
    case false:
      return {
        playerWon: false,
        currentWinning: 0,
        Balance: 0
      }
  }
}
// function to get random card
export function getRandomCard() {
  //FIX: later
  return Math.random() >= 0.5 ? "RED" : "RED"
}
