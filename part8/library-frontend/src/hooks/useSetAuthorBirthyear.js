import { gql, useMutation } from '@apollo/client';
import { GET_AUTHORS } from './useGetAllAuthors';

export const SET_AUTHOR_BIRTHYEAR = gql`
  mutation setAuthorBirthyear($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      id
    }
  }
`;

export default function useSetAuthorBirthyear() {
  return useMutation(SET_AUTHOR_BIRTHYEAR, {
    refetchQueries: [{ query: GET_AUTHORS }],
  });
}
