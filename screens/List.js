import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useQuery } from "@apollo/react-hooks";
import {
  LAST_ORDERS,
  LAST_CANCELLED_ORDERS,
  LAST_FINISHED_ORDERS,
  LAST_WAITING_ORDERS,
} from "../graphQueries";

const List = ({ navigation, route }) => {
  let query = LAST_ORDERS;
  let queryResult = "lastOrders";
  if (route.params) {
    query = route.params.cancelled
      ? LAST_CANCELLED_ORDERS
      : route.params.finished
      ? LAST_FINISHED_ORDERS
      : route.params.waiting
      ? LAST_WAITING_ORDERS
      : LAST_ORDERS;
    queryResult = route.params.cancelled
      ? "lastCancelledOrders"
      : route.params.finished
      ? "lastFinsiedOrders"
      : route.params.waiting
      ? "lastWaitingOrders"
      : "lastOrders";
  }
  const [orders, setOrders] = useState([]);
  const { data, loading, error, refetch } = useQuery(query, {
    variables: { limit: 10 },
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    if (data && orders.length === 0) setOrders(data[queryResult]);
  }, [data]);
  const filter = (arr) => {
    return arr
      ? arr.filter((order) => {
          if (route.params.all) return true;
          if (route.params.finished) return order.finished;
          if (route.params.waiting) return !order.finished;
          if (route.params.cancelled) return order.cancelled;
        })
      : [];
  };
  const refresh = () => {
    refetch({ cursor: null })
      .then((res) => {
        if (!res.data) return;

        setOrders(filter(res.data[queryResult]));
      })
      .catch((err) => console.log(err));
  };

  const loadMore = () => {
    orders.length > 0
      ? refetch({ cursor: orders[orders.length - 1].id })
          .then((res) => {
            res.data
              ? res.data[queryResult].length > 0
                ? setOrders(filter([...orders, ...res.data[queryResult]]))
                : null
              : null;
          })
          .catch((err) => console.log(err))
      : null;
  };

  if (route.params && route.params.delete) {
    setOrders(orders.filter((order) => order.id !== route.params.id));
    route.params = { ...route.params, delete: false };
  }

  if (route.params && route.params.edit) {
    setOrders(
      orders.map((order) =>
        order.id !== route.params.order.id ? order : route.params.order
      )
    );
    route.params = { ...route.params, edit: false };
  }

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
        data={filter(orders)}
        onRefresh={() => refresh()}
        onEndReached={() => loadMore()}
        onEndReachedThreshold={0.98}
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
              onPress={() =>
                navigation.navigate("Order", {
                  order: item,
                  list: route.params ? Object.keys(route.params)[0] : "",
                })
              }
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
export default List;
