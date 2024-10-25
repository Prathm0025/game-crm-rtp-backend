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
                this.notifyManager({ type: event.type, payload: event.payload });
            }
        });

        eventEmitter.on("game", (event) => {
            if (event.to === this.username || this.role === "master") {
                this.notifyManager({ type: event.type, payload: event.payload });
            }
        });
    }

    private notifyManager(data: { type: string, payload: any }) {
        if (this.socket) {
            this.socket.emit("PLATFORM", data); 
        } else {
            console.error(`Socket is not available for manager ${this.username}`);
        }
    }
}