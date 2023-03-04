import { useState } from 'react';
import useSetAuthorBirthyear from '../hooks/useSetAuthorBirthyear';

export default function SetAuthorBirthyear({ authors }) {
  const [setAuthorBirthyear] = useSetAuthorBirthyear();
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');

  const handleNameChange = (e) => setName(e.target.value);
  const handleBornChange = (e) => setBorn(e.target.value);
  const submit = () => {
    setAuthorBirthyear({
      variables: {
        name,
        setBornTo: parseInt(born),
      },
    });
  };

  return (
    <>
      <h2>Set birthyear</h2>
      <select value={name} onChange={handleNameChange}>
        <option value=""></option>
        {authors.map((a) => (
          <option key={a.id} value={a.name}>
            {a.name}
          </option>
        ))}
      </select>
      <label>
        born
        <input type="number" value={born} onChange={handleBornChange} />
      </label>
      <button onClick={submit}>update author</button>
    </>
  );
}
