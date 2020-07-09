import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";

import { useMutation } from "@apollo/react-hooks";
import {
  FINISH_ORDER,
  UNFINISH_ORDER,
  CANCEL_ORDER,
  UNCANCEL_ORDER,
  DELETE_ORDER,
} from "../graphQueries";
import { HeaderBackButton } from "@react-navigation/stack";

const Order = ({ navigation, route }) => {
  const order = route.params.order;
  const [finished, setFinished] = useState(order.finished);
  const [cancel, setCancel] = useState(order.cancelled);
  const [finishOrder] = useMutation(FINISH_ORDER);
  const [unFinishOrder] = useMutation(UNFINISH_ORDER);
  const [cancelOrder] = useMutation(CANCEL_ORDER);
  const [unCancelOrder] = useMutation(UNCANCEL_ORDER);
  const [deleteOrder] = useMutation(DELETE_ORDER);

  useEffect(() => {
    const handleBack = () => {
      navigation.navigate("List", {
        [route.params.list]: true,
        edit: true,
        order: {
          ...route.params.order,
          finished: finished,
          cancelled: cancel,
        },
      });
      return true;
    };
    navigation.setOptions({
      headerLeft: () => <HeaderBackButton onPress={handleBack} />,
    });
    BackHandler.addEventListener("hardwareBackPress", handleBack);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", handleBack);
  }, [finished, cancel, order]);

  let alignRight = false;
  if (/[\u0600-\u06FF]/.test(order.customer.name)) alignRight = true;

  const toggleFinish = () => {
    if (!finished)
      finishOrder({ variables: { id: order.id } })
        .then((res) =>
          Alert.alert(
            `${alignRight ? "تسليم الطلب" : "Finish order"}`,
            `${alignRight ? "تم تسليم الطلب" : res.data.finishOrder}`
          )
        )
        .catch((err) => console.log(err));
    if (finished)
      unFinishOrder({ variables: { id: order.id } })
        .then((res) =>
          Alert.alert(
            `${alignRight ? "تسليم الطلب" : "Finish order"}`,
            `${alignRight ? "تم إلغاء تسليم الطلب" : res.data.unFinishOrder}`
          )
        )
        .catch((err) => console.log(err));
    setFinished(!finished);
  };
  const toggleCancel = () => {
    if (!cancel)
      cancelOrder({ variables: { id: order.id } })
        .then((res) =>
          Alert.alert(
            `${alignRight ? "إلغاء الطلب" : "Cancel order"}`,
            `${alignRight ? "تم إلغاء الطلب" : res.data.cancelOrder}`
          )
        )
        .catch((err) => console.log(err));
    if (cancel)
      unCancelOrder({ variables: { id: order.id } })
        .then((res) =>
          Alert.alert(
            `${alignRight ? "إلغاء الطلب" : "Cancel order"}`,
            `${alignRight ? "تمت إعادة الطلب" : res.data.UnCancelOrder}`
          )
        )
        .catch((err) => console.log(err));
    setCancel(!cancel);
  };
  const Delete = () => {
    deleteOrder({ variables: { id: order.id } })
      .then((res) =>
        Alert.alert(
          `${alignRight ? "حذف الطلب" : "Delete order"}`,
          `${alignRight ? "تم حذف الطلب" : res.data.deleteOrder}`
        )
      )
      .catch((err) => console.log(err));
    navigation.navigate("Home", { delete: true, id: order.id });
  };
  const handleDelete = () => {
    Alert.alert(
      `${alignRight ? "حذف الطلب" : "Delete Order"}`,
      `${
        alignRight
          ? `هل انت متأكد أنك تريد حذف طلب "${order.customer.name}"؟`
          : `Are you sure you want to delete "${order.customer.name}'s"\ order?`
      }`,
      [
        {
          text: alignRight ? "نعم احذف" : "Yeah delete",
          style: "default",
          onPress: () => Delete(),
        },
        {
          text: alignRight ? "لا" : "Nah",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.inner}>
        <View style={[styles.Card, styles.customerCard]}>
          <Text style={styles.header}>{order.customer.name}</Text>
          <Text
            style={[styles.sub, { textAlign: alignRight ? "right" : "left" }]}
          >
            {order.customer.phone}
          </Text>
          <Text style={styles.sub}>{order.customer.address}</Text>
        </View>
        <Text style={[styles.sub, styles.details, styles.Card]}>
          {order.details}
        </Text>
        <Text style={[styles.sub, styles.Card, styles.notes]}>
          {order.notes
            ? order.notes
            : alignRight
            ? "لا توجد ملاحظات"
            : "No Notes"}
        </Text>
        <Text style={[styles.sub, styles.Card, styles.price]}>
          {`${order.price} EGP`}
        </Text>
        <View
          style={[
            styles.finish,
            { flexDirection: alignRight ? "row-reverse" : "row" },
            styles.Card,
          ]}
        >
          <Text style={styles.Status}>
            {alignRight ? "حالة الطلب" : "Status"}
          </Text>

          <Switch
            onValueChange={toggleFinish}
            value={finished}
            style={styles.switch}
          />
          <Text style={styles.StatusText}>
            {alignRight
              ? `${finished ? "تم التسليم" : "في انتظار التسليم"}`
              : `${finished ? "Delievered" : "Waiting"}`}
          </Text>
        </View>
        <View
          style={[
            styles.cancel,
            { flexDirection: alignRight ? "row-reverse" : "row" },
            styles.Card,
          ]}
        >
          <Text style={styles.Status}>
            {alignRight ? "ملغي؟" : "Cancelled?"}
          </Text>

          <Switch onValueChange={toggleCancel} value={cancel} />
          <Text style={styles.StatusText}>
            {alignRight
              ? `${cancel ? "ملغي" : " فعَّال"}`
              : `${cancel ? "Cancelled" : "Active"}`}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => navigation.navigate("AddOrder", { edit: true, order })}
        >
          <Text style={styles.buttonText}>
            {" "}
            {alignRight ? "تعديل الطلب" : "Edit Order"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.delete]}
          activeOpacity={0.5}
          onPress={() => handleDelete()}
        >
          <Text style={styles.buttonText}>
            {" "}
            {alignRight ? "حذف الطلب" : "Delete Order"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 5,
  },
  header: {
    fontSize: 20,
    marginVertical: 4,
  },
  sub: {
    marginVertical: 4,
  },
  customerCard: {
    backgroundColor: "white",
  },
  Card: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 10,
  },
  details: {
    backgroundColor: "#1cd997",
    fontSize: 15,
  },
  notes: {
    backgroundColor: "#ebcd60",
  },
  price: {
    backgroundColor: "#eb6560",
    fontSize: 20,
  },
  finish: {
    marginVertical: 10,
    backgroundColor: "#606ceb",
  },
  cancel: {
    backgroundColor: "#eb8760",
  },
  Status: {
    flex: 1,
    color: "white",
    fontSize: 15,
  },

  StatusText: {
    flex: 2,
    marginHorizontal: 20,
    color: "white",
    fontSize: 15,
  },
  button: {
    marginVertical: 5,
    borderRadius: 20,
    backgroundColor: "#2196F3",
    alignItems: "center",
    padding: 10,
  },
  delete: {
    backgroundColor: "#eb0e0e",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
});

export default Order;
