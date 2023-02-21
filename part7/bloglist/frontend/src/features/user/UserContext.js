import { createContext, useEffect, useReducer } from 'react'
import userReducer, { initialState } from './userReducer'
import loginService from '../../services/login'
import userService from '../../services/user'

const UserContext = createContext(initialState)

export const UserContextProvider = ({ children }) => {
    const [user, userDispatch] = useReducer(userReducer, null)

    useEffect(() => {
        const userFromStorage = userService.getUser()
        if (userFromStorage) {
            userDispatch({ type: 'login/success', payload: userFromStorage })
        }
    }, [])

    const login = async (username, password) => {
        loginService
            .login({
                username,
                password,
            })
            .then((data) => {
                userDispatch({
                    type: 'login/success',
                    payload: { ...data },
                })
                // setUser(user)
                userService.setUser(data)
                // notify(`${data.name} logged in!`)
                console.log(`${data.username} logged in!`)
            })
            .catch(() => {
                console.warn('wrong username/password', 'alert')
                // notify('wrong username/password', 'alert')
            })
    }

    const logout = () => {
        userDispatch({ type: 'logout' })
        // setUser(null)
        userService.clearUser()
        // notify('good bye!')
        console.log('good bye!')
    }

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext
