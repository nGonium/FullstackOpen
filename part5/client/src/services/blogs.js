import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;
const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const postBlog = ({ title, author, url }) => {
  const config = {
    headers: { Authorization: token },
  };
  console.log(config);
  const request = axios.post(baseUrl, { title, author, url }, config);
  return request.then((res) => res.data);
};

export default { setToken, getAll, postBlog };
