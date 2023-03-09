import { gql, useQuery } from '@apollo/client';

export const GET_BOOKS = gql`
  query allBooks($author: String, $genres: String) {
    allBooks(author: $author, genres: $genres) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

export default function useGetAllBooks(
  { author, genres } = { author: undefined, genres: undefined }
) {
  return useQuery(GET_BOOKS, { author, genres });
}
