import UserContext from "./UserContext";
import UserReducer from "./UserReducer";
import React, { useReducer, useEffect, useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function UserState({ children }) {
  const [loading, setLoading] = useState(true);
  const initialState = {
    isLoggedIn: false,
    name: "",
  };
  useEffect(() => {
    AsyncStorage.getItem("isLoggedIn")
      .then((res) => (JSON.parse(res) ? dispatch({ type: "LOGIN" }) : null))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const [state, dispatch] = useReducer(UserReducer, initialState);
  const Login = async () => {
    try {
      await AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));
    } catch (e) {
      console.log(e);
    }

    dispatch({ type: "LOGIN" });
  };
  const Logout = async () => {
    try {
      await AsyncStorage.setItem("isLoggedIn", JSON.stringify(false));
    } catch (e) {
      console.log(e);
    }

    dispatch({ type: "LOGOUT" });
  };

  return (
    <UserContext.Provider
      value={{
        userState: state,
        Login,
        Logout,
      }}
    >
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#83a0f7" />
        </View>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
}
