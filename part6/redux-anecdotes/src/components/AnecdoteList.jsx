import { useSelector, useDispatch } from 'react-redux';
import { incrementVote } from '../reducers/anecdoteReducer';
import {
  setNotification,
  removeNotification,
} from '../reducers/notificationReducer';

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) =>
    // Case sensitive
    anecdotes.filter((a) => a.content.includes(filter))
  );
  const dispatch = useDispatch();

  const vote = ({ id, content }) => {
    console.log('vote', id);
    dispatch(incrementVote(id));
    dispatch(setNotification(`you voted '${content}'`));
    setTimeout(() => {
      dispatch(removeNotification());
    }, 5000);
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
