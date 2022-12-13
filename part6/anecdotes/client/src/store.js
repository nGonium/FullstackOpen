import { configureStore } from '@reduxjs/toolkit';
import anecodoteReducer from './reducers/anecdoteReducer';
import filterReducer from './reducers/filterReducer';
import notificationReducer from './reducers/notificationReducer';

const store = configureStore({
  reducer: {
    anecdotes: anecodoteReducer,
    notification: notificationReducer,
    filter: filterReducer,
  },
});

export default store;
