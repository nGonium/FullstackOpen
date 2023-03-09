const { gql, useMutation } = require('@apollo/client');

const LOGIN = gql`
  mutation makeLogin($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export default function useLogin() {
  // TODO: refetch query me
  return useMutation(LOGIN);
}
