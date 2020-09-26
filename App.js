import React from "react";

import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";

import UserState from "./Contexts/User/UserState";
import { setContext } from "apollo-link-context";
import AsyncStorage from "@react-native-community/async-storage";
import Routes from "./Routes";

const authLink = setContext(async (_, { headers }) => {
  let token = await AsyncStorage.getItem("loggedUser");

  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${JSON.parse(token).token}` : null,
    },
  };
});
const httpLink = new HttpLink({
  uri: "http://dolapk1.herokuapp.com/graphql",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <UserState>
        <Routes />
      </UserState>
    </ApolloProvider>
  );
}
