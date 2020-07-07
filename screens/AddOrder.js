import React, { useReducer } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  Button,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useMutation } from "@apollo/react-hooks";
import { ADD_ORDER } from "../graphQueries";
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
          navigation.navigate("Home");
          dispatch({ type: "clearAll" });
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <View style={styles.list}>
        <Text style={styles.header}>Order Details:</Text>
        <FlatList
          style={styles.list}
          data={[
            "customer_name",
            "customer_phone",
            "customer_address",
            "details",
            "notes",
            "price",
          ]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const makeMulti = item === "details";
            const placeholder = item
              .split("_")
              .map((e) => e.replace(/^./gi, (match) => match.toUpperCase()))
              .join(" ");
            return (
              <TextInput
                placeholder={placeholder}
                onChangeText={(text) => handleChange(item, text)}
                style={[styles.textBox, makeMulti ? styles.mutlinear : null]}
                multiline={makeMulti}
                numberOfLines={3}
                keyboardType={item === "price" ? "numeric" : "default"}
              />
            );
          }}
        />
        <View style={styles.button}>
          <Button title="Save Order" onPress={handleSave} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    alignItems: "center",
  },
  list: {
    width: "100%",
    marginBottom: 10,
  },
  textBox: {
    width: "95%",
    height: 30,
    paddingVertical: 5,
    marginLeft: "2.5%",
    marginRight: "2.5%",
    borderBottomWidth: 1,
    marginBottom: 5,
    fontSize: 20,
    textAlign: "left",
    textAlignVertical: "top",
  },
  mutlinear: {
    height: 70,
  },
  header: {
    fontSize: 20,
    marginTop: 5,
    alignSelf: "flex-start",
  },
  button: {
    marginTop: 10,
  },
});

export default AddOrder;
