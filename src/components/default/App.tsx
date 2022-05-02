import React from 'react';
import GameBoard from '../board/Board';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <div className="game-header">Sopa de Letras - Linguagens Script</div>
      <GameBoard></GameBoard>
    </div>
  );
}

export default App;
