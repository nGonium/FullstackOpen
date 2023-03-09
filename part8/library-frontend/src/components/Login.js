import { useEffect, useState } from 'react';
import useLogin from '../hooks/useLogin';

export default function Login({ show, setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, result] = useLogin();

  useEffect(() => {
    if (!result.data) return;
    const token = result.data.login.value;
    setToken(token);
    localStorage.setItem('library-user-token', token);
  }, [result.data]); //eslint-disable-line

  if (!show) return null;

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ variables: { username, password } });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <label>
          username
          <input type="text" onChange={handleUsernameChange} value={username} />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            onChange={handlePasswordChange}
            value={password}
          />
        </label>
      </div>

      <button type="submit" onClick={handleLogin}>
        login
      </button>
    </>
  );
}
