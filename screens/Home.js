import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { ALL_ORDERS, LAST_ORDERS } from "../graphQueries";

const Home = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const { data, loading, error, refetch } = useQuery(LAST_ORDERS, {
    variables: { limit: 10 },
  });

  useEffect(() => {
    if (data && orders.length === 0) setOrders(data.lastOrders);
  }, [data]);
  const ordersIds = orders.map((order) => order.id);
  const refresh = () => {
    refetch({ cursor: null })
      .then(({ data }) => {
        setOrders([
          ...data.lastOrders.filter((order) => !ordersIds.includes(order.id)),
          ...orders,
        ]);
      })
      .catch((err) => console.log(err));
  };
  if (loading && orders.length === 0) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  if (error) {
    return <Text> ERROR</Text>;
  }
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={orders}
        onRefresh={() => refresh()}
        onEndReached={() =>
          orders.length > 0
            ? refetch({ cursor: orders[orders.length - 1].id })
                .then((res) => {
                  res.data?.lastOrders.length > 0
                    ? setOrders([...orders, ...res.data.lastOrders])
                    : null;
                })
                .catch((err) => console.log(err))
            : null
        }
        onEndReachedThreshold={0.9}
        refreshing={orders.length === loading}
        keyExtractor={(item) => item.id}
        ListFooterComponent={() => {
          if (loading) {
            return (
              <ActivityIndicator
                style={styles.loader}
                size="large"
                color="#0000ff"
              />
            );
          }
          return null;
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => console.log("dehk")}
            >
              <Text style={styles.cardHeader}>{item.customer.name}</Text>
              <Text style={styles.cardSub}>{item.customer.address}</Text>
            </TouchableOpacity>
          );
        }}
      />
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
  flatList: {},
  card: {
    backgroundColor: "white",
    padding: 5,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  cardHeader: {
    fontSize: 20,
  },
  loader: {
    marginVertical: 10,
  },
});
export default Home;
