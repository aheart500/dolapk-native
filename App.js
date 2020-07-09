import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import Login from "./screens/Login";
import Home from "./screens/Home";
import AddOrder from "./screens/AddOrder";
import Order from "./screens/Order";
import List from "./screens/List";

const Stack = createStackNavigator();
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://dolapk.herokuapp.com/graphql",
  }),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerLeft: () => null,
              headerTintColor: "#000",
              headerStyle: {
                backgroundColor: "#ffff40",
              },
            }}
          />
          <Stack.Screen
            name="List"
            component={List}
            options={{
              headerTintColor: "#000",
              headerStyle: {
                backgroundColor: "#ffff40",
              },
            }}
          />
          <Stack.Screen
            name="AddOrder"
            component={AddOrder}
            options={{
              title: "Add Order",
              headerTintColor: "#000",
              headerStyle: {
                backgroundColor: "#ffff40",
              },
            }}
          />
          <Stack.Screen
            name="Order"
            component={Order}
            options={{
              headerTintColor: "#000",
              headerStyle: {
                backgroundColor: "#ffff40",
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
