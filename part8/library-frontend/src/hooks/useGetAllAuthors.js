import { useQuery, gql } from '@apollo/client';

export const GET_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`;

export default function useGetAllAuthors() {
  return useQuery(GET_AUTHORS);
}
