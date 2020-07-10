import React, { useReducer, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  KeyboardAvoidingView,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Switch,
} from "react-native";
import { useMutation } from "@apollo/react-hooks";
import { ADD_ORDER, EDIT_ORDER } from "../graphQueries";
import { ScrollView } from "react-native-gesture-handler";
import { Input } from "react-native-elements";

const initialState = {
  customer_name: "",
  customer_phone: "",
  customer_address: "",
  details: "",
  notes: "",
  price: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "field":
      return { ...state, [action.fieldName]: action.value };
    case "clearAll": {
      return initialState;
    }
    default:
      return state;
  }
};

const AddOrder = ({ navigation, route }) => {
  const [arabic, setArabic] = useState(false);
  const [errors, setErrors] = useState([]);
  const [state, dispatch] = useReducer(
    reducer,
    route.params && route.params.edit
      ? {
          customer_name: route.params.order.customer.name,
          customer_phone: route.params.order.customer.phone,
          customer_address: route.params.order.customer.address,
          details: route.params.order.details,
          notes: route.params.order.notes,
          price: `${route.params.order.price}`,
        }
      : initialState
  );

  const {
    customer_name,
    customer_phone,
    customer_address,
    details,
    notes,
    price,
  } = state;
  const customerNameInput = useRef();
  const customerPhoneInput = useRef();
  const customerAddressInput = useRef();
  const detailsInput = useRef();
  const notesInput = useRef();
  const priceInput = useRef();
  const refArr = [
    customerNameInput,
    customerPhoneInput,
    customerAddressInput,
    detailsInput,
    notesInput,
    priceInput,
  ];
  const [addOrder, { loading: addLoading }] = useMutation(ADD_ORDER);
  const [editOrder, { loading: editLoading }] = useMutation(EDIT_ORDER);

  const handleChange = (fieldName, value) => {
    dispatch({ type: "field", fieldName, value });
  };

  const handleSave = () => {
    setErrors([]);
    if (
      !customer_name ||
      !customer_phone ||
      !customer_address ||
      !details ||
      !price
    ) {
      Alert.alert(
        arabic ? "حقول فارغة" : "Missing fields",
        arabic
          ? "تأكد من إدخال جميع القيم المطلوبة"
          : "Make sure you entered all the required values"
      );
      Object.keys(state).forEach((name) => {
        if (state[name] === "" || state[name] === " ") {
          name === "notes" ? null : setErrors((prev) => [...prev, name]);
        }
      });
    } else {
      if (route.params && route.params.edit) {
        editOrder({
          variables: {
            ...state,
            price: parseFloat(state.price),
            id: route.params.order.id,
          },
        })
          .then((res) => {
            Alert.alert(
              arabic ? "تعديل الطلب" : "Edit order",
              arabic
                ? "تم تعديل الطلب بنجاح"
                : "Your order is updated successfully"
            );
            dispatch({ type: "clearAll" });
            navigation.navigate("Order", { order: res.data.editOrder });
          })
          .catch((err) => console.log(err))
          .finally(() => (route.params = {}));
      } else {
        addOrder({ variables: { ...state, price: parseFloat(state.price) } })
          .then((res) => {
            Alert.alert(
              arabic ? "حفظ الطلب" : "Saved order",
              arabic ? "تم حفظ الطلب بنجاح" : "Your order is saved successfully"
            );
            dispatch({ type: "clearAll" });
            navigation.navigate("Home");
          })
          .catch((err) => console.log(err));
      }
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      style={styles.list}
    >
      <View style={styles.inner}>
        <View style={[styles.switchBox]}>
          <Text style={styles.switchText}>Arabic?</Text>
          <Switch value={arabic} onValueChange={() => setArabic(!arabic)} />
        </View>
        <Text style={[styles.header, { textAlign: arabic ? "right" : "left" }]}>
          {arabic ? "تفاصيل الطلب:" : "Order Details:"}
        </Text>
        <KeyboardAvoidingView style={styles.container} behavior="height">
          <ScrollView style={{ flex: 1 }}>
            {[
              "customer_name",
              "customer_phone",
              "customer_address",
              "details",
              "notes",
              "price",
            ].map((item, index) => {
              const makeMulti = [
                "details",
                "notes",
                "customer_address",
              ].includes(item);
              let placeholder = arabic
                ? item === "customer_name"
                  ? "اسم العميل"
                  : item === "customer_phone"
                  ? "رقم الهاتف"
                  : item === "customer_address"
                  ? "العنوان"
                  : item === "details"
                  ? "تفاصيل الطلب"
                  : item === "notes"
                  ? "ملاحظات"
                  : "السعر"
                : item
                    .split("_")
                    .map((e) =>
                      e.replace(/^./gi, (match) => match.toUpperCase())
                    )
                    .join(" ");

              return (
                <Input
                  key={index}
                  required={item !== "notes"}
                  placeholder={
                    arabic
                      ? `من فضلك أدخل ${placeholder}`
                      : `Please enter ${item.split("_").join(" ")}`
                  }
                  label={placeholder}
                  onChangeText={(text) => handleChange(item, text)}
                  style={[
                    styles.textBox,
                    makeMulti ? styles.mutlinear : null,
                    { textAlign: arabic ? "right" : "left" },
                  ]}
                  autoFocus={index === 0}
                  value={state[item]}
                  errorMessage={
                    errors.includes(item)
                      ? `${arabic ? "مطلوب*" : "*Required"}`
                      : null
                  }
                  multiline={makeMulti}
                  ref={refArr[index]}
                  onSubmitEditing={() => {
                    index !== 5 ? refArr[index + 1].current.focus() : null;
                  }}
                  returnKeyType={index === 5 ? "done" : "next"}
                  numberOfLines={3}
                  keyboardType={
                    item === "price"
                      ? "numeric"
                      : item === "customer_phone"
                      ? "phone-pad"
                      : "default"
                  }
                />
              );
            })}
          </ScrollView>
          <View style={styles.button}>
            <Button
              disabled={editLoading || addLoading}
              title={
                editLoading || addLoading
                  ? `${arabic ? "جاري الحفظ..." : "Saving..."}`
                  : route.params && route.params.edit
                  ? `${arabic ? "تحديث الطلب" : "Update Order"}`
                  : `${arabic ? "حفظ الطلب" : "Save Order"}`
              }
              onPress={handleSave}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  switchBox: {
    marginVertical: 15,
    alignSelf: "center",
    flexDirection: "row",
  },
  switchText: {
    marginHorizontal: 10,
    fontSize: 15,
  },
  list: {
    flex: 1,
  },
  textBox: {
    width: "95%",
    padding: 10,
    marginLeft: "2.5%",
    marginRight: "2.5%",
    borderBottomWidth: 1,
    marginBottom: 5,
    fontSize: 20,
    textAlignVertical: "top",
  },
  mutlinear: {},
  header: {
    fontSize: 20,
    marginVertical: 10,
    marginHorizontal: 4,
  },
  button: {
    marginVertical: 15,
    marginHorizontal: 10,
  },
  inner: {
    flex: 1,
    width: "100%",
  },
});

export default AddOrder;
