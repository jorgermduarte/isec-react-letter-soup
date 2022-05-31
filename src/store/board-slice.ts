import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  addFoundWord,
  changeEndGame,
  changeInitialized,
  cleanMatrixSelections,
  setMatrix,
  setUsername,
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
  UNDEFINED = 0,
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
  EXTREME = 4,
}

type DifficultySpecs = {
  secondsLimit: number;
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
  username?: string;
  gameLost: boolean;
};

export const initialState: BoardState = {
  words: [],
  matrix: [],
  specifications: {
    secondsLimit: 0, // current game board seconds limit
    difficulty: BoardDifficulty.UNDEFINED, //current game dificulty
    columns: 18, // gameboard total columns
    lines: 10, // gameboard current total lines
    totalWords: 4, // gameboard current total words
  },
  settings: {
    wordsRendered: 0,
  },
  foundWords: [],
  gameLost: false,
  gameEnd: false, //if the game as ended and is on the save scoreboard screen
  initialized: false, // if the game has been initialized
  timmer: undefined, // start game date time
  gameEndTimmer: undefined, //end game date time
  username: '', //game username
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
    verifyEndGame(state: BoardState, {payload}: PayloadAction<boolean>) {
      if (state.timmer && state.gameEnd === false) {
        console.log('validating end game based on timme');
        const expectedFinishDate = new Date(state.timmer);
        expectedFinishDate.setSeconds(
          expectedFinishDate.getSeconds() + state.specifications.secondsLimit
        );

        const currentDate = new Date();

        if (currentDate.getTime() > expectedFinishDate.getTime()) {
          console.log(
            '>>>>>>>>>>>>>>>>>> TRIGGER GAME END BASED ON TIME - USER LOST'
          );
          state.gameLost = true;
          state.gameEnd = true;
        }
      }
    },
  },
  extraReducers: {
    [`${setMatrix.fulfilled}`]: (
      state: BoardState,
      {payload}: PayloadAction<letterProperties[][]>
    ) => {
      if (state.initialized) {
        console.log('[setMatrix] received payload! generating new matrix');
        console.log(payload);
        state.matrix = payload;
      }
    },
    [`${setWords.fulfilled}`]: (
      state: BoardState,
      {payload}: PayloadAction<string[]>
    ) => {
      if (state.initialized) {
        console.log('[setWords] received payload! setWords');
        state.words = payload;
        state.timmer = new Date().toISOString();
        state.gameEndTimmer = undefined;
        state.foundWords = [];
        state.settings.wordsRendered = 0;
      }
    },
    [`${updateMatrixPosition.fulfilled}`]: (
      state: BoardState,
      {payload}: PayloadAction<updateMatrixType>
    ) => {
      console.log(
        '[updateMatrixPosition] received payload! updateMatrixPosition'
      );
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
      if (state.initialized) {
        console.log(
          '[updateMatrix] received payload! rewriting the matrix with the current payload :) '
        );
        state.matrix = payload;
        console.log('total words rendered: ', state.settings.wordsRendered + 1);
        state.settings.wordsRendered = state.settings.wordsRendered + 1;
      }
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
      if (state.initialized) {
        state.foundWords.push(payload);
        console.log('[addFoundWord] received payload! added word to the list');
      }
    },
    [`${changeEndGame.fulfilled}`]: (
      state: BoardState,
      {payload}: PayloadAction<boolean>
    ) => {
      if (state.initialized) {
        state.gameEnd = payload;

        if (payload === true) {
          console.log('setting end game timming');
          state.gameEndTimmer = new Date().toISOString();
        } else {
          state.initialized = false;
          state.gameEnd = false;
          state.gameLost = false;
          state.matrix = [];
          state.gameEndTimmer = undefined;
          state.settings.wordsRendered = 0;
          state.words = [];
          state.specifications = {...initialState.specifications};
          console.log('[changeEndGame] SETTING INITIAL STATE FOR THE END GAME');
        }
      }
    },
    [`${changeInitialized.fulfilled}`]: (
      state: BoardState,
      {payload}: PayloadAction<boolean>
    ) => {
      if (payload) {
        state.timmer = new Date().toISOString();
      }
      state.initialized = payload;
    },
    [`${setUsername.fulfilled}`]: (
      state: BoardState,
      {payload}: PayloadAction<string>
    ) => {
      state.username = payload;
    },
  },
});

export default BoardSlice;
