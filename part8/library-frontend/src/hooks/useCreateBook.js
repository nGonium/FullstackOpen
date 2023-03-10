import { gql, useMutation } from '@apollo/client';
import { updateCache } from './useBookAdded';
import { GET_AUTHORS } from './useGetAllAuthors';
import { GET_BOOKS } from './useGetAllBooks';

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      id
    }
  }
`;

export default function useCreateBook() {
  return useMutation(CREATE_BOOK, {
    // refetchQueries: [{ query: GET_AUTHORS }, { query: GET_BOOKS }],
    onError: (error) => console.warn(error),
    update: (cache, response) => {
      updateCache(cache, { query: GET_BOOKS }, response.data.addBook);
    },
  });
}
