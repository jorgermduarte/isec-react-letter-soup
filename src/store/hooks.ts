import {TypedUseSelectorHook, useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from './';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
