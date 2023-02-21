import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { QueryClientProvider, QueryClient } from 'react-query'
import { UserContextProvider } from './features/user/UserContext'

const queryClient = new QueryClient()

ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <UserContextProvider>
            <App />
        </UserContextProvider>
    </QueryClientProvider>,
    document.getElementById('root')
)
