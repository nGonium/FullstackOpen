// import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { createAnecdote } from '../reducers/anecdoteReducer';

const AnecdoteForm = ({ createAnecdote }) => {
  // const dispatch = useDispatch();

  const addAnecdote = async (e) => {
    e.preventDefault();
    const content = e.target.anecdote.value;
    // dispatch(createAnecdote(content));
    createAnecdote(content);
  };

  return (
    <>
      <h2>create new</h2>

      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button>create</button>
      </form>
    </>
  );
};

export default connect(null, { createAnecdote })(AnecdoteForm);
