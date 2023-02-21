import { useState, useEffect, useRef, useReducer, useContext } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import UserHome from './pages/UserHome'
import UsersList from './pages/UsersList'
import UserContext from './features/user/UserContext'
import BlogView from './pages/BlogView'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/user'

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return { ...action.payload }
        case 'RESET':
            return null
        default:
            return state
    }
}

const App = () => {
    // const [blogs, setBlogs] = useState([])
    const queryClient = useQueryClient()
    const blogQuery = useQuery('blogs', blogService.getAll)
    // const [user, setUser] = useState(null)
    const [notification, dispatchNotification] = useReducer(
        notificationReducer,
        null
    )
    const blogFormRef = useRef()

    const { user, login, logout } = useContext(UserContext)

    const notify = (message, type = 'info') => {
        dispatchNotification({ type: 'SET', payload: { message, type } })
        setTimeout(() => {
            dispatchNotification({ type: 'RESET' })
        }, 5000)
    }

    const blogs = blogQuery.data

    const newBlogMutation = useMutation(blogService.create, {
        onSuccess: (data) => {
            notify(`a new blog '${data.title}' by ${data.author} added`)
            blogFormRef.current.toggleVisibility()
            queryClient.invalidateQueries('blogs')
        },
        onError: (error) => {
            notify(
                'creating a blog failed: ' + error.response.data.error,
                'alert'
            )
        },
    })

    const likeBlogMutation = useMutation(
        (id) => {
            const toLike = blogs.find((b) => b.id === id)
            const liked = {
                ...toLike,
                likes: (toLike.likes || 0) + 1,
                user: toLike.user.id,
            }

            return blogService.update(liked.id, liked)
        },
        {
            onSuccess: (data) => {
                notify(`you liked '${data.title}' by ${data.author}`)
                // const updatedBlogs = blogs
                //     .map((b) => (b.id === id ? updatedBlog : b))
                //     .sort(byLikes)
                queryClient.invalidateQueries('blogs')
            },
        }
    )

    const removeBlogMutation = useMutation(
        async (id) => {
            const toRemove = blogs.find((b) => b.id === id)
            const ok = window.confirm(
                `remove '${toRemove.title}' by ${toRemove.author}?`
            )

            if (!ok) {
                return
            }

            return blogService.remove(id)
        },
        {
            onSuccess: () => queryClient.invalidateQueries('blogs'),
        }
    )

    const handleCreateBlog = newBlogMutation.mutate
    const handleLikeBlog = likeBlogMutation.mutate
    const handleRemoveBlog = removeBlogMutation.mutate

    if (user === null) {
        return (
            <>
                <Notification notification={notification} />
                <LoginForm onLogin={login} />
            </>
        )
    }

    return (
        <BrowserRouter>
            <div>
                <nav>
                    <NavLink to="/">blogs</NavLink>
                    <NavLink to="/users">users</NavLink>
                    {user.name} logged in
                    <button onClick={logout}>logout</button>
                </nav>
                <h2>blogs</h2>
                <Notification notification={notification} />
                <Routes>
                    <Route
                        path="/users/:id"
                        element={<UserHome query={blogQuery} />}
                    />
                    <Route path="/users" element=<UsersList /> />
                    <Route
                        path="/blogs/:id"
                        element=<BlogView
                            onLikeBlog={handleLikeBlog}
                            query={blogQuery}
                        />
                    />
                    <Route
                        path="/"
                        element={
                            <>
                                <Togglable
                                    buttonLabel="new note"
                                    ref={blogFormRef}
                                >
                                    <NewBlogForm onCreate={handleCreateBlog} />
                                </Togglable>
                                {blogQuery.isLoading ? (
                                    <div>...loading</div>
                                ) : (
                                    <div id="blogs">
                                        {blogs.map((blog) => (
                                            <Blog
                                                key={blog.id}
                                                blog={blog}
                                                likeBlog={handleLikeBlog}
                                                removeBlog={handleRemoveBlog}
                                                user={user}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
