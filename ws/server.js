import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({port : 8080});

const chatRooms = new Map();

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        const {type, room, content} = JSON.parse(message);

        if(type == "subscribe") {
            if(!chatRooms.has(room)) {
                chatRooms.set(room, new Set());
            }
            chatRooms.get(room).add(ws);
        }else if(type == 'unsubscribe') {
            if(chatRooms.has(room)) {
                chatRooms.get(room).delete(ws);
                if(chatRooms.get(room).size === 0) {
                    chatRooms.delete(room);
                }
            }
        }else if(type == 'message') {
            if(chatRooms.has(room)) {
                chatRooms.get(room).forEach(client => {
                    if(client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({room, content}));
                    }
                })
            }
        }
    })

    ws.on("close", () => {
        chatRooms.forEach((clients, room) => {
            if(clients.has(ws)) {
                clients.delete(ws);
                if(clients.size === 0) {
                    chatRooms.delete(room);
                }
            }
        })
    })
})