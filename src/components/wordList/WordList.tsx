import React from 'react';
import {useAppSelector} from '../../store/hooks';
import Timmer from '../timmer/Timmer';
import {getDifficulty} from '../../utils/utils';

const WordList: React.FC<{}> = () => {
  const gameboard = useAppSelector(state => state.gameboard);

  return (
    <div>
      <Timmer></Timmer>
      <div className="game-difficulty">
        <p>
          <b>Dificuldade Atual: </b>
        </p>
        <p>{getDifficulty(gameboard.specifications.difficulty)}</p>
      </div>
      <hr />

      <div className="game-difficulty">
        <p>
          <b>Utilizador: </b>
        </p>
        <p>{gameboard.username}</p>
      </div>
      <hr />

      <div className="game-wordlist">
        <p>
          <b>Lista de Palavras: </b>
        </p>
        {gameboard.words.map(word => (
          <div className="gameWord" key={'word-' + word}>
            {word}
          </div>
        ))}
        <hr />
        <p>
          <b>Palavras encontradas:</b>
        </p>
        {gameboard.foundWords.map(word => (
          <div className="gameWordFound" key={'found-word-' + word}>
            {word}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordList;
