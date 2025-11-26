import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const joinRoom = () => {
    const trimmed = roomId.trim();
    if (!trimmed) return alert("Enter a room ID");
    navigate(`/game/${trimmed}`);
  };

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    navigate(`/game/${newRoomId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') joinRoom();
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-800">
      <div className="bg-gray-900 bg-opacity-80 p-10 rounded-xl shadow-xl flex flex-col items-center w-96">
        <h1 className="text-4xl font-bold text-white mb-6">Tic-Tac-Toe</h1>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full placeholder-red-500 text-red-500 p-3 mb-5 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 "
          aria-label="Room ID"
        />
        <div className="flex flex-col max-w-4/5  gap-4 w-full">
          <button
            onClick={joinRoom}
            className="flex-1 p-3 bg-green-500 hover:bg-green-600 transition-colors rounded-lg font-semibold shadow-md"
          >
            Join Room
          </button>
          <button
            onClick={createRoom}
            className="flex-1 p-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-semibold shadow-md"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
