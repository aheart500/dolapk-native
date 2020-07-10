import React, { useEffect, useState, useLayoutEffect } from "react";
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
  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params
        ? `${
            route.params.cancelled
              ? "قائمة الطلبات الملغية"
              : route.params.finished
              ? "قائمة الطلبات المنتهية"
              : route.params.waiting
              ? "قائمة الطلبات الحالية"
              : "قائمة جميع الطلبات"
          }`
        : "قائمة",
    });
  }, []);
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
    return (
      <ActivityIndicator
        size="large"
        style={{ marginVertical: 10 }}
        color="#0000ff"
      />
    );
  }
  if (error) {
    return (
      <Text style={{ margin: 10, color: "red", fontSize: 20 }}>
        {" "}
        Network Error.
      </Text>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={{ alignSelf: "center", margin: 5 }}>
        <Text style={{ color: "#eb4034" }}>Red</Text> for cancelled.
        <Text style={{ color: "#7bbf5e" }}> Green</Text> for done.
      </Text>
      <FlatList
        style={styles.flatList}
        data={filter(orders)}
        onRefresh={() => refresh()}
        onEndReached={() => loadMore()}
        onEndReachedThreshold={0.5}
        refreshing={orders.length === loading}
        keyExtractor={(item) => item.id}
        ListFooterComponent={() => {
          return data && data[queryResult].length > 0 ? (
            <ActivityIndicator
              style={styles.loader}
              size="large"
              color="#0000ff"
            />
          ) : null;
        }}
        renderItem={({ item }) => {
          let arabic = false;
          if (/[\u0600-\u06FF]/.test(item.customer.name)) arabic = true;
          return (
            <TouchableOpacity
              style={[
                styles.card,
                item.cancelled
                  ? styles.cancelled
                  : item.finished
                  ? styles.finished
                  : styles.waiting,
              ]}
              onPress={() =>
                navigation.navigate("Order", {
                  order: item,
                  list: route.params ? Object.keys(route.params)[0] : "",
                })
              }
            >
              <Text style={styles.cardHeader}>{item.customer.name}</Text>
              <Text style={styles.cardSub}>{item.customer.address}</Text>
              <Text
                style={{ textAlign: arabic ? "left" : "right" }}
              >{`${item.price} EGP`}</Text>
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
    backgroundColor: "#edeff5",
  },
  fab: {
    position: "absolute",
    bottom: 20,
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
  flatList: {},
  card: {
    borderRadius: 10,
    padding: 8,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  cardHeader: {
    fontSize: 20,
  },
  loader: {
    marginVertical: 10,
  },
  finished: {
    backgroundColor: "#7bbf5e",
  },
  cancelled: {
    backgroundColor: "#eb4034",
  },
  waiting: {
    backgroundColor: "white",
  },
});
export default List;
