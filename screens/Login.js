import React, { useState, useRef, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ImageBackground,
} from "react-native";
import { Input } from "react-native-elements";
import UserContext from "../Contexts/User/UserContext";

export default function Login({ navigation }) {
  const { userState, Login } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordInput = useRef();
  if (userState.isLoggedIn) {
    navigation.navigate("Home");
  }
  const handleSubmit = async () => {
    setLoading(true);
    if (password !== "" && username !== "") {
      try {
        await Login(username, password);

        navigation.navigate("Home");
      } catch (e) {
        console.log(e);
        Alert.alert(
          "Wrong credintials",
          "You entered wrong username or password"
        );
      }
    } else {
      Alert.alert(
        "Missing Fields",
        "You should provide at least your username and password"
      );
    }
    setLoading(false);
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/back1.jpg")}
        style={styles.background}
      >
        <View style={styles.inner}>
          <Text style={styles.headerText}>Dolapk</Text>
          <Input
            label="Username"
            value={username}
            autoFocus={true}
            placeholder="Please enter your username"
            onChangeText={(t) => setUsername(t)}
            style={styles.textBox}
            onSubmitEditing={() => passwordInput.current.focus()}
            returnKeyType="next"
          />
          <Input
            value={password}
            label="Password"
            placeholder="Please enter your password"
            secureTextEntry={true}
            onChangeText={(t) => setPassword(t)}
            onSubmitEditing={handleSubmit}
            style={[styles.textBox, styles.lastTextBox]}
            ref={passwordInput}
          />
          <Button title="Login" onPress={handleSubmit} disabled={loading} />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    borderRadius: 15,
    backgroundColor: "rgba(247, 203, 82,0.8)",
    padding: 15,
    width: "90%",
  },
  headerText: {
    fontSize: 20,
    margin: 10,
  },
  textBox: {
    width: "90%",
    padding: 10,
    borderBottomWidth: 1,
  },
  lastTextBox: {
    marginBottom: 20,
  },
});
