import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/Login";
import Home from "./screens/Home";
import AddOrder from "./screens/AddOrder";
import Order from "./screens/Order";
import List from "./screens/List";
import React, { useContext } from "react";
import UserContext from "./Contexts/User/UserContext";
const Stack = createStackNavigator();
const Routes = () => {
  const { userState } = useContext(UserContext);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!userState.isLoggedIn && (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}
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
  );
};

export default Routes;
