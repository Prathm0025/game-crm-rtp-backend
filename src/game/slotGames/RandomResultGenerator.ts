import { generateRandomNumber, generatetrueRandomNumber } from "../Utils/gameUtils";

export class RandomResultGenerator {
  constructor(current) {
    let matrix: string[][] = [];
    for (let x = 0; x < current.settings.currentGamedata.matrix.x; x++) {
      const startPosition = this.getRandomIndex((current.settings.reels[x].length - 1));
      for (let y = 0; y < current.settings.currentGamedata.matrix.y; y++) {
        if (!matrix[y]) matrix[y] = [];
        matrix[y][x] = current.settings.reels[x][(startPosition + y) % current.settings.reels[x].length];
      }
    }

    // matrix.pop();
    // matrix.pop();
    // matrix.pop();
    // matrix.push(["7", "0", "8", "1", "4"])
    // matrix.push(["2", "1", "1", "5", "6"])
    // matrix.push(["1", "2", "3", "9", "2"])
    matrix.forEach(row => console.log(row.join(' ')));
    current.settings.resultReelIndex = matrix;
    current.settings.resultSymbolMatrix = matrix;

  }
  getRandomIndex(maxValue: number): number {
    let seed = Date.now() + Math.random() * 1000;


    // return Math.floor(generateRandomNumber(seed, (maxValue + 1)));
    return Math.floor(generatetrueRandomNumber(maxValue + 1));

  }

}

