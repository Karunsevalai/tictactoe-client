import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import TicTacToe from './page/TicTacToe';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:roomId" element={<TicTacToe />} />
    </Routes>
  </Router>
);

export default App;
