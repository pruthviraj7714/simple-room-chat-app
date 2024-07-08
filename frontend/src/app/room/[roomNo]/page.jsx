"use client";

import { useEffect, useRef, useState } from "react";

export default function RoomPage({ params }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");
    console.log("WebSocket connection initiated");

    ws.current.onopen = () => {
      console.log("WebSocket connection opened");
      ws.current.send(
        JSON.stringify({ type: "subscribe", room: params.roomNo })
      );
    };

    ws.current.onmessage = (event) => {
      console.log("Message received from server:", event.data);
      const { room, content } = JSON.parse(event.data);
      if (room === params.roomNo) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { content, isMine: false },
        ]);
        console.log("Updated messages:", messages);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({ type: "unsubscribe", room: params.roomNo })
        );
        ws.current.close();
      } else {
        ws.current.onopen = () => {
          ws.current.send(
            JSON.stringify({ type: "unsubscribe", room: params.roomNo })
          );
          ws.current.close();
        };
      }
    };
  }, [params.roomNo]);

  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "message",
          room: params.roomNo,
          content: message,
        })
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: message, isMine: true },
      ]);
    }
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-400 to-blue-500 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-pink-400 rounded-lg shadow-lg p-6 flex flex-col">
        <h1 className="font-bold text-2xl mb-4">Welcome to {params.roomNo}</h1>
        <div className="flex flex-col space-y-4 mb-4 overflow-y-auto h-96">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  msg.isMine
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-auto">
          <input
            type="text"
            className="flex-1 p-2 border text-black rounded-lg"
            placeholder="Enter the message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
