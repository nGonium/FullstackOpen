import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import RequestNotification from './components/RequestNotification'
import ToggleDisplay from './components/ToggleDisplay'
import LoginForm from './components/LoginForm'

const App = () => {
  const [user, setUser] = useState(() => {
    if (window.localStorage.getItem('user')) {
      const user = JSON.parse(window.localStorage.getItem('user'))
      blogService.setToken(user.token)
      return user
    }
    return null
  })
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [isVisibleBlogForm, setIsVisibleBlogForm] = useState(false)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('user')
    setUser(null)
    blogService.setToken(null)
  }

  const handleCreateBlog = async (e, data) => {
    e.preventDefault()
    try {
      const res = await blogService.postBlog(data)
      const { title, author } = res
      setNotification({
        message: `a new blog "${title}" by ${author} added`,
        status: 'success',
      })
      setTimeout(() => setNotification(null), 5000)
      setBlogs((b) => [...b, res])
      setIsVisibleBlogForm(false)
    } catch (err) {
      setNotification({ message: err.response.data.error, status: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const deleteBlog = async ({ id, title, author }) => {
    if (!window.confirm(`Remove blog ${title} by ${author}?`)) return
    try {
      const res = await blogService.deleteBlog(id)
      if (res.status === 204) setBlogs(blogs.filter((b) => b.id !== id))
      setNotification({ message: 'Deleted a blog', status: 'success' })
    } catch (err) {
      setNotification({ message: 'Something went wrong', status: 'error' })
    }
  }

  const handleUpdateBlog = async (e, previous, updatedFields) => {
    const updatedBlog = await blogService.updateBlog({
      ...previous,
      ...updatedFields,
    })
    setBlogs(blogs.map((b) => (b.id !== previous.id ? b : updatedBlog)))
  }

  const handleLogin = async (e, credentials) => {
    e.preventDefault()
    try {
      const user = await loginService.login(credentials)
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('user', JSON.stringify(user))
    } catch (err) {
      setNotification({
        message: 'wrong username or password',
        status: 'error',
      })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const blogsToDisplay = [...blogs]
    .sort((a, b) => b.likes - a.likes)
    .map((blog) => (
      <Blog
        key={blog.id}
        blog={blog}
        handleUpdateBlog={handleUpdateBlog}
        deleteBlog={deleteBlog}
        currentUser={user}
      />
    ))

  const toggleVisibilityBlogForm = () => {
    setIsVisibleBlogForm(!isVisibleBlogForm)
  }

  return (
    <div>
      <h2>blogs</h2>
      {notification !== null && (
        <RequestNotification
          message={notification.message}
          status={notification.status}
        />
      )}
      {user === null ? (
        <LoginForm setUser={setUser} onLogin={handleLogin} />
      ) : (
        <>
          <p>
            {user.username} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </p>
          {!isVisibleBlogForm && (
            <button onClick={toggleVisibilityBlogForm}>new blog</button>
          )}
          <ToggleDisplay isVisible={isVisibleBlogForm}>
            <BlogForm onCreateBlog={handleCreateBlog} />
            <button onClick={toggleVisibilityBlogForm}>Cancel</button>
          </ToggleDisplay>
          {blogsToDisplay}
        </>
      )}
    </div>
  )
}

export default App
