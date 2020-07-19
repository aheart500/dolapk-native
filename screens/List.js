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
import { LAST_ORDERS } from "../GraphQL/Orders";
import { SearchBar } from "react-native-elements";
import Toolbar from "../components/Toolbar";
const List = ({ navigation, route }) => {
  let category = "";
  if (route.params) {
    category = route.params.cancelled
      ? "cancelled"
      : route.params.finished
      ? "finished"
      : route.params.waiting
      ? "waiting"
      : "";
  }
  const [orders, setOrders] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const { data, loading, error, refetch, called } = useQuery(LAST_ORDERS, {
    variables: { limit: 10, category },
  });
  const handleSearch = (text) => {
    setSearch(text);
    refetch({ cursor: null, search: text === "" ? "" : text })
      .then((res) => {
        if (!res.data) return;

        setOrders(res.data.lastOrders);
      })
      .catch((err) => console.log(err));
  };

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
    if (data && orders.length === 0) setOrders(data.lastOrders);
  }, [data]);
  useEffect(() => {
    if (selected.length > 0) {
      setSelectionMode(true);
    } else {
      setSelectionMode(false);
    }
  }, [selected]);

  const refresh = () => {
    refetch({ cursor: null })
      .then((res) => {
        if (!res.data) return;

        setOrders(res.data.lastOrders);
      })
      .catch((err) => console.log(err));
  };
  const isSelected = (order) => selected.includes(order.id);
  const loadMore = () => {
    orders.length > 0
      ? refetch({ cursor: orders[orders.length - 1].id })
          .then((res) => {
            res.data
              ? res.data.lastOrders.length > 0
                ? setOrders([...orders, ...res.data.lastOrders])
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

  if (loading && !called) {
    return (
      <ActivityIndicator
        size="large"
        style={{ marginVertical: 10 }}
        color="#0000ff"
      />
    );
  }
  return (
    <View style={styles.container}>
      {error && (
        <Text style={{ margin: 10, color: "red", fontSize: 20 }}>
          {" "}
          Network Error.
        </Text>
      )}
      {!selectionMode ? (
        <Text style={{ alignSelf: "center", margin: 5 }}>
          <Text style={{ color: "#eb4034" }}>Red</Text> for cancelled.
          <Text style={{ color: "#7bbf5e" }}> Green</Text> for done.
        </Text>
      ) : (
        <Text style={{ alignSelf: "center", margin: 5 }}>
          {selected.length} orders selected
        </Text>
      )}
      <Toolbar
        selected={selected}
        setSelected={setSelected}
        refetch={() => refetch({ cursor: null })}
      />

      <FlatList
        style={styles.flatList}
        data={orders}
        onRefresh={() => refresh()}
        onEndReached={() => loadMore()}
        onEndReachedThreshold={0.5}
        refreshing={orders.length === loading}
        ListHeaderComponent={
          <SearchBar
            placeholder="Search"
            lightTheme
            containerStyle={{
              marginVertical: 10,
            }}
            inputStyle={{
              paddingHorizontal: 5,
            }}
            onChangeText={handleSearch}
            value={search}
          />
        }
        keyExtractor={(item) => item.id}
        ListFooterComponent={() => {
          return data && data.lastOrders.length > 0 ? (
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
                isSelected(item)
                  ? styles.selected
                  : item.cancelled
                  ? styles.cancelled
                  : item.status === "تم التسليم"
                  ? styles.finished
                  : styles.waiting,
              ]}
              onLongPress={() => {
                isSelected(item)
                  ? setSelected(selected.filter((i) => i !== item.id))
                  : setSelected(selected.concat(item.id));
              }}
              onPress={() =>
                selectionMode
                  ? isSelected(item)
                    ? setSelected(selected.filter((i) => i !== item.id))
                    : setSelected(selected.concat(item.id))
                  : navigation.navigate("Order", {
                      order: item,
                      list: route.params ? Object.keys(route.params)[0] : "",
                    })
              }
            >
              <Text style={styles.cardHeader}>{item.customer.name}</Text>
              <Text style={styles.cardSub}>{item.customer.address}</Text>
              <Text style={{ textAlign: arabic ? "left" : "right" }}>{`${
                item.price.order
              } + ${item.price.shipment} = ${
                item.price.order + item.price.shipment
              } EGP`}</Text>
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
  selected: {
    backgroundColor: "#fa594d",
  },
});
export default List;
