"use client"

import { useRouter } from "next/navigation";

const rooms = ["room1", "room2", "room3", "room4"];

export default function Home() {
  const router = useRouter();

  return (
    <main className="h-screen bg-gradient-to-r from-pink-400 to-purple-500 flex flex-col justify-center items-center p-6">
    <h1 className="text-white text-4xl font-bold mb-8">Chat Room Application</h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
      {rooms.map((room, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg flex flex-col justify-between p-6 transform transition duration-300 hover:scale-105">
          <div className="text-lg font-semibold text-gray-800 mb-4">{room}</div>
          <button
            onClick={() => {
              router.push(`/room/${room}`);
            }}
            className="bg-blue-500 text-white rounded-lg py-2 px-4 mt-auto transform transition duration-300 hover:bg-blue-700"
          >
            Enter
          </button>
        </div>
      ))}
    </div>
  </main>
  );
}
