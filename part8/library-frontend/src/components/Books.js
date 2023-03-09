import { useState } from 'react';
import useGetAllBooks from '../hooks/useGetAllBooks';

const Books = (props) => {
  const result = useGetAllBooks();
  const [genreFilter, setGenreFilter] = useState(null);

  if (!props.show) {
    return null;
  }
  const books = result.loading ? [] : result.data.allBooks;

  const genres = [
    ...new Set(
      books.reduce((prev, current) => prev.concat(current.genres), [])
    ),
  ];

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((book) =>
              genreFilter ? book.genres.includes(genreFilter) : true
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
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setGenreFilter(genre)}>
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
