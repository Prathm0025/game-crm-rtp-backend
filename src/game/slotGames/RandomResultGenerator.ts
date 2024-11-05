
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
    // matrix.push(['10', '6', '10', '0', '4',])
    // matrix.push(['1', '1', '14', '10', '1',])
    // matrix.push(['5', '8', '1', '5', '1',])
    matrix.forEach(row => console.log(row.join(' ')));
    current.settings.resultReelIndex = matrix;
    current.settings.resultSymbolMatrix = matrix;

  }
  getRandomIndex(maxValue: number): number {
    return Math.floor(Math.random() * (maxValue + 1));
  }

}

