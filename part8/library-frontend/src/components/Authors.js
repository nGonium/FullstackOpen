import useGetAllAuthors from '../hooks/useGetAllAuthors';
import SetAuthorBirthyear from './SetAuthorBirthyear';

const Authors = (props) => {
  const result = useGetAllAuthors();

  if (!props.show) {
    return null;
  }
  const authors = result.loading ? [] : result.data.allAuthors;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetAuthorBirthyear authors={authors} />
    </div>
  );
};

export default Authors;
