
import { Socket } from "socket.io";
import mongoose from "mongoose";
import { Player } from "./dashboard/users/userModel";
import { Platform } from "./dashboard/games/gameModel";
import payoutController from "./dashboard/payouts/payoutController";
import { getPlayerCredits, messageType } from "./game/Utils/gameUtils";
import { gameData } from "./game/testData";
import { currentActivePlayers } from "./socket";
import GameManager from "./game/GameManager";
import createHttpError from "http-errors";
import { GameSession } from "./dashboard/session/gameSession";
import { eventType, getManagerName, socketConnectionData } from "./utils/utils";
import { eventEmitter } from "./utils/eventEmitter";
import { sessionManager } from "./dashboard/session/sessionManager";


export interface currentGamedata {
  gameId: string | null;
  username: string,
  gameSettings: any;
  currentGameManager: GameManager;
  session: GameSession | null;
  sendMessage: (action: string, message: any, isGameSocket: boolean) => void;
  sendError: (message: string, isGameSocket: boolean) => void;
  sendAlert: (message: string, isGameSocket: boolean) => void;
  updatePlayerBalance: (message: number) => void;
  deductPlayerBalance: (message: number) => void;
  getPlayerData: () => playerData;
}



export interface playerData {
  username: string;
  role: string;
  credits: number;
  userAgent: string;
  status: string,
}


export default class PlayerSocket {
  platformData: socketConnectionData;
  gameData: socketConnectionData;
  currentGameData: currentGamedata;
  playerData: playerData;
  public managerName: string | null;


  constructor(
    username: string,
    role: string,
    status: string,
    credits: number,
    userAgent: string,
    socket: Socket,
  ) {

    if (currentActivePlayers.has(username)) {
      const existingPlayerSocket = currentActivePlayers.get(username);

      if (existingPlayerSocket.platformData.socket.id !== socket.id) {
        console.log(`User ${username} reconnected with a new socket ID.`);
        existingPlayerSocket.initializePlatformSocket(socket)
        return;
      }
    }
    this.platformData = {
      socket: socket,
      heartbeatInterval: setInterval(() => { }, 0),
      reconnectionAttempts: 0,
      maxReconnectionAttempts: 3,
      reconnectionTimeout: 1000,
      cleanedUp: false
    }

    this.gameData = {
      socket: null,
      heartbeatInterval: setInterval(() => { }, 0),
      reconnectionAttempts: 0,
      maxReconnectionAttempts: 3,
      reconnectionTimeout: 1000,
      cleanedUp: false,
    };

    this.playerData = {
      username,
      role,
      credits,
      userAgent,
      status
    };

    this.currentGameData = {
      gameId: null,
      username: this.playerData.username,
      gameSettings: null,
      currentGameManager: null,
      session: null,
      sendMessage: this.sendMessage.bind(this),
      sendError: this.sendError.bind(this),
      sendAlert: this.sendAlert.bind(this),
      updatePlayerBalance: this.updatePlayerBalance.bind(this),
      deductPlayerBalance: this.deductPlayerBalance.bind(this),
      getPlayerData: () => this.playerData,
    };

    this.initializePlatformSocket(socket);

    // Add to the users map if it's a new user
    if (!currentActivePlayers.has(username)) {
      currentActivePlayers.set(username, this);
    }
  }


  public async initializePlatformSocket(socket: Socket) {
    if (socket) {
      this.platformData.socket = socket;
      this.messageHandler(false);
      this.startPlatformHeartbeat()

      this.managerName = await this.getManager(this.playerData.username);
      if (!this.managerName) {
        throw new Error(`Manager name not found for player ${this.playerData.username}`);
      }

      await sessionManager.startPlatformSession(this.playerData.username, this.playerData.status, this.managerName, this.playerData.credits);

      this.platformData.socket.on("disconnect", () => {
        this.handlePlatformDisconnection();
      });

      this.sendData({ type: "CREDIT", data: { credits: this.playerData.credits } }, "platform")

    }
  }

  private initializeGameSocket(socket: Socket) {

    if (this.gameData.socket) {
      this.cleanupGameSocket();
    }

    this.gameData.socket = socket;
    this.currentGameData.gameId = socket.handshake.auth.gameId;
    sessionManager.startGameSession(this.playerData.username, this.currentGameData.gameId, this.playerData.credits)

    this.gameData.socket.on("disconnect", () => this.handleGameDisconnection());
    this.initGameData();
    this.startGameHeartbeat();
    this.onExit();
    this.messageHandler(true);
    this.gameData.socket.emit("socketState", true);

    const playerEnterGameEvent = {
      type: eventType.ENTERED_GAME,
      data: {
        username: this.playerData.username,
        gameId: this.currentGameData.gameId,
        credits: this.playerData.credits,
        userAgent: this.playerData.userAgent,
      }
    }

    eventEmitter.emit("game", playerEnterGameEvent);
  }

  // Handle platform disconnection and reconnection
  private handlePlatformDisconnection() {
    this.attemptReconnection(this.platformData)
  }

  // Handle game disconnection and reconnection
  private handleGameDisconnection() {
    this.attemptReconnection(this.gameData);
  }

  // Cleanup only the game socket
  private async cleanupGameSocket() {
    await sessionManager.endGameSession(this.playerData.username, this.playerData.credits);

    if (this.gameData.socket) {
      this.gameData.socket.disconnect(true);
      this.gameData.socket = null;
    }
    clearInterval(this.gameData.heartbeatInterval);

    this.currentGameData.currentGameManager = null;
    this.currentGameData.gameSettings = null;
    this.currentGameData.gameId = null;
    this.gameData.reconnectionAttempts = 0;
  }

  // Cleanup only the platform socket
  public async cleanupPlatformSocket() {
    await sessionManager.endPlatformSession(this.playerData.username);


    if (this.platformData.socket) {
      this.platformData.socket.disconnect(true);
      this.platformData.socket = null;
    }

    clearInterval(this.platformData.heartbeatInterval);
    this.platformData.reconnectionAttempts = 0;
    this.platformData.cleanedUp = true;


    // Only remove the user from the map if the socket is still the same
    // This ensures that if the user has already reconnected with a new socket, they are not removed.
    const currentPlayerSocket = currentActivePlayers.get(this.playerData.username);
    if (currentPlayerSocket && currentPlayerSocket.platformData.socket === null) {
      currentActivePlayers.delete(this.playerData.username);
    }
  }

  // Attempt reconnection  for platform or game socket based on provided data
  private async attemptReconnection(socketData: socketConnectionData) {
    try {
      while (socketData.reconnectionAttempts < socketData.maxReconnectionAttempts) {
        console.log(`Reconnecting: ${socketData.reconnectionAttempts}...`);


        // If the user has already reconnected with a new socket, stop reconnection attempts
        if (socketData.socket && socketData.socket.connected) {
          console.log("Reconnection successful");
          socketData.reconnectionAttempts = 0;  // Reset reconnection attempts
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, socketData.reconnectionTimeout));
        socketData.reconnectionAttempts++;

        if (socketData.cleanedUp) return;
      }

      if (socketData === this.platformData) {
        await this.cleanupPlatformSocket();
      } else {
        await this.cleanupGameSocket();
      }
    } catch (error) {
      console.error("Reconnection attempt failed:", error);
    }
  }


  // Start heartbeat for platform socket
  private startPlatformHeartbeat() {
    if (this.platformData.socket) {
      this.platformData.heartbeatInterval = setInterval(() => {
        if (this.gameData.socket) {
          this.sendAlert(`Currenlty Playing : ${this.currentGameData.gameId}`)
        }
        this.sendData({ type: "CREDIT", data: { credits: this.playerData.credits } }, "platform");
      }, 10000)
    }
  }

  // Start heartbeat for game socket
  private startGameHeartbeat() {
    if (this.gameData.socket) {
      this.gameData.heartbeatInterval = setInterval(() => {
        if (this.gameData.socket && this.currentGameData.gameId) {
          this.sendAlert(`${this.playerData.username} : ${this.currentGameData.gameId}`)
        }
      }, 20000)
    }
  }

  public async updateGameSocket(socket: Socket) {
    if (socket.request.headers["user-agent"] !== this.playerData.userAgent) {
      socket.emit("alert", {
        id: "AnotherDevice",
        message: "You are already playing on another browser",
      });
      socket.disconnect(true);
      throw createHttpError(403, "You are already playing on another browser")

    }
    this.initializeGameSocket(socket);
    const credits = await getPlayerCredits(this.playerData.username);
    this.playerData.credits = typeof credits === "number" ? credits : 0;
  }

  private async initGameData() {
    if (!this.gameData.socket) return;

    try {
      const tagName = this.currentGameData.gameId;
      const platform = await Platform.aggregate([
        { $unwind: "$games" },
        { $match: { "games.tagName": tagName, "games.status": "active" } },
        { $project: { _id: 0, game: "$games" } },
      ]);


      if (platform.length === 0) {
        this.currentGameData.gameSettings = { ...gameData[0] };
        this.currentGameData.currentGameManager = new GameManager(this.currentGameData);
        return;
      }

      const game = platform[0].game;
      const payout = await payoutController.getPayoutVersionData(game.tagName, game.payout);

      if (!payout) {
        this.currentGameData.gameSettings = { ...gameData[0] };
        this.currentGameData.currentGameManager = new GameManager(this.currentGameData);
        return;
      }

      this.currentGameData.gameSettings = { ...payout };
      this.currentGameData.currentGameManager = new GameManager(this.currentGameData);
    } catch (error) {
      console.error(`Error initializing game data for user ${this.playerData.username}:`, error);
    }
  }

  public sendMessage(action: string, message: any, isGameSocket: boolean = false) {
    const socket = isGameSocket ? this.gameData.socket : this.platformData.socket;
    if (socket) {
      socket.emit(
        messageType.MESSAGE,
        JSON.stringify({ id: action, message, username: this.playerData.username })
      )
    }
  }

  public sendData(data: any, type: "platform" | "game"): void {
    try {
      const socket = type === "platform" ? this.platformData.socket : this.gameData.socket;
      if (socket) {
        socket.emit(messageType.DATA, data)
      }
    } catch (error) {
      console.error(`Error sending data to ${this.playerData.username}'s platform`)
      console.error(error)
    }
  }

  // Send an error message to the client (either platform or game)
  public sendError(message: string, isGameSocket: boolean = false) {
    const socket = isGameSocket ? this.gameData.socket : this.platformData.socket;
    if (socket) {
      socket.emit(messageType.ERROR, message)
    }
  }

  // Send an alert to the client (platform or game)
  public sendAlert(message: string, isGameSocket: boolean = false) {
    const socket = isGameSocket ? this.gameData.socket : this.platformData.socket;
    if (socket) {
      socket.emit(messageType.ALERT, message)
    }
  }

  // Handle client message communication for the game socket
  private messageHandler(isGameSocket: boolean = false) {
    const socket = isGameSocket ? this.gameData.socket : this.platformData.socket;

    if (socket) {
      socket.on("message", (message) => {
        try {
          const response = JSON.parse(message);

          if (isGameSocket) {
            // Delegate message to the current game manager's handler for game-specific logic
            this.currentGameData.currentGameManager.currentGameType.currentGame.messageHandler(response);
          } else {
            // Handle platform-specific messages here if needed
            console.log(`Platform message received: ${response}`);
          }
        } catch (error) {
          console.error("Failed to parse message:", error);
          this.sendError("Failed to parse message", isGameSocket);
        }
      })
    }
  }

  // Handle user exit event for the game or platform
  public onExit(isGameSocket: boolean = false) {
    const socket = isGameSocket ? this.gameData.socket : this.platformData.socket;
    if (socket) {
      socket.on("EXIT", async () => {
        if (isGameSocket) {
          this.sendMessage('ExitUser', '', true);  // Notify game exit
          await this.cleanupGameSocket(); // Clean up game socket
        } else {
          await this.cleanupPlatformSocket(); // Clean up platform socket
          currentActivePlayers.delete(this.playerData.username)
        }
      })
    }
  }

  public async forceExit(isGameSocket: boolean = false) {
    // Send a forced exit alert to the correct socket (game or platform)
    this.sendAlert("ForcedExit", isGameSocket);
    // If the user is exiting the game, only clean up the game socket

    if (isGameSocket) {
      await this.cleanupGameSocket();  // Clean up the game socket only
    } else {
      // If the user is exiting the platform, clean up both platform and game sockets and remove from the users map
      await this.cleanupPlatformSocket();  // Clean up the platform socket
      await this.cleanupGameSocket();  // Optionally, also clean up the game socket if needed
      currentActivePlayers.delete(this.playerData.username);  // Remove from active users map (platform exit)
    }
  }

  private async updateDatabase() {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const finalBalance = this.playerData.credits;
      await Player.findOneAndUpdate(
        { username: this.playerData.username },
        { credits: finalBalance.toFixed(2) },
        { new: true, session }
      );
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      // console.error("Failed to update database:", error);
      this.sendError("Database error");
    } finally {
      session.endSession();
    }
  }

  private checkPlayerBalance(bet: number) {
    if (this.playerData.credits < bet) {
      this.sendMessage("low-balance", true);
      console.error("LOW BALANCE");
    }
  }

  public async updatePlayerBalance(credit: number) {
    try {
      this.playerData.credits += credit;
      await this.updateDatabase();
    } catch (error) {
      console.error("Error updating credits in database:", error);
    }
  }

  public async deductPlayerBalance(currentBet: number) {
    this.checkPlayerBalance(currentBet);
    this.playerData.credits -= currentBet;
  }

  public async getManager(username: string): Promise<string> {
    const managerName = await getManagerName(username)
    return managerName;
  }
}
