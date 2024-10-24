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
        console.log("Manager Initlized");

    }

    private initializeEventListeners() {
        eventEmitter.on("platform", (event) => {
            if (event.to === this.username || this.role === "master") {
                this.notifyManager({ type: event.type, data: event.data });
            }
        });

        eventEmitter.on("game", (event) => {
            if (event.to === this.username || this.role === "master") {
                this.notifyManager({ type: event.type, data: event.data });
            }
        });
    }

    private notifyManager(data: { type: string, data: any }) {
        if (this.socket) {

            this.socket.emit("player", data);  // Emit event to the manager's socket
            console.log(`Notified manager ${this.username} about event ${data.type}:`, data);
        } else {
            console.error(`Socket is not available for manager ${this.username}`);
        }
    }
}