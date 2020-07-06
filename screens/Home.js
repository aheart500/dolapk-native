import React from "react";
import { View, Text, Button } from "react-native";
const Home = ({ navigation }) => {
  return (
    <View>
      <Text>Hi Nasser</Text>
      <Button title="Logout" onPress={() => navigation.navigate("Login")} />
    </View>
  );
};

export default Home;
