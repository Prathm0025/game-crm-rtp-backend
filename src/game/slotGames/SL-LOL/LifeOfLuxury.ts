import { currentGamedata } from "../../../Player";
import { generateInitialReel, initializeGameSettings, printMatrix, sendInitData, makeResultJson, printWinningCombinations } from "./helper";
import { FreeSpinResponse, GameResult, SLLOLSETTINGS, SymbolType, WinningCombination } from "./types";
import { RandomResultGenerator } from "../RandomResultGenerator";

export class SLLOL {
  public settings: SLLOLSETTINGS;
  playerData = {
    haveWon: 0,
    currentWining: 0,
    totalbet: 0,
    rtpSpinCount: 0,
    totalSpin: 0,
    currentPayout: 0
  }

  constructor(public currentGameData: currentGamedata) {
    console.log("Initializing SLLOL game");
    // console.log("currentGameData:", JSON.stringify(currentGameData, null, 2));

    try {
      this.settings = initializeGameSettings(currentGameData, this);
      console.log("Game settings initialized")

      this.settings.reels = generateInitialReel(this.settings);
      // console.log("Initial reels generated:", this.settings.reels);

      sendInitData(this);
    } catch (error) {
      console.error("Error initializing SLLOL game:", error);
    }
  }

  get initSymbols() {
    console.log("Getting initial symbols");
    const Symbols = this.currentGameData.gameSettings.Symbols || [];
    // console.log("Initial symbols:", Symbols);
    return Symbols;
  }

  private getSymbol(id: number): SymbolType | undefined {
    return this.settings.Symbols.find(s => s.Id === id);
  }

  private isWild(symbolId: number): boolean {
    // const symbol = this.getSymbol(symbolId);
    // return symbol ? symbol.Name === "Wild" : false;
    return symbolId === 11
  }

  sendMessage(action: string, message: any) {
    this.currentGameData.sendMessage(action, message);
  }

  sendError(message: string) {
    this.currentGameData.sendError(message);
  }

  sendAlert(message: string) {
    this.currentGameData.sendAlert(message);
  }

  updatePlayerBalance(amount: number) {
    this.currentGameData.updatePlayerBalance(amount);
  }

  deductPlayerBalance(amount: number) {
    this.currentGameData.deductPlayerBalance(amount);
  }

  getPlayerData() {
    return this.currentGameData.getPlayerData();
  }

  messageHandler(response: any) {
    switch (response.id) {
      case "SPIN":
        this.prepareSpin(response.data);
        // this.spinResult();
        this.getRTP(response.data.spins || 1);
        break;
    }
  }

  private prepareSpin(data: any) {
    this.settings.currentLines = data.currentLines;
    this.settings.BetPerLines = this.settings.currentGamedata.bets[data.currentBet];
    this.settings.currentBet = this.settings.BetPerLines * this.settings.currentLines;
  }

  private async spinResult(): Promise<void> {
    try {
      const playerData = this.getPlayerData();
      if (this.settings.currentBet > playerData.credits) {
        this.sendError("Low Balance");
        return;
      }

      await this.deductPlayerBalance(this.settings.currentBet);
      this.playerData.totalbet += this.settings.currentBet;

      new RandomResultGenerator(this);
      this.checkResult();
    } catch (error) {
      this.sendError("Spin error");
      console.error("Failed to generate spin results:", error);
    }
  }

  private async getRTP(spins: number): Promise<void> {
    try {
      let spend: number = 0;
      let won: number = 0;
      this.playerData.rtpSpinCount = spins;
      for (let i = 0; i < this.playerData.rtpSpinCount; i++) {
        await this.spinResult();
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
    } catch (error) {
      console.error("Failed to calculate RTP:", error);
      this.sendError("RTP calculation error");
    }
  }

  private checkForFreespin(): boolean {
    try {
      const resultMatrix = this.settings.resultSymbolMatrix;
      const rows = resultMatrix.length;

      // Check if 1st, 2nd, and 3rd columns have symbol with ID 12 regardless of row
      let col1Has12 = false;
      let col2Has12 = false;
      let col3Has12 = false;

      for (let j = 0; j < rows; j++) { // Loop through rows
        if (resultMatrix[j][0] === 12) col1Has12 = true; // Check 1st column
        if (resultMatrix[j][1] === 12) col2Has12 = true; // Check 2nd column
        if (resultMatrix[j][2] === 12) col3Has12 = true; // Check 3rd column

        // If all three columns have the symbol, return true
        if (col1Has12 && col2Has12 && col3Has12) {
          return true;
        }
      }

      // If one of the columns doesn't have the symbol, return false
      return false;

    } catch (e) {
      console.error("Error in checkForFreespin:", e);
      return false; // Handle error by returning false in case of failure
    }
  }
 private simulateFreespin(): FreeSpinResponse {
    this.settings.isFreeSpin = true;
    this.settings.freeSpinCount = 10;
    let response: FreeSpinResponse = {
      freeSpinCount: [],
      freeSpinMultipliers: [],
      combinations: [],
      results: [],
      isRetriggered: [],
      payouts: []
    };

    // Initialize freeSpinMultipliers for major symbols
    const majorSymbolIds = this.settings.Symbols
      .filter(symbol => symbol.freeSpinMultiplier)
      .map(symbol => symbol.Id);
    let currentMultipliers = Object.fromEntries(majorSymbolIds.map(id => [id, 1]));

    while (this.settings.freeSpinCount > 0) {
      new RandomResultGenerator(this);
      this.settings.freeSpinCount -= 1;
      const resultMatrix = this.settings.resultSymbolMatrix;
      const { winningCombinations } = this.checkWin(resultMatrix);

      let totalPayout = 0;
      winningCombinations.forEach((combination) => {
        const symbol = this.getSymbol(combination.symbolId);
        if (symbol.freeSpinMultiplier) {
          combination.payout = combination.payout * this.settings.BetPerLines * currentMultipliers[combination.symbolId];
        } else {
          combination.payout = combination.payout * this.settings.BetPerLines;
        }
        totalPayout += combination.payout;
      });

      response.results.push(resultMatrix);
      response.payouts.push(totalPayout);
      response.combinations.push(winningCombinations);

      //TODO: uncomment
      if (this.checkForFreespin()) {
        response.isRetriggered.push(true);
        this.settings.freeSpinCount += 3;
      } else {
        response.isRetriggered.push(false);
      //TODO: uncomment
      }
      response.freeSpinCount.push(this.settings.freeSpinCount);

      // Update multipliers based on symbol occurrences, capped at MAX_MULTIPLIER
      resultMatrix.flat().forEach((symbolId) => {
        if (currentMultipliers.hasOwnProperty(symbolId)) {
          currentMultipliers[symbolId] = Math.min(currentMultipliers[symbolId] + 1, this.settings.maxMultiplier);
        }
      });

      response.freeSpinMultipliers.push([...Object.values(currentMultipliers)]);
    }

    return response;
  }
  // private simulateFreespin(): FreeSpinResponse {
  //
  //   this.settings.isFreeSpin = true;
  //   this.settings.freeSpinCount = 10;
  //   let response: FreeSpinResponse = {
  //     freeSpinCount: [],
  //     freeSpinMultipliers: [],
  //     combinations: [],
  //     results: [],
  //     isRetriggered: [],
  //     payouts: []
  //   }
  //
  //   while (this.settings.freeSpinCount > 0) {
  //     new RandomResultGenerator(this);
  //     this.settings.freeSpinCount -= 1
  //     const resultMatrix = this.settings.resultSymbolMatrix;
  //     const { winningCombinations } = this.checkWin(resultMatrix);
  //
  //
  //     //freespin multipliers 
  //     let totalPayout = 0;
  //     winningCombinations.forEach((combination) => {
  //       const symbol = this.getSymbol(combination.symbolId);
  //       if (symbol.freeSpinMultiplier) {
  //         combination.payout = combination.payout * this.settings.BetPerLines * this.settings.freeSpinMultipliers[combination.symbolId]
  //       } else {
  //         combination.payout = combination.payout * this.settings.BetPerLines
  //       }
  //       totalPayout += combination.payout
  //     });
  //     response.results.push(resultMatrix);
  //     response.payouts.push(totalPayout)
  //     response.combinations.push(winningCombinations);
  //
  //     //FIX: uncomment
  //     // if (this.checkForFreespin()) {
  //     //   response.isRetriggered.push(true);
  //     //   this.settings.freeSpinCount += 10
  //     // } else {
  //     response.isRetriggered.push(false);
  //     //FIX: uncomment
  //     // }
  //     response.freeSpinCount.push(this.settings.freeSpinCount);
  //     //TODO: check for 5 major symbols in resultMatrix
  //
  //     resultMatrix.forEach((row, rowIndex) => {
  //       row.forEach((col, colIndex) => {
  //         const symbolId = resultMatrix[rowIndex][colIndex];
  //         const symbol = this.getSymbol(symbolId)
  //         if (symbol.freeSpinMultiplier) {
  //           this.settings.freeSpinMultipliers[symbolId] += 1
  //         }
  //       })
  //     })
  //     response.freeSpinMultipliers.push(this.settings.freeSpinMultipliers)
  //
  //   }
  //
  //
  //   return response
  // }

  private async checkResult() {
    try {
      const resultMatrix = this.settings.resultSymbolMatrix;
      // console.log("Result Matrix:", resultMatrix);

      const { payout, winningCombinations } = this.checkWin(resultMatrix);
      // console.log("winning comb:", winningCombinations);
      printWinningCombinations(winningCombinations)
      //check for freespin
      console.log("freespin:", this.checkForFreespin());

      if (this.checkForFreespin()) {
        const response = this.simulateFreespin();
        console.log("freespin response:", response);
      }

      this.playerData.currentWining = payout;
      this.playerData.haveWon += payout;

      if (payout > 0) {
        this.updatePlayerBalance(this.playerData.currentWining);
      }

      makeResultJson(this);

      console.log("Total Payout:", payout);
      // console.log("Winning Combinations:", winningCombinations);
    } catch (error) {
      console.error("Error in checkResult:", error);
    }
  }

  private checkWin(result: GameResult): { payout: number; winningCombinations: WinningCombination[] } {
    let totalPayout = 0;
    let winningCombinations: WinningCombination[] = [];

    const findCombinations = (symbolId: number, col: number, path: [number, number][]): void => {
      // Stop if we've checked all columns or path is complete
      if (col === this.settings.matrix.x) {
        if (path.length >= this.settings.minMatchCount) {
          const symbol = this.getSymbol(symbolId);
          const multiplierIndex = path.length - this.settings.minMatchCount;
          if (symbol && symbol.multiplier[multiplierIndex]) { // Check if multiplier exists
            const multiplier = symbol.multiplier[multiplierIndex][0];
            winningCombinations.push({ symbolId, positions: path, payout: multiplier * this.settings.BetPerLines });
          }
        }
        return;
      }

      for (let row = 0; row < result.length; row++) {
        const currentSymbolId = result[row][col];
        if (currentSymbolId === symbolId || this.isWild(currentSymbolId)) {
          findCombinations(symbolId, col + 1, [...path, [row, col]]);
        }
      }

      // End the combination if it's long enough
      if (path.length >= this.settings.minMatchCount) {
        const symbol = this.getSymbol(symbolId)!;
        const multiplierIndex = path.length - this.settings.minMatchCount;
        if (symbol && symbol.multiplier[multiplierIndex]) { // Check if multiplier exists
          const multiplier = symbol.multiplier[multiplierIndex][0];
          winningCombinations.push({ symbolId, positions: path, payout: multiplier * this.settings.BetPerLines });
        }
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
    winningCombinations = winningCombinations.filter((combo, index, self) =>
      !self.some((otherCombo, otherIndex) =>
        index !== otherIndex &&
        combo.symbolId === otherCombo.symbolId &&
        combo.positions.length < otherCombo.positions.length &&
        combo.positions.every((pos, i) => pos[0] === otherCombo.positions[i][0] && pos[1] === otherCombo.positions[i][1])
      )
    );

    winningCombinations.forEach(combo => {
      // alter payout . multiply betsperline with payout
      combo.payout = combo.payout * this.settings.BetPerLines
    })
    // Calculate total payout
    totalPayout = winningCombinations.reduce((sum, combo) => sum + combo.payout, 0);

    return { payout: totalPayout, winningCombinations };
  }

}

