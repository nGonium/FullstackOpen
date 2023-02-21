import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import BlogsService from '../services/blogs'

const UserHome = ({ query }) => {
    const { id: userId } = useParams()
    if (query.isLoading) return <div>Loading user data...</div>
    const userBlogs = query.data.filter((blog) => blog.user.id === userId)
    const username = userBlogs[0].user.username
    return (
        <div>
            <h1>{username}</h1>
            <strong>added blogs</strong>
            <ul>
                {userBlogs.map((b) => (
                    <li key={b.id}>{b.title}</li>
                ))}
            </ul>
        </div>
    )
}

export default UserHome
