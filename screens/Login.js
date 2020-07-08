import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";

export default function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const passwordInput = useRef();
  const handleSubmit = () => {
    if (password !== "" && username !== "") {
      if (username === "nasser" && password === "123") {
        navigation.navigate("Home");
      } else {
        Alert.alert(
          "Wrong credintials",
          "You entered wrong username or password"
        );
      }
    } else {
      Alert.alert(
        "Wrong credintials",
        "You should provide at least your username or password"
      );
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}> Dolapk</Text>
      <TextInput
        value={username}
        autoFocus={true}
        placeholder="Username"
        onChangeText={(t) => setUsername(t)}
        style={styles.textBox}
        onSubmitEditing={() => passwordInput.current.focus()}
        returnKeyType="next"
      />
      <TextInput
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(t) => setPassword(t)}
        onSubmitEditing={handleSubmit}
        style={[styles.textBox, styles.lastTextBox]}
        ref={passwordInput}
      />
      <Button title="Login" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff40",
    justifyContent: "center",
    alignItems: "center",
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
