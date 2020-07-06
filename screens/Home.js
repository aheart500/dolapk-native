import React from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const allOrders = gql`
  query {
    allOrders {
      id
      customer {
        name
        phone
        address
      }
    }
  }
`;

const Home = ({ navigation }) => {
  const result = useQuery(allOrders);
  if (result.loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <View>
      <Text>Hi Nasser</Text>
      <Button title="Logout" onPress={() => navigation.navigate("Login")} />
    </View>
  );
};

export default Home;
