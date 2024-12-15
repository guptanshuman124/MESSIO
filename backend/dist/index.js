"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const RoomManager_1 = __importDefault(require("./RoomManager"));
const wss = new ws_1.WebSocketServer({ port: 8080 });
console.log("WebSocket Server is running on port 8080");
const roomManager = new RoomManager_1.default();
wss.on('connection', function connection(ws) {
    console.log("New client connected");
    ws.on('message', function incoming(message) {
        try {
            const data = JSON.parse(message); // Parse incoming JSON
            const { action, roomId } = data;
            if (action === "create") {
                roomManager.createRoom(ws); // Create room with random ID
            }
            else if (action === "join" && roomId) {
                roomManager.joinRoom(ws, roomId); // Join room using provided roomId
            }
            else if (action === "leave" && roomId) {
                // Leave the room
                console.log(`Client left room ${roomId}`);
                roomManager.removeClient(ws); // Remove client from room
                ws.send(JSON.stringify({ info: `Left room ${roomId}` })); // Send success message to client
            }
            else {
                ws.send(JSON.stringify({ error: "Invalid action or missing roomId" }));
            }
        }
        catch (error) {
            ws.send(JSON.stringify({ error: "Invalid message format" }));
        }
    });
    ws.on('close', () => {
        console.log("Client disconnected");
        roomManager.removeClient(ws); // Handle client removal when connection is closed
    });
});
