import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  addFoundWord,
  changeEndGame,
  changeInitialized,
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
  foundWords: string[];
  matrix: letterProperties[][];
  settings: GameRenderization;
  timmer?: string;
  gameEndTimmer?: string;
  gameEnd: boolean;
  initialized: boolean;
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
  foundWords: [],
  gameEnd: false,
  initialized: false,
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
      state.timmer = new Date().toISOString();
      state.gameEndTimmer = undefined;
      state.foundWords = [];
      state.settings.wordsRendered = 0;
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
    [`${addFoundWord.fulfilled}`]: (
      state: BoardState,
      {payload}: PayloadAction<string>
    ) => {
      state.foundWords.push(payload);
    },
    [`${changeEndGame.fulfilled}`]: (
      state: BoardState,
      {payload}: PayloadAction<boolean>
    ) => {
      state.gameEnd = payload;
      if (payload === true) {
        state.gameEndTimmer = new Date().toISOString();
      } else {
        state.initialized = false;
        state.gameEnd = false;
        state.gameEndTimmer = undefined;
        state.foundWords = [];
        state.settings.wordsRendered = 0;
      }
    },
    [`${changeInitialized.fulfilled}`]: (
      state: BoardState,
      {payload}: PayloadAction<boolean>
    ) => {
      state.initialized = payload;
      if (payload === false) {
        state.gameEnd = false;
        state.gameEndTimmer = undefined;
        state.foundWords = [];
        state.settings.wordsRendered = 0;
      }
    },
  },
});

export default BoardSlice;
