import axios from 'axios';

const api = `http://localhost:3003/anecdotes`;
const getAll = () => axios.get(api).then((res) => res.data);
const postAnecdote = (anecdote) =>
  axios.post(api, anecdote).then((res) => res.data);
const put = (anecdote) =>
  axios.put(`${api}/${anecdote.id}`, anecdote).then((res) => res.data);

export default { getAll, postAnecdote, put };
