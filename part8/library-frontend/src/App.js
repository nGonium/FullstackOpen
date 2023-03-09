import { useApolloClient } from '@apollo/client';
import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import Login from './components/Login';
import NewBook from './components/NewBook';
import Recommended from './components/Recommended';

const App = () => {
  const [token, setToken] = useState(() =>
    localStorage.getItem('library-user-token')
  );
  const [page, setPage] = useState('books');
  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommended')}>recommended</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Login show={page === 'login'} setToken={setToken} />

      <Recommended show={page === 'recommended'} />
    </div>
  );
};

export default App;
