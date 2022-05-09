import {BoardDifficulty} from '../store/board-slice';

export const getDifficulty = (difficulty: BoardDifficulty) => {
  let name = '';
  switch (difficulty) {
    case BoardDifficulty.EASY:
      name = 'fácil';
      break;
    case BoardDifficulty.MEDIUM:
      name = 'médio';
      break;
    case BoardDifficulty.HARD:
      name = 'difícil';
      break;
    case BoardDifficulty.EXTREME:
      name = 'extremo';
      break;
  }
  return name;
};
