import { gql, useApolloClient, useSubscription } from '@apollo/client';
import { GET_BOOKS } from './useGetAllBooks';

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      id
      title
      author
      published
      genres
    }
  }
`;

export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same person twice
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.name;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    };
  });
};

export default function useBookAdded() {
  const client = useApolloClient();
  return useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      console.log(addedBook);
      alert(`Book added: ${addedBook.title}`);
      updateCache(client.cache, { query: GET_BOOKS }, addedBook);
      // client.cache.updateQuery({ query: GET_BOOKS }, ({ allBooks }) => ({
      //   allBooks: allBooks.concat(addedBook),
      // }));
    },
  });
}
