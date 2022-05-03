import {configureStore} from '@reduxjs/toolkit';
import BoardSlice from './board-slice';

const reducer = {
  gameboard: BoardSlice.reducer,
};

export const createStore = (state?: never) =>
  configureStore({
    reducer,
    preloadedState: state,
  });

const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
