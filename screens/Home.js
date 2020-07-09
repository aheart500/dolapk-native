import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("List", { all: true })}
        style={styles.Card}
      >
        <Text style={styles.CardText}>ALL</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("List", { waiting: true })}
        style={styles.Card}
      >
        <Text style={styles.CardText}>Waiting</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("List", { finished: true })}
        style={styles.Card}
      >
        <Text style={styles.CardText}>Finished</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("List", { cancelled: true })}
        style={styles.Card}
      >
        <Text style={styles.CardText}>Cancelled</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddOrder")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Card: {
    backgroundColor: "white",
    padding: 10,
  },
  CardText: {
    fontSize: 20,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
    backgroundColor: "#ffff40",
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: {
    fontSize: 40,
    color: "black",
  },
});
export default Home;
