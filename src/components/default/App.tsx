import React, {useEffect} from 'react';
import GameBoard from '../board/Board';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {setMatrix, setWords} from '../../store/board-actions';

function App() {
  const dispatch = useAppDispatch();
  const gameboard = useAppSelector(state => state.gameboard);

  useEffect(() => {
    dispatch(setMatrix(gameboard));
    dispatch(setWords(gameboard));
  }, []);

  return (
    <div className="App">
      <div className="game-header">Sopa de Letras - Linguagens Script</div>
      {gameboard.matrix.length > 0 && <GameBoard></GameBoard>}
    </div>
  );
}

export default App;
