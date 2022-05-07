import React from 'react';
import {useAppSelector} from '../../store/hooks';

const WordList: React.FC<{}> = () => {
  const gameboard = useAppSelector(state => state.gameboard);

  return (
    <div>
      <div className="game-difficulty">
        <p>
          <b>Dificuldade Atual: </b>
        </p>
        <p>{gameboard.specifications.difficulty}</p>
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
