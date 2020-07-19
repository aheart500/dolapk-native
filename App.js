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
import UserState from "./Contexts/User/UserState";
import { setContext } from "apollo-link-context";
import AsyncStorage from "@react-native-community/async-storage";
import { Avatar } from "react-native-elements";
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
const Stack = createStackNavigator();

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <UserState>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                title: "الصفحة الرئيسية",
                headerLeft: () => null,
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#83a0f7",
                },
              }}
            />
            <Stack.Screen
              name="List"
              component={List}
              options={{
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#83a0f7",
                },
              }}
            />
            <Stack.Screen
              name="AddOrder"
              component={AddOrder}
              options={{
                title: "إضافة طلب",
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#83a0f7",
                },
              }}
            />
            <Stack.Screen
              name="Order"
              component={Order}
              options={{
                title: "الطلب",
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#83a0f7",
                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </UserState>
    </ApolloProvider>
  );
}
