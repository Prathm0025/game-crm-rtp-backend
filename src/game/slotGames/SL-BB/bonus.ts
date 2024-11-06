import { SLBB } from "./breakingBadBase";


export class RandomBonusGenerator {
  constructor(current) {
    let matrix: string[][] = [];
    for (let x = 0; x < current.settings.currentGamedata.matrix.x; x++) {
      const startPosition = this.getRandomIndex((current.settings.reels[x].length - 1));
      for (let y = 0; y < current.settings.currentGamedata.matrix.y; y++) {
        if (!matrix[y]) matrix[y] = [];
        matrix[y][x] = current.settings.bonusReels[x][(startPosition + y) % current.settings.reels[x].length];
      }
    }


    // matrix.pop();
    // matrix.pop();
    // matrix.pop();
    // matrix.push(['10', '6', '10', '0', '4','6'])
    // matrix.push(['1', '11', '14', '10', '1','6'])
    // matrix.push(['5', '8', '1', '5', '1','6'])
    matrix.forEach(row => console.log(row.join(' ')));
    // current.settings.resultReelIndex = matrix;
    current.settings.bonusResultMatrix = matrix;

  }
  getRandomIndex(maxValue: number): number {
    return Math.floor(Math.random() * (maxValue + 1));
  }

}

export function checkForBonus(gameInstance: SLBB,hasCC:boolean,hasL:boolean,hasML:boolean) :boolean{
  const { settings } = gameInstance

  if (hasCC && ( hasL || hasML)) {
    settings.bonus.isTriggered = true
    settings.bonus.isBonus = true
    settings.bonus.count = 3
    return true
  }
  return false
}
