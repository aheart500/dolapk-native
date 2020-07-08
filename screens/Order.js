import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
} from "react-native";
const Order = ({ navigation, route }) => {
  const order = route.params;
  const [finished, setFinished] = useState(order.finished);
  const [cancel, setCancel] = useState(order.cancelled);
  const toggleFinish = () => {
    setFinished(!finished);
  };
  const toggleCancel = () => {
    setCancel(!cancel);
  };

  console.log(order);

  let alignRight = false;
  if (/[\u0600-\u06FF]/.test(order.customer.name)) alignRight = true;
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
        <TouchableOpacity style={styles.button} activeOpacity={0.5}>
          <Text style={styles.buttonText}>
            {" "}
            {alignRight ? "تعديل الطلب" : "Edit Order"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.delete]}
          activeOpacity={0.5}
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
