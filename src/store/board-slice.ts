import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  cleanMatrixSelections,
  setMatrix,
  setWords,
  updateMatrix,
  updateMatrixPosition,
} from './board-actions';

export type letterProperties = {
  letter: string;
  filled: boolean;
  index: number;
  selected?: boolean;
  busy?: boolean;
};

export type updateMatrixType = {
  line: number;
  column: number;
  letter: letterProperties;
};

export enum BoardDifficulty {
  EASY,
  MEDIUM,
  HARD,
  EXTREME,
}

type DifficultySpecs = {
  difficulty: BoardDifficulty;
  columns: number;
  lines: number;
  totalWords: number;
};

type GameRenderization = {
  wordsRendered: number;
};

export type BoardState = {
  specifications: DifficultySpecs;
  words: string[];
  matrix: letterProperties[][];
  settings: GameRenderization;
};

export const initialState: BoardState = {
  words: [],
  matrix: [],
  specifications: {
    difficulty: BoardDifficulty.EASY,
    columns: 18,
    lines: 10,
    totalWords: 4,
  },
  settings: {
    wordsRendered: 0,
  },
};

const BoardSlice = createSlice({
  name: 'gameboard',
  initialState,
  reducers: {
    setDifficulty(
      state: BoardState,
      {payload}: PayloadAction<DifficultySpecs>
    ) {
      state.specifications = payload;
    },
  },
  extraReducers: {
    [`${setMatrix.fulfilled}`]: (
      state: BoardState,
      {payload}: PayloadAction<letterProperties[][]>
    ) => {
      console.log('received payload! setMatrix');
      console.log(payload);
      state.matrix = payload;
    },
    [`${setWords.fulfilled}`]: (
      state: BoardState,
      {payload}: PayloadAction<string[]>
    ) => {
      console.log('received payload! setWords');
      console.log(payload);
      state.words = payload;
    },
    [`${updateMatrixPosition.fulfilled}`]: (
      state: BoardState,
      {payload}: PayloadAction<updateMatrixType>
    ) => {
      console.log('received payload! updateMatrixPosition');
      const {line, column, letter} = payload;
      state.matrix[line][column].letter = letter.letter
        .toString()
        .toUpperCase();
      state.matrix[line][column].busy = letter.busy;
      state.matrix[line][column].selected = letter.selected;
      state.matrix[line][column].filled = letter.filled;
    },
    [`${updateMatrix.fulfilled}`]: (
      state: BoardState,
      {payload}: PayloadAction<letterProperties[][]>
    ) => {
      console.log(
        'received payload! rewriting the matrix with the current payload :) '
      );
      state.matrix = payload;
      console.log('total words rendered: ', state.settings.wordsRendered + 1);
      state.settings.wordsRendered = state.settings.wordsRendered + 1;
    },
    [`${cleanMatrixSelections.fulfilled}`]: (
      state: BoardState,
      {payload}: PayloadAction<letterProperties[][]>
    ) => {
      console.log(
        '[cleanMatrixSelections] received payload! rewriting the matrix with the current payload :) '
      );
      state.matrix = payload;
    },
  },
});

export default BoardSlice;
