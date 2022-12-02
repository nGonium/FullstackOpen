import { useState } from 'react';
import FormField from './FormField';

const LoginForm = ({ setUser, onLogin }) => {
  const [data, setData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = data;

  const onFieldInput = (e) => {
    const { name, value } = e.target;
    setData((d) => ({
      ...d,
      [name]: value,
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

export default LoginForm;
