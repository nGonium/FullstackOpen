import { gql, useQuery } from '@apollo/client';

export const GET_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
    }
  }
`;

export default function useGetAllBooks() {
  return useQuery(GET_BOOKS);
}
