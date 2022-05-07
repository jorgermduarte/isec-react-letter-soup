import {createAsyncThunk} from '@reduxjs/toolkit';
import {letterProperties, updateMatrixType} from './board-slice';
import {BoardState} from '../store/board-slice';
import wordsList from '../data/words_list';

export const setMatrix = createAsyncThunk(
  'gameboard/setMatrix',
  async (gameboard: BoardState): Promise<letterProperties[][]> => {
    console.log('> no words detected');
    let cl, ln;
    const board = []; //clean the main board before do any action
    const allowedLetters = 'ABCEDFGHIJKLMNOPQRSTUVXZ';
    let index = 0;

    for (ln = 0; ln < gameboard.specifications.lines; ln++) {
      const newLine = [];
      for (cl = 0; cl < gameboard.specifications.columns; cl++) {
        //generate random letter
        newLine.push({
          letter: allowedLetters.charAt(
            Math.floor(Math.random() * allowedLetters.length)
          ),
          filled: false,
          index: index,
        } as letterProperties);
        index++;
      }
      board.push(newLine);
    }

    return board;
  }
);

export const setWords = createAsyncThunk(
  'gameboard/setWords',
  async (gameboard: BoardState): Promise<string[]> => {
    const myCustomList = wordsList.sort(() => 0.5 - Math.random());
    //replace the gameWordsNumber with the x words number based on the difficulty
    const remakedList = myCustomList.slice(
      0,
      gameboard.specifications.totalWords
    );
    return remakedList;
  }
);

export const updateMatrixPosition = createAsyncThunk(
  'gameboard/updateMatrixPosition',
  async (obj: updateMatrixType): Promise<updateMatrixType> => {
    return obj;
  }
);

export const updateMatrix = createAsyncThunk(
  'gameboard/updateMatrix',
  async (obj: letterProperties[][]): Promise<letterProperties[][]> => {
    return obj;
  }
);

export const cleanMatrixSelections = createAsyncThunk(
  'gameboard/cleanMatrixSelections',
  async (obj: letterProperties[][]): Promise<letterProperties[][]> => {
    const newobj: letterProperties[][] = [];

    for (let x = 0; x < obj.length; x++) {
      const newLine = [];
      for (let y = 0; y < Object.keys(obj[x]).length; y++) {
        const newprops = {...obj[x][y]};
        newprops.selected = false;
        newLine.push(newprops);
      }
      newobj.push(newLine);
    }

    return newobj;
  }
);

export const addFoundWord = createAsyncThunk(
  'gameboard/addFoundWord',
  async (word: string): Promise<string> => {
    return word;
  }
);

export const changeEndGame = createAsyncThunk(
  'gameboard/changeEndGame',
  async (prop: boolean): Promise<boolean> => {
    return prop;
  }
);

export const changeInitialized = createAsyncThunk(
  'gameboard/changeInitialized',
  async (prop: boolean): Promise<boolean> => {
    return prop;
  }
);
