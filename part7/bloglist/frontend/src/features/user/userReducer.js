export const initialState = null

export default function userReducer(state, action) {
    const { type, payload } = action
    switch (type) {
        case 'login/success':
            return { token: payload.token, name: payload.username }
        case 'login/error':
            return { ...state }
        case 'logout':
            return initialState
        default:
            throw new Error(`Invalid action "${type}"`)
    }
}
