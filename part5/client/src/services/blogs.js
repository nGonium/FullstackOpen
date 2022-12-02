import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const postBlog = ({ title, author, url, likes }) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.post(baseUrl, { title, author, url, likes }, config)
  return request.then((res) => res.data)
}

const updateBlog = ({ title, author, url, likes, id }) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.put(
    `${baseUrl}/${id}`,
    { title, author, url, likes },
    config
  )
  return request.then((res) => res.data)
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = await axios.delete(`${baseUrl}/${id}`, config)
  return request
}

export default { setToken, getAll, postBlog, updateBlog, deleteBlog }
