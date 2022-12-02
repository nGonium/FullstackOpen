import axios from 'axios'

const login = ({ username, password }) => {
  const req = axios.post('/api/login', {
    username,
    password,
  })
  return req.then((res) => res.data)
}

export default { login }
