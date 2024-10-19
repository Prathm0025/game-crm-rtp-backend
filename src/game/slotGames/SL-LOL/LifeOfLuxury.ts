import { currentGamedata } from "../../../Player";
import { generateInitialReel, initializeGameSettings, sendInitData, makeResultJson, printWinningCombinations, checkWin, checkForFreespin, simulateFreespin } from "./helper";
import { SLLOLSETTINGS } from "./types";
import { RandomResultGenerator } from "../RandomResultGenerator";
import { GAMBLETYPE } from "../BaseSlotGame/newGambleGame";
import { getGambleResult, sendInitGambleData } from "./gamble";

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
      console.log("credits : ", this.getPlayerData().credits);
      
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
        // this.getRTP(response.data.spins || 1);
        this.spinResult();
        break;

      case "GENRTP":
        this.settings.currentLines = response.data.currentLines;
        this.settings.BetPerLines = this.settings.currentGamedata.bets[response.data.currentBet];
        this.settings.currentBet =
          this.settings.currentGamedata.bets[response.data.currentBet] * this.settings.currentLines;
        this.getRTP(response.data.spins);
        break;

      case "GambleInit":
        const sendData = sendInitGambleData();
        this.sendMessage("gambleInitData", sendData);
        break;

      case "GambleResultData":
        let result = getGambleResult({ selected: response.data.selected });
        //calculate payout
        switch (result.playerWon) {
          case true:
            result.currentWinning = this.settings._winData.totalWinningAmount * 2;
            this.settings._winData.totalWinningAmount = result.currentWinning;
            result.Balance = this.getPlayerData().credits + result.currentWinning;
            break;
          case false:
            result.currentWinning = 0;
            result.Balance = this.getPlayerData().credits;
            this.settings._winData.totalWinningAmount = 0;
            this.playerData.currentWining = 0;
            break;
        }

        this.sendMessage("GambleResult", result)
        break;
      case "GAMBLECOLLECT":
        this.playerData.currentWining = this.settings._winData.totalWinningAmount;
        this.updatePlayerBalance(this.playerData.currentWining);
        break;
      default:
        console.warn(`Unhandled message ID: ${response.id}`);
        this.sendError(`Unhandled message ID: ${response.id}`);
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


  private async checkResult() {
    try {
      // console.log("Result Matrix:", resultMatrix);

      const { payout, winningCombinations } = checkWin(this);
      // console.log("winning comb:", winningCombinations);
      printWinningCombinations(winningCombinations)
      //check for freespin
      console.log("freespin:", checkForFreespin(this));

      if (checkForFreespin(this)) {
        const response = simulateFreespin(this);
        console.log("freespin response:", response);
      }


      console.log(this.getPlayerData().credits)
        

      if (payout > 0) {
        this.playerData.currentWining = payout;
        this.playerData.haveWon += payout;
        this.updatePlayerBalance(this.playerData.currentWining);
      }else{
        this.playerData.currentWining = 0;
      }
      console.log("Payout checkwin: ", payout);
      
      this.gamebleTesting()

      makeResultJson(this);
      console.log("playerData :", this.playerData);
      console.log("windata :", this.settings._winData.totalWinningAmount);
    } catch (error) {
      console.error("Error in checkResult:", error);
    }
  }
  private gamebleTesting() {
    console.log("gamble test");

    //FIX: gamebleTesting , remove later
    if (this.settings.gamble.isEnabled) {

      let result = getGambleResult({ selected: "RED" });
      //calculate payout
      switch (result.playerWon) {
        case true:
          result.currentWinning = this.playerData.currentWining * 2;
          this.playerData.currentWining = result.currentWinning;
          result.Balance = this.getPlayerData().credits + result.currentWinning;
          break;
        case false:
          result.currentWinning = 0;
          this.deductPlayerBalance(this.playerData.currentWining);
          result.Balance = this.getPlayerData().credits;
          this.settings._winData.totalWinningAmount = 0;
          this.playerData.haveWon -= this.playerData.currentWining;
          this.playerData.currentWining = 0;
          break;
      }

      console.log("Gamble Result:", result);

      this.playerData.currentWining = this.settings._winData.totalWinningAmount;
      this.playerData.haveWon += this.playerData.currentWining;
      this.updatePlayerBalance(this.playerData.currentWining);
      console.log("Balance:", this.getPlayerData().credits);
      

    }
  }
}


