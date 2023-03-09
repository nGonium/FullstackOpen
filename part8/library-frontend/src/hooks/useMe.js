const { gql, useQuery } = require('@apollo/client');

const ME = gql`
  query {
    me {
      id
      favoriteGenre
      username
    }
  }
`;

export default function useMe() {
  return useQuery(ME);
}
