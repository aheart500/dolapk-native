import React from "react";
import { View, Alert } from "react-native";
import { Icon } from "react-native-elements";
import Alerts from "./Alerts";
import { useMutation } from "@apollo/react-hooks";
import {
  DELETE_ORDERS,
  UPDATE_ORDERS,
  CANCEL_ORDERS,
  UNCANCEL_ORDERS,
} from "../GraphQL/Orders";

const Toolbar = ({ selected, setSelected, refetch }) => {
  const [deletOrders] = useMutation(DELETE_ORDERS, {
    variables: { ids: selected },
  });
  const [processingOrders] = useMutation(UPDATE_ORDERS, {
    variables: { ids: selected, status: "قيد المعالجة" },
  });
  const [processedOrders] = useMutation(UPDATE_ORDERS, {
    variables: { ids: selected, status: "جاهز للشحن" },
  });

  const [shipped] = useMutation(UPDATE_ORDERS, {
    variables: { ids: selected, status: "تم التسليم للشحن" },
  });

  const [distributed] = useMutation(UPDATE_ORDERS, {
    variables: { ids: selected, status: "جاري توزيع الشحنة" },
  });
  const [delievered] = useMutation(UPDATE_ORDERS, {
    variables: { ids: selected, status: "تم التسليم" },
  });
  const [cancelOrders] = useMutation(CANCEL_ORDERS, {
    variables: { ids: selected },
  });
  const [unCancelOrders] = useMutation(UNCANCEL_ORDERS, {
    variables: { ids: selected },
  });
  const callBack = () => {
    setSelected([]);
    refetch();
  };

  const lang = "ar";
  const handleAction = async (action) => {
    let realAlert;
    switch (action) {
      case "delete": {
        realAlert = Alerts(lang, deletOrders, "delete", callBack);
        break;
      }
      case "cancel": {
        realAlert = Alerts(lang, cancelOrders, "cancel", callBack);
        break;
      }
      case "active": {
        realAlert = Alerts(lang, unCancelOrders, "active", callBack);
        break;
      }
      case "delievered": {
        realAlert = Alerts(lang, delievered, "finish", callBack);
        break;
      }
      case "distribution": {
        realAlert = Alerts(
          lang,
          distributed,
          "convert ready for distribution",
          callBack
        );
        break;
      }
      case "shipped": {
        realAlert = Alerts(lang, shipped, "deliver to shipment", callBack);
        break;
      }
      case "processed": {
        realAlert = Alerts(
          lang,
          processedOrders,
          "convert to processed",
          callBack
        );
        break;
      }
      case "processing": {
        realAlert = Alerts(
          lang,
          processingOrders,
          "convert to processing",
          callBack
        );
        break;
      }
    }
    if (realAlert) {
      Alert.alert(
        realAlert.title,
        realAlert.message(selected.length),
        realAlert.buttons
      );
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#f79a60",
        marginHorizontal: 5,
        paddingHorizontal: 5,
        paddingVertical: 10,
        flexDirection: "row",
        borderRadius: 5,
        justifyContent: "space-evenly",
      }}
    >
      <Icon
        name="delete"
        onPress={() => handleAction("delete")}
        disabled={selected.length < 1}
        disabledStyle={{
          backgroundColor: "initial",
        }}
      />
      <Icon
        name="highlight-off"
        onPress={() => handleAction("cancel")}
        disabled={selected.length < 1}
        disabledStyle={{
          backgroundColor: "initial",
        }}
      />
      <Icon
        name="check-circle"
        onPress={() => handleAction("active")}
        disabled={selected.length < 1}
        disabledStyle={{
          backgroundColor: "initial",
        }}
      />
      <Icon
        name="star-border"
        onPress={() => handleAction("delievered")}
        disabled={selected.length < 1}
        disabledStyle={{
          backgroundColor: "initial",
        }}
      />
      <Icon
        name="cached"
        onPress={() => handleAction("distribution")}
        disabled={selected.length < 1}
        disabledStyle={{
          backgroundColor: "initial",
        }}
      />
      <Icon
        name="spellcheck"
        onPress={() => handleAction("shipped")}
        disabled={selected.length < 1}
        disabledStyle={{
          backgroundColor: "initial",
        }}
      />
      <Icon
        name="add-circle-outline"
        onPress={() => handleAction("processed")}
        disabled={selected.length < 1}
        disabledStyle={{
          backgroundColor: "initial",
        }}
      />
      <Icon
        name="remove-circle-outline"
        onPress={() => handleAction("processing")}
        disabled={selected.length < 1}
        disabledStyle={{
          backgroundColor: "initial",
        }}
      />
    </View>
  );
};

export default Toolbar;
