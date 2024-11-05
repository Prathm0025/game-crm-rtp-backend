import { currentGamedata } from "../../../Player";
import { SLBBSETTINGS } from "./types";
import { initializeGameSettings, generateInitialReel, checkForWin, sendInitData, generateInitialHeisenberg, makePayLines, } from "./helper";
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
    makePayLines(this)
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

  incrementPlayerBalance(amount: number) {
    this.currentGameData.updatePlayerBalance(amount);
  }

  decrementPlayerBalance(amount: number) {
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

      default:
        this.sendMessage(response.id, "invalid request");
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
      const { freeSpin, bonus } = this.settings
      if (!freeSpin.isFreeSpin && this.settings.currentBet > playerData.credits) {
        this.sendError("Low Balance");
        return;
      }

      if (!freeSpin.isFreeSpin) {
        this.decrementPlayerBalance(this.settings.currentBet);
        this.playerData.totalbet += this.settings.currentBet;
      }
      if (!bonus.isTriggered) {
        this.decrementPlayerBalance(this.settings.currentBet);
      }
      // if (heisenberg.freeSpin.freeSpinCount === 1) {
      //   heisenberg.isTriggered= false;
      // }
      if (freeSpin.count === 1) {
        freeSpin.isFreeSpin = false;
      }
      if (
        // freeSpin.isFreeSpin &&
        freeSpin.count > 0 &&
        !this.settings.bonus.isTriggered
      ) {
        freeSpin.count--;

        this.settings.currentBet = 0;
        console.log(
          freeSpin.count,
          "this.settings.freeSpinCount"
        );
      }
      // this.incrementPlayerBalance(this.playerData.currentWining)
      if(!this.settings.bonus.isTriggered){
      new RandomResultGenerator(this);
      }
      checkForWin(this)
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
