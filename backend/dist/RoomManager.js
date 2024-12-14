"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RandomID_1 = __importDefault(require("./generators/RandomID"));
class RoomManager {
    constructor() {
        this.rooms = new Map();
    }
    isRoomIdUnique(roomId) {
        return this.rooms.has(roomId);
    }
    ;
    // Create a new room and add the WebSocket connection
    createRoom(ws) {
        // Generate room ID
        let roomId;
        do {
            roomId = RandomID_1.default.generateRoomId();
        } while (this.isRoomIdUnique(roomId));
        this.rooms.set(roomId, new Set([ws])); // Add the WebSocket to the new room
        ws.send(JSON.stringify({ success: "Room created", roomId }));
        console.log(`Room ${roomId} created`);
    }
    // Join an existing room
    joinRoom(ws, roomId) {
        const clients = this.rooms.get(roomId);
        if (clients) {
            if (clients.size >= 2) {
                ws.send(JSON.stringify({ error: `Room ${roomId} is full` }));
            }
            else {
                clients.add(ws);
                ws.send(JSON.stringify({ success: `Joined room ${roomId}` }));
                console.log(`Client joined room ${roomId}`);
            }
        }
        else {
            ws.send(JSON.stringify({ error: `Room ${roomId} does not exist` }));
        }
    }
    // Remove a client from a room and delete the room if it's empty
    removeClient(ws) {
        for (const [roomId, clients] of this.rooms) {
            if (clients.delete(ws)) {
                console.log(`Client removed from room ${roomId}`);
                // If there are other clients left in the room, notify them about the departure
                if (clients.size > 0) {
                    // Notify the remaining clients in the room about the departure of the client
                    for (const client of clients) {
                        client.send(JSON.stringify({
                            info: `Client left room ${roomId}`
                        }));
                    }
                }
                else {
                    // If no clients are left in the room, delete the room
                    this.rooms.delete(roomId);
                    console.log(`Room ${roomId} deleted`);
                }
                break;
            }
        }
    }
}
exports.default = RoomManager;
