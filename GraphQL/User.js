import gql from "graphql-tag";

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
      name
      img
    }
  }
`;
export const CREATE_ADMIN = gql`
  mutation createAdmin(
    $username: String!
    $password: string!
    $name: String!
    $img: String
  ) {
    createAdmin(
      username: $username
      password: $password
      name: $name
      img: $img
    ) {
      name
      username
    }
  }
`;
