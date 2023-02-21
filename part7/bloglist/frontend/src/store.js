import { legacy_createStore as createStore } from 'redux'

const initialState = { notification: null }

function notificationReducer(state = initialState, action) {
    console.log(action)
    switch (action.type) {
        case 'notification/set':
            return { ...state, notification: action.payload }
        default:
            return state
    }
}

const store = createStore(notificationReducer)

export function setNotification(message) {
    store.dispatch({ type: 'notification/set', payload: message })
}

export default store
