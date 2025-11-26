import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';

const TicTacToe = () => {
  const { roomId } = useParams();
  const [board, setBoard] = useState(Array.from({ length: 3 }, () => Array(3).fill('')));
  const [turn, setTurn] = useState('X');
  const [mySymbol, setMySymbol] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
    const newSocket = io(SERVER_URL); // one socket per room
    setSocket(newSocket);

    newSocket.emit('joinRoom', { roomId });

    newSocket.on('roomFull', () => toast.error('Room is full'));
    newSocket.on('playerAssigned', (symbol) => {
      setMySymbol(symbol);
      toast.success(`You are player ${symbol}`);
    });

    newSocket.on('startGame', ({ board: b, turn: t }) => {
      setBoard(b);
      setTurn(t);
      setGameStarted(true);
      toast(`Game started! ${t === mySymbol ? "Your turn" : "Opponent's turn"}`);
    });

    newSocket.on('updateBoard', ({ board: b, turn: t }) => {
      setBoard(b);
      setTurn(t);
    });

    newSocket.on('gameOver', ({ winner, draw }) => {
      if (draw) toast('It\'s a draw!');
      else toast.success(`Winner: ${winner}`);
      setGameStarted(false);
    });

    newSocket.on('playerLeft', () => {
      toast('Opponent left the game!');
      setBoard(Array.from({ length: 3 }, () => Array(3).fill('')));
      setGameStarted(false);
    });

    return () => newSocket.disconnect();
  }, [roomId, mySymbol]);

  const handleClick = (row, col) => {
    if (!gameStarted || mySymbol !== turn || board[row][col] !== '' || !socket) return;
    socket.emit('makeMove', { roomId, row, col });
  };

  return (
    <div className="flex h-screen bg-gray-800 flex-col items-center justify-center">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-center text-white font-mono mb-5 text-3xl">Tic-Tac-Toe</h1>

      {/* Turn indicator */}
      <p className="text-white mb-4 text-xl">
        {gameStarted 
          ? (mySymbol === turn ? "Your turn" : "Opponent's turn")
          : "Waiting for players..."}
        {gameStarted && (
          <span
            className={`ml-2 px-2 py-1 rounded font-bold ${
              turn === 'X' ? 'bg-red-500' : 'bg-blue-500'
            }`}
          >
            {turn}
          </span>
        )}
      </p>

      {/* Game Board */}
      {board.map((row, rIndex) => (
        <div key={rIndex} className="flex">
          {row.map((cell, cIndex) => (
            <div
              key={cIndex}
              onClick={() => handleClick(rIndex, cIndex)}
              className={`h-20 w-20 border border-black flex items-center justify-center font-bold text-3xl cursor-pointer
                ${cell === 'X' ? 'text-red-500' : cell === 'O' ? 'text-blue-500' : 'text-black'}
                bg-[#0F0] hover:bg-green-400 transition-colors duration-200
              `}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TicTacToe;
//correct