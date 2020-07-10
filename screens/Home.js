import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";

import UserContext from "../Contexts/User/UserContext";
const Home = ({ navigation }) => {
  const { userState, Logout } = useContext(UserContext);
  if (!userState.isLoggedIn) {
    navigation.navigate("Login");
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity
          onPress={() => navigation.navigate("List", { all: true })}
          style={styles.Card}
        >
          <Text style={styles.CardText}>جميع الطلبات</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("List", { waiting: true })}
          style={styles.Card}
        >
          <Text style={styles.CardText}>الطلبات الحالية</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("List", { finished: true })}
          style={styles.Card}
        >
          <Text style={styles.CardText}>الطلبات المنتهية</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("List", { cancelled: true })}
          style={styles.Card}
        >
          <Text style={styles.CardText}>الطلبات الملغية</Text>
        </TouchableOpacity>
      </ScrollView>
      <Button title="Logout" style={{ margin: 10 }} onPress={() => Logout()} />
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
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  CardText: {
    fontSize: 20,
  },
  fab: {
    position: "absolute",
    bottom: 40,
    right: 20,
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
    backgroundColor: "#83a0f7",
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: {
    fontSize: 40,
    color: "white",
  },
});
export default Home;
