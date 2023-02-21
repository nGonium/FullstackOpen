import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import UsersService from '../services/users'

const UsersList = () => {
    const result = useQuery('users', UsersService.getAll, {
        onSuccess: (data) => undefined,
    })

    if (result.isLoading)
        return (
            <div>
                <h1>Users</h1>
                <p>...loading users</p>
            </div>
        )

    const users = result.data
    return (
        <div>
            <h1>Users</h1>
            <table>
                <thead>
                    <tr>
                        <td></td>
                        <td>
                            <strong>blogs created</strong>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {users.map(({ username, blogs, id }) => (
                        <tr key={id}>
                            <td>
                                <Link to={`/users/${id}`}>{username}</Link>
                            </td>
                            <td>{blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UsersList
