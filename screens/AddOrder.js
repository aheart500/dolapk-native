import React, { useReducer, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useMutation } from "@apollo/react-hooks";
import { ADD_ORDER } from "../graphQueries";
import { ScrollView } from "react-native-gesture-handler";

const initialState = {
  customer_name: "",
  customer_phone: "",
  customer_address: "",
  details: "",
  notes: "",
  price: 0.0,
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

const AddOrder = ({ navigation }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
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
  const [addOrder] = useMutation(ADD_ORDER);
  const handleChange = (fieldName, value) => {
    dispatch({ type: "field", fieldName, value });
  };
  const handleSave = () => {
    if (
      (customer_name === "" || customer_phone === "" || customer_address === "",
      details === "",
      notes === "",
      price === 0.0)
    ) {
      Alert.alert(
        "Missing value",
        "Make sure you entered all the required values"
      );
    } else {
      addOrder({ variables: { ...state, price: parseFloat(state.price) } })
        .then((res) => {
          Alert.alert("Saved Order", "Your order is saved successfully");
          dispatch({ type: "clearAll" });
          navigation.navigate("Home");
        })
        .catch((err) => console.log(err));
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
        <Text style={styles.header}>Order Details:</Text>
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
              const makeMulti = item === "details";
              const placeholder = item
                .split("_")
                .map((e) => e.replace(/^./gi, (match) => match.toUpperCase()))
                .join(" ");
              return (
                <TextInput
                  key={index}
                  placeholder={placeholder}
                  onChangeText={(text) => handleChange(item, text)}
                  style={[styles.textBox, makeMulti ? styles.mutlinear : null]}
                  autoFocus={index === 0}
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
            <Button title="Save Order" onPress={handleSave} />
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "80%",
  },
  list: {
    flex: 1,
  },
  textBox: {
    width: "95%",
    height: 40,
    padding: 10,
    marginLeft: "2.5%",
    marginRight: "2.5%",
    borderBottomWidth: 1,
    marginBottom: 5,
    fontSize: 20,
    textAlign: "left",
    textAlignVertical: "top",
  },
  mutlinear: {
    height: 80,
  },
  header: {
    fontSize: 20,
    margin: 5,
    alignSelf: "flex-start",
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
