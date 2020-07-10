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
const Stack = createStackNavigator();
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://dolapk.herokuapp.com/graphql",
  }),
});

export default function App() {
  return (
    <UserState>
      <ApolloProvider client={client}>
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
      </ApolloProvider>
    </UserState>
  );
}
