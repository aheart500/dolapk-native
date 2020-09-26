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
  I18nManager,
  Linking,
} from "react-native";
import { Picker } from "@react-native-community/picker";
import { useMutation } from "@apollo/react-hooks";
import {
  UPDATE_ORDERS,
  CANCEL_ORDERS,
  UNCANCEL_ORDERS,
  DELETE_ORDERS,
} from "../GraphQL/Orders";
import { HeaderBackButton } from "@react-navigation/stack";

const Order = ({ navigation, route }) => {
  const order = route.params.order;

  const [status, setStatus] = useState(order.status);
  const [cancel, setCancel] = useState(order.cancelled);
  const [updateStatus] = useMutation(UPDATE_ORDERS);
  const [cancelOrder] = useMutation(CANCEL_ORDERS);
  const [unCancelOrder] = useMutation(UNCANCEL_ORDERS);
  const [deleteOrder] = useMutation(DELETE_ORDERS);

  useEffect(() => {
    const handleBack = () => {
      navigation.navigate("List", {
        [route.params.list]: true,
        edit: true,
        order: {
          ...route.params.order,
          status: status,
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
  }, [status, cancel, order]);

  let alignRight = false;
  if (/[\u0600-\u06FF]/.test(order.customer.name)) alignRight = true;

  const changeStatus = (newStatus) => {
    updateStatus({
      variables: { ids: [order.id], status: newStatus },
    })
      .then((res) =>
        Alert.alert(
          `${alignRight ? "تحديث الحالة" : "Update Status"}`,
          `${alignRight ? "تم تحديث حالة الطلب" : res.data.updateOrders}`
        )
      )
      .catch((err) => console.log(err));
  };

  const toggleCancel = () => {
    if (!cancel)
      cancelOrder({ variables: { ids: [order.id] } })
        .then((res) =>
          Alert.alert(
            `${alignRight ? "إلغاء الطلب" : "Cancel order"}`,
            `${alignRight ? "تم إلغاء الطلب" : res.data.cancelOrders}`
          )
        )
        .catch((err) => console.log(err));
    if (cancel)
      unCancelOrder({ variables: { ids: [order.id] } })
        .then((res) =>
          Alert.alert(
            `${alignRight ? "إلغاء الطلب" : "Cancel order"}`,
            `${alignRight ? "تمت إعادة الطلب" : res.data.unCancelOrders}`
          )
        )
        .catch((err) => console.log(err));
    setCancel(!cancel);
  };
  const Delete = () => {
    deleteOrder({ variables: { ids: [order.id] } })
      .then((res) =>
        Alert.alert(
          `${alignRight ? "حذف الطلب" : "Delete order"}`,
          `${alignRight ? "تم حذف الطلب" : res.data.deleteOrders}`
        )
      )
      .catch((err) => console.log(err));

    navigation.navigate("List", {
      [route.params.list]: true,
      delete: true,
      id: order.id,
    });
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
  const direction_ROW = I18nManager.isRTL ? "row-reverse" : "row";
  const direction_ROWREVERSE = !I18nManager.isRTL ? "row-reverse" : "row";
  let createdAt = new Date(parseInt(order.created_at))
    .toString()
    .replace("GMT+0200 (Eastern European Standard Time)", "")
    .replace("(EET)", "");
  let updatedAt = new Date(parseInt(order.updated_at))
    .toString()
    .replace("GMT+0200 (Eastern European Standard Time)", "")
    .replace("(EET)", "");
  let formedID = `${order.trackID}`;
  formedID =
    formedID.length >= 4
      ? formedID
      : formedID.length === 3
      ? `0${formedID}`
      : formedID.length === 2
      ? `00${formedID}`
      : formedID.length === 1
      ? `000${formedID}`
      : formedID;
  formedID = `DP${formedID}`;
  return (
    <View style={styles.container}>
      <ScrollView style={styles.inner}>
        <Text style={[styles.sub, styles.price, styles.Card]}>{formedID}</Text>
        <TouchableOpacity
          onPress={async () =>
            await Linking.openURL("tel:" + order.customer.phone)
          }
          style={[styles.Card, styles.customerCard]}
        >
          <Text style={styles.header}>{order.customer.name}</Text>
          <Text
            style={[styles.sub, { textAlign: alignRight ? "right" : "left" }]}
          >
            {order.customer.phone}
          </Text>
          <Text style={styles.sub}>{order.customer.address}</Text>
        </TouchableOpacity>
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
          {`${order.price.order || 0} + ${order.price.shipment || 0} = ${
            order.price.order + order.price.shipment
          } EGP`}
        </Text>

        <View
          style={[
            styles.finish,
            {
              flexDirection: alignRight ? direction_ROWREVERSE : direction_ROW,
              alignItems: "center",
            },
            styles.Card,
          ]}
        >
          <Text
            style={[
              styles.Status,
              { textAlign: alignRight ? "right" : "left" },
            ]}
          >
            {alignRight ? "حالة الطلب" : "Status"}
          </Text>
          <Picker
            selectedValue={status}
            style={{
              height: 50,
              width: 150,
            }}
            onValueChange={(itemValue, itemIndex) => {
              setStatus(itemValue);
              changeStatus(itemValue);
            }}
          >
            <Picker.Item
              label={alignRight ? "قيد المعالجة" : "Processing"}
              value="قيد المعالجة"
            />
            <Picker.Item
              label={alignRight ? "جاهز للشحن" : "Ready for Shippment"}
              value="جاهز للشحن"
            />
            <Picker.Item
              label={
                alignRight ? "تم التسليم للشحن" : "ٌReached shipment office"
              }
              value="تم التسليم للشحن"
            />
            <Picker.Item
              label={
                alignRight ? "جاري توزيع الشحنة" : "Ready for distribution"
              }
              value="جاري توزيع الشحنة"
            />
            <Picker.Item
              label={alignRight ? "تم التسليم" : "Delievered"}
              value="تم التسليم"
            />
          </Picker>

          <Text
            style={[
              styles.StatusText,
              { textAlign: alignRight ? "right" : "left" },
            ]}
          >
            {status}
          </Text>
        </View>
        <View
          style={[
            styles.cancel,
            {
              flexDirection: alignRight ? direction_ROWREVERSE : direction_ROW,
            },
            styles.Card,
          ]}
        >
          <Text
            style={[
              styles.Status,
              { textAlign: alignRight ? "right" : "left" },
            ]}
          >
            {alignRight ? "ملغي؟" : "Cancelled?"}
          </Text>

          <Switch onValueChange={toggleCancel} value={cancel} />
          <Text
            style={[
              styles.StatusText,
              { textAlign: alignRight ? "right" : "left" },
            ]}
          >
            {alignRight
              ? `${cancel ? "ملغي" : " فعَّال"}`
              : `${cancel ? "Cancelled" : "Active"}`}
          </Text>
        </View>
        <Text style={[styles.sub, styles.details, styles.Card]}>
          {alignRight
            ? `مُسجل الطلب:  ${order.created_by}`
            : `Saved by:  ${order.created_by}`}
        </Text>
        <Text style={[styles.sub, styles.details, styles.Card]}>
          {alignRight
            ? `تاريخ التسجيل:  ${createdAt}`
            : `Saved at:  ${createdAt}`}
        </Text>
        <Text style={[styles.sub, styles.details, styles.Card]}>
          {alignRight
            ? `مُعدل الطلب:  ${order.updated_by || ""}`
            : `Updated by:  ${order.updated_by || ""}`}
        </Text>
        <Text style={[styles.sub, styles.details, styles.Card]}>
          {alignRight
            ? `تاريخ التعديل:  ${order.updated_by ? updatedAt : ""}`
            : `Updated at:  ${order.updated_by ? updatedAt : ""}`}
        </Text>
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
