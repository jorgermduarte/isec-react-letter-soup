import React from 'react';
import {useAppSelector} from '../../store/hooks';

const WordList: React.FC<{}> = () => {
  const gameboard = useAppSelector(state => state.gameboard);

  return (
    <div className="game-wordlist">
      {gameboard.words.map(word => (
        <div className="gameWord" key={'word-' + word}>
          {word}
        </div>
      ))}
    </div>
  );
};

export default WordList;
