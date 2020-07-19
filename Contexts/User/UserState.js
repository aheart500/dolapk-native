import UserContext from "./UserContext";
import UserReducer from "./UserReducer";
import React, { useReducer, useEffect, useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { View, ActivityIndicator } from "react-native";
import { useMutation } from "@apollo/react-hooks";
import { LOGIN } from "../../GraphQL/User";
export default function UserState({ children }) {
  const [loading, setLoading] = useState(true);
  const initialState = {
    isLoggedIn: false,
    name: "",
    img: "",
    token: "",
  };
  const [GraphLogin] = useMutation(LOGIN);
  useEffect(() => {
    AsyncStorage.getItem("loggedUser")
      .then((res) => JSON.parse(res))
      .then((res) =>
        res
          ? dispatch({
              type: "LOGIN",
              name: res.name,
              token: res.token,
              img: res.img,
            })
          : null
      )
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const [state, dispatch] = useReducer(UserReducer, initialState);
  const Login = async (username, password) => {
    const response = await GraphLogin({
      variables: { username, password },
    });
    const { name, value: token, img } = response.data.login;
    await AsyncStorage.setItem(
      "loggedUser",
      JSON.stringify({ name, token, img })
    );
    dispatch({
      type: "LOGIN",
      name: name,
      token: token,
      img: img,
    });
  };
  const Logout = async () => {
    try {
      await AsyncStorage.removeItem("loggedUser");
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
