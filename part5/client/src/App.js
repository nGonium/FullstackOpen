import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import FormField from './components/FormField';
import BlogForm from './components/BlogForm';
import RequestNotification from './components/RequestNotification';

const LoginForm = ({ setUser, onLogin }) => {
  const [data, setData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = data;

  const onFieldInput = (e) => {
    setData((d) => ({
      ...d,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={(e) => onLogin(e, { username, password })}>
      {Object.keys(data).map((fieldname) => (
        <FormField
          key={fieldname}
          name={fieldname}
          value={data[fieldname]}
          onFieldInput={onFieldInput}
        />
      ))}
      <button type="submit">login</button>
    </form>
  );
};

// ----------------

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(
    window.localStorage.getItem('user') &&
      JSON.parse(window.localStorage.getItem('user'))
  );
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (user !== null) {
      blogService.setToken(user.token);
    }
  }, [user]);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem('user');
    setUser(null);
  };

  const handleCreateBlog = async (e, data) => {
    e.preventDefault();
    console.log(data);
    try {
      const res = await blogService.postBlog(data);
      const { title, author } = res;
      setNotification({
        message: `a new blog "${title}" by ${author} added`,
        status: 'success',
      });
      setTimeout(() => setNotification(null), 5000);
      setBlogs((b) => [...b, res]);
    } catch (err) {
      setNotification({ message: err.response.data.error, status: 'error' });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleLogin = async (e, credentials) => {
    e.preventDefault();
    try {
      const user = await loginService.login(credentials);
      setUser(user);
      window.localStorage.setItem('user', JSON.stringify(user));
      console.log(window.localStorage.getItem('user'));
    } catch (err) {
      setNotification({
        message: 'wrong username or password',
        status: 'error',
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const blogsToDisplay = blogs.map((blog) => (
    <Blog key={blog.id} blog={blog} />
  ));

  return (
    <div>
      <h2>blogs</h2>
      {notification !== null && (
        <RequestNotification
          message={notification.message}
          status={notification.status}
        />
      )}
      {user === null ? (
        <LoginForm setUser={setUser} onLogin={handleLogin} />
      ) : (
        <>
          <p>
            {user.username} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </p>
          <h1>Create New</h1>
          {<BlogForm onCreateBlog={handleCreateBlog} />}
          {blogsToDisplay}
        </>
      )}
    </div>
  );
};

export default App;
