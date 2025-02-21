import { configureStore } from '@reduxjs/toolkit';
import techReducer from './techSlice';

export const store = configureStore({
    reducer: {
        tech: techReducer,
    },
});

export default store;
