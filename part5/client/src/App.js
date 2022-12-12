import { useState, useEffect, useReducer } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/login"
import BlogForm from "./components/BlogForm"
import RequestNotification from "./components/RequestNotification"
import ToggleDisplay from "./components/ToggleDisplay"
import LoginForm from "./components/LoginForm"

const blogsReducer = (state, action) => {
  const { data } = action
  switch (action.type) {
    case "set_blogs": {
      return data
    }
    case "add_blog": {
      return [...state, data]
    }
    case "delete_blog": {
      return state.filter((b) => b.id !== action.id)
    }
    case "update_blog": {
      return state.map((b) => (b.id === data.id ? data : b))
    }
  }
}

const App = () => {
  const [user, setUser] = useState(() => {
    if (window.localStorage.getItem("user")) {
      const user = JSON.parse(window.localStorage.getItem("user"))
      blogService.setToken(user.token)
      return user
    }
    return null
  })
  const [blogs, dispatchBlogs] = useReducer(blogsReducer, [])
  // const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [isVisibleBlogForm, setIsVisibleBlogForm] = useState(false)

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => dispatchBlogs({ type: "set_blogs", data: blogs }))
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem("user")
    setUser(null)
    blogService.setToken(null)
  }

  const createBlog = async (data) => {
    try {
      const res = await blogService.postBlog(data)
      const { title, author } = res
      setNotification({
        message: `a new blog "${title}" by ${author} added`,
        status: "success",
      })
      setTimeout(() => setNotification(null), 5000)
      // setBlogs((b) => [...b, res])
      dispatchBlogs({ type: "add_blog", data: res })
      setIsVisibleBlogForm(false)
    } catch (err) {
      setNotification({ message: err.response.data.error, status: "error" })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const deleteBlog = async ({ id, title, author }) => {
    if (!window.confirm(`Remove blog ${title} by ${author}?`)) return
    try {
      const res = await blogService.deleteBlog(id)
      if (res.status === 204) dispatchBlogs({ type: "delete_blog", id })
      setNotification({ message: "Deleted a blog", status: "success" })
    } catch (err) {
      setNotification({ message: "Something went wrong", status: "error" })
    }
  }

  const updateBlog = async (previous, updatedFields) => {
    const updatedBlog = await blogService.updateBlog({
      ...previous,
      ...updatedFields,
    })
    dispatchBlogs({ type: "update_blog", data: updatedBlog })
  }

  const handleLogin = async (e, credentials) => {
    e.preventDefault()
    try {
      const user = await loginService.login(credentials)
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem("user", JSON.stringify(user))
    } catch (err) {
      setNotification({
        message: "wrong username or password",
        status: "error",
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
        updateBlog={updateBlog}
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
            {user.username} logged in{" "}
            <button onClick={handleLogout}>logout</button>
          </p>
          {!isVisibleBlogForm && (
            <button
              data-testid="toggle-blogform-btn"
              onClick={toggleVisibilityBlogForm}
            >
              new blog
            </button>
          )}
          <ToggleDisplay isVisible={isVisibleBlogForm}>
            <BlogForm createBlog={createBlog} />
            <button onClick={toggleVisibilityBlogForm}>Cancel</button>
          </ToggleDisplay>
          <div data-testid="bloglist">{blogsToDisplay}</div>
        </>
      )}
    </div>
  )
}

export default App
