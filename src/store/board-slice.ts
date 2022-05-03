import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {setMatrix, setWords, updateMatrixPosition} from './board-actions';

export type letterProperties = {
  letter: string;
  filled: boolean;
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

export type BoardState = {
  specifications: DifficultySpecs;
  words: string[];
  matrix: letterProperties[][];
  rendered: boolean;
};

export const initialState: BoardState = {
  words: [],
  matrix: [],
  specifications: {
    difficulty: BoardDifficulty.EASY,
    columns: 10,
    lines: 8,
    totalWords: 4,
  },
  rendered: false,
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
      state.matrix[line][column] = letter;
    },
  },
});

export default BoardSlice;
