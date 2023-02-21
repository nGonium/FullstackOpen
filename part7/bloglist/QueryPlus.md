## TLDR

```js
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query';

// Async functions using server API
import { getTodos, postTodo } from '../my-api';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  );
}

function Todos() {
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const query = useQuery(
    'todos',
    getTodos,
    // Options
    {}
  );

  // Mutations
  const mutation = useMutation(postTodo, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('todos');
    },
  });

  // Status-conditional rendering, also see query.status
  if (query.isLoading) return <div>Loading ...</div>;

  if (query.isError) return <div>Error {query.error}</div>;

  return (
    <div>
      <ul>
        {query.data.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          });
        }}
      >
        Add Todo
      </button>
    </div>
  );
}

render(<App />, document.getElementById('root'));
```

## Introduction

React query can be used to store and manage data from the server

```
npm install react-query
```

In _index.js_, instantiate a `QueryClient` and wrap `<App />` inside a `QueryClientProvider`

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';

import App from './App';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

## Retrieving data from server

Within a component, the `useQuery` hook can be used, which takes a name for the data to retrieve and a query: a function which returns a promise that resolves to the retrieved data (e.g. `fetch`). The object returned by `useQuery` contains fields indicating its status (`status`, `isLoading`, `isSuccess` etc.) and response payload (`data`). This allows us to easily render an application according to the current status of a request and additional payload.

`useQuery` can be supplied with a second argument: the `options` object. For example, `refetchOnWindowsFocus: false` will prevent the default behaviour where `useQuery` runs the query whenever focus changes.

```js
import { useQuery } from 'react-query'
import axios from 'axios'

const App = () => {
  // ...

  const result = useQuery(
    'notes',
    () => axios.get('http://localhost:3001/notes').then(res => res.data)
  )
  console.log(result)

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  const notes = result.data

  return (
    // ...
  )
```

## Submitting data to server

The `useMutation` hook takes a function that returns a promise to post to the server (the mutation function) and returns a mutation object. This object has a `mutate` function. When called, arguments to `mutate` will be passed to the previously supplied mutation function.

## Synchronizing data and invalidating query

Additionally, the second argument to `useMutation` is an `options` object. We can supply a callback function to the `onSuccess` property of this object, which is called when the mutation resolves successfully. Use the `invalidateQueries` function supplied with the key of query to invalidate. Upon invalidation, the query will be re-run.

We can also manually update the query state. Instead of using `invalidateQueries`, use `getQueryData` to get the invalid data, create a copy of that data and update it as required, then use `setQueryData` to set it to this new state. If the update made is incorrect, the data may get out of sync, but it requires fewer requests to the server.
