import axios from 'axios';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { voteForAnecdote, initAnecdotes } from '../reducers/anecdoteReducer';
import {
  setNotificationTimedout as setNotification,
  removeNotification,
} from '../reducers/notificationReducer';

const AnecdoteList = () => {
  const dispatch = useDispatch();

  const anecdotes = useSelector(({ anecdotes, filter }) =>
    // Case sensitive
    anecdotes.filter((a) => a.content.includes(filter))
  );

  useEffect(() => {
    // axios.get('http://localhost:3003/anecdotes').then((res) => {
    dispatch(initAnecdotes());
    // });
  }, [dispatch]);

  const vote = (anecdote) => {
    const { id, content } = anecdote;
    console.log('vote', id);
    dispatch(voteForAnecdote(anecdote));
    dispatch(setNotification(`you voted '${content}'`, 2));
  };

  const anecdotesSorted = [...anecdotes];
  anecdotesSorted.sort((a, b) => b.votes - a.votes);

  return (
    <>
      {anecdotesSorted.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnecdoteList;
