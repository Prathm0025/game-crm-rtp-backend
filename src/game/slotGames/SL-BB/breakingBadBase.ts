import { currentGamedata } from "../../../Player";
import { SLBBSETTINGS } from "./types";
import { initializeGameSettings, generateInitialReel, checkForWin, sendInitData, generateInitialHeisenberg, handleCashCollectandLink, handleAutoSpinStart, handleAutoSpinEnd } from "./helper";
import { RandomResultGenerator } from "../RandomResultGenerator";

export class SLBB {
  public settings: SLBBSETTINGS;
  playerData = {
    haveWon: 0,
    currentWining: 0,
    totalbet: 0,
    rtpSpinCount: 0,
  };

  constructor(public currentGameData: currentGamedata) {
    this.settings = initializeGameSettings(currentGameData, this);
    generateInitialReel(this.settings)
    generateInitialHeisenberg(this.settings)
    sendInitData(this)
  }

  get initSymbols() {
    const Symbols = [];
    this.currentGameData.gameSettings.Symbols.forEach((Element: Symbol) => {
      Symbols.push(Element);
    });
    return Symbols;
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
        this.getRTP(response.data.spins || 1);
        break;

      case "AUTOSPIN_START":
        handleAutoSpinStart(this.settings.magnet)
        break;
      case "AUTOSPIN_END":
        handleAutoSpinEnd(this.settings.magnet)
        break;
    }

  }
  private prepareSpin(data: any) {
    this.settings.currentLines = data.currentLines;
    this.settings.BetPerLines = this.settings.currentGamedata.bets[data.currentBet];
    this.settings.currentBet = this.settings.BetPerLines * this.settings.currentLines;
  }


  public async spinResult(): Promise<void> {
    try {
      const playerData = this.getPlayerData();
      if (!this.settings) {
        await this.deductPlayerBalance(this.settings.currentBet);
        this.playerData.totalbet += this.settings.currentBet;
      }
      if (this.settings.currentBet > playerData.credits) {
        this.sendError("Low Balance");
        return;
      }
      await new RandomResultGenerator(this);
      checkForWin(this)
    } catch (error) {
      this.sendError("Spin error");
      console.error("Failed to generate spin results:", error);
    }
  }
  public handleHeisenbergSpin() {

    const coinSymbolId = this.settings.coins.SymbolID;
    this.settings.prevresultSymbolMatrix = this.settings.resultSymbolMatrix;
    let coinCount = 0;
    this.settings.heisenbergSymbolMatrix.forEach(row => {
      coinCount += row.filter(symbol => symbol === coinSymbolId).length;
    });

    if (!this.settings.heisenberg.isTriggered) {
      this.settings.heisenberg.isTriggered = true;
      this.settings.heisenberg.freeSpin.freeSpinStarted = true;
      this.settings.heisenberg.freeSpin.noOfFreeSpins = 3;
    }

    if (this.settings.heisenberg.freeSpin.noOfFreeSpins > 0) {
      this.settings.freeSpin.noOfFreeSpins--;

      if (coinCount > 0) {
        this.settings.heisenberg.freeSpin.noOfFreeSpins = 3;
        console.log("Coin found! Reset free spins to 3.");
      }

      if (coinCount >= 15) {
        this.settings.heisenberg.payout = 1000;
        console.log("Grand Prize Awarded!");
        this.settings.freeSpin.freeSpinStarted = false;
      }
    } else {
      this.settings.heisenberg.freeSpin.freeSpinStarted = false;
      console.log("Free spins have ended.");
    }

    if (!this.settings.heisenberg.freeSpin.freeSpinStarted) {
      handleCashCollectandLink(this);
    }

    console.log(this.settings.resultSymbolMatrix, "result matrix after Cash Collect and Link");
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
                // console.log(`Spin ${i + 1} completed. ${this.playerData.totalbet} , ${won}`);
            }
            let rtp = 0;
            if (spend > 0) {
                rtp = won / spend;
            }
            // console.log('RTP calculated:', rtp * 100);
            return;
        } catch (error) {
            console.error("Failed to calculate RTP:", error);
            this.sendError("RTP calculation error");
        }
    }
     





}
