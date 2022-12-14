import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdoteService';

// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
// ];
const anecdotesAtStart = [];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const initialState = anecdotesAtStart.map(asObject);

const anecdoteSlice = createSlice({
  initialState,
  name: 'anecdotes',
  reducers: {
    setAnecdotes(state, action) {
      return action.payload;
    },
    incrementVote(state, action) {
      const id = action.payload;
      state.forEach((a) => {
        if (a.id === id) a.votes++;
      });
    },
    pushAnecdote(state, action) {
      state.push(action.payload);
    },
  },
});

export { asObject as makeAnecdote };
export const { setAnecdotes, incrementVote, pushAnecdote } =
  anecdoteSlice.actions;

export const initAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};
export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.postAnecdote(asObject(content));
    dispatch(pushAnecdote(newAnecdote));
  };
};
export const voteForAnecdote = (toUpdate) => {
  return async (dispatch) => {
    const updated = { ...toUpdate, votes: toUpdate.votes + 1 };
    const saved = await anecdoteService.put(updated);
    dispatch(incrementVote(saved.id));
  };
};
export default anecdoteSlice.reducer;

// ### THE REDUX WAY, NOT RTK ###
// const reducer = (state = initialState, action) => {
//   console.log('state now: ', state);
//   console.log('action', action);
//   switch (action.type) {
//     case 'VOTE':
//       return state.map((a) =>
//         action.data.id === a.id ? { ...a, votes: a.votes + 1 } : a
//       );
//     case 'PUSH_ANECDOTE':
//       return state.concat(asObject(action.data.content));
//     default:
//       return state;
//   }
//   // return state
// };

// // Action creators
// // Take data, return action, consumer calls dispatch
// export const incrementVote = (id) => {
//   return {
//     type: 'VOTE',
//     data: { id },
//   };
// };

// export const pushAnecdote = (content) => {
//   return {
//     type: 'PUSH_ANECDOTE',
//     data: { content },
//   };
// };
//
// export default reducer;
