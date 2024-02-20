// store.js
import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './reducer';

const store = configureStore({
  reducer: {
    movies: moviesReducer,
    // Add more reducers if needed
  },
});

export default store;
