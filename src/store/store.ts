import { configureStore, combineReducers } from '@reduxjs/toolkit';
import mapSlice from './slices/mapSlice';

const reducer = combineReducers({
    mapSlice
});

export type RootState = ReturnType<typeof reducer>;

export default configureStore({ reducer });
