import React, {useEffect} from 'react';
import GameBoard from '../board/Board';
import './Game.css';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {setMatrix, setWords} from '../../store/board-actions';

const Game: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const gameboard = useAppSelector(state => state.gameboard);

  useEffect(() => {
    dispatch(setMatrix(gameboard));
  }, []);

  useEffect(() => {
    if (gameboard.matrix.length > 0) {
      dispatch(setWords(gameboard));
    }
  }, [gameboard.matrix.length]);

  return (
    <div className="App">
      <div className="game-header">Sopa de Letras - Linguagens Script</div>
      {gameboard.matrix.length > 0 && <GameBoard></GameBoard>}
    </div>
  );
};

export default Game;
