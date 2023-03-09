import useGetAllBooks from '../hooks/useGetAllBooks';
import useMe from '../hooks/useMe';

const Recommended = ({ show }) => {
  const meQuery = useMe();
  const result = useGetAllBooks();

  if (!show) {
    return null;
  }
  const books = result.loading ? [] : result.data.allBooks;
  const favoriteGenre = result.loading ? null : meQuery.data.me.favoriteGenre;

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre{' '}
        {<strong>{favoriteGenre}</strong> ?? <em>...loading</em>}
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((book) =>
              favoriteGenre ? book.genres.includes(favoriteGenre) : true
            )
            .map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommended;
