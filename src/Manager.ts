import { Socket } from "socket.io";
import { eventEmitter } from "./utils/eventEmitter";

export default class Manager {
    username: string;
    role: string;
    userAgent: string;
    socket: Socket;

    constructor(username: string, role: string, userAgent: string, socket: Socket) {
        this.username = username;
        this.role = role;
        this.userAgent = userAgent;
        this.socket = socket;
        this.initializeEventListeners();
    }

    private initializeEventListeners() {
        // Listen for player platform connection events
        eventEmitter.on("platformConnect", (message) => {
            console.log("FROM MANAGER : ", message);
        })
    }

    public initializeHandlers() {
        if (this.socket) {
            this.socket.on("data", async (message) => {
                try {
                    const res = message as { action: string, payload: any }
                } catch (error) {

                }
            })
        }
    }
}