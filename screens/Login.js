import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";

export default function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        placeholder="Username"
        onChangeText={(t) => setUsername(t)}
        style={styles.textBox}
      />
      <TextInput
        value={password}
        placeholder="Password"
        onChangeText={(t) => setPassword(t)}
        style={[styles.textBox, styles.lastTextBox]}
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
