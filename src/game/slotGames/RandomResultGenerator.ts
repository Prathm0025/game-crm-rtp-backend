
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


        matrix.pop();
        matrix.pop();
        matrix.pop();
        matrix.push(['8', '8', '8', '6', '3', '3'])
        matrix.push(['3', '2', '2', '2', '2', '2'])
        matrix.push(['1', '3', '7', '4', '2', '3'])
        matrix.forEach(row => console.log(row.join(' ')));
        current.settings.resultReelIndex = matrix;
        current.settings.resultSymbolMatrix = matrix;

    }
    getRandomIndex(maxValue: number): number {
        return Math.floor(Math.random() * (maxValue + 1));
    }

}

