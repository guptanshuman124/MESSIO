import { WebSocket } from "ws";
import RandomID from "./generators/RandomID";

class RoomManager {
    private rooms: Map<string, Set<WebSocket>>;

    constructor() {
        this.rooms = new Map();
    }

    private isRoomIdUnique(roomId: string): boolean {
        return this.rooms.has(roomId);
    };

    // Create a new room and add the WebSocket connection
    createRoom(ws: WebSocket): void {
        // Generate room ID
        let roomId: string;
        do {
            roomId = RandomID.generateRoomId();
        } while (this.isRoomIdUnique(roomId));
        this.rooms.set(roomId, new Set([ws])); // Add the WebSocket to the new room
        ws.send(JSON.stringify({ success: "Room created", roomId }));
        console.log(`Room ${roomId} created`);
    }

    // Join an existing room
    joinRoom(ws: WebSocket, roomId: string): void {
        const clients = this.rooms.get(roomId);
    
        if (clients) {
            if (clients.size >= 2) {
                ws.send(JSON.stringify({ error: `Room ${roomId} is full` }));
            } else {
                // Add the new client to the room
                clients.add(ws);
    
                // Notify the new client
                ws.send(JSON.stringify({ success: `Joined room ${roomId}` }));
                console.log(`Client joined room ${roomId}`);
    
                // Notify existing clients in the room that a new client has joined
                clients.forEach(client => {
                    if (client !== ws) { // Don't notify the client that just joined
                        client.send(JSON.stringify({ success: `A new client has joined room ${roomId}` }));
                    }
                });
            }
        } else {
            ws.send(JSON.stringify({ error: `Room ${roomId} does not exist` }));
        }
    }
    
    // Remove a client from a room and delete the room if it's empty
    removeClient(ws: WebSocket): void {
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
                } else {
                    // If no clients are left in the room, delete the room
                    this.rooms.delete(roomId);
                    console.log(`Room ${roomId} deleted`);
                }
                break;
            }
        }
    }
    
}

export default RoomManager;
