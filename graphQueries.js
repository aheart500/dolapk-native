import gql from "graphql-tag";
export const ALL_ORDERS = gql`
  query {
    allOrders {
      id
      customer {
        name
        phone
        address
      }
      details
      notes
      price
      finished
      cancelled
    }
  }
`;

export const LAST_ORDERS = gql`
  query lastOrders($limit: Int!, $cursor: ID) {
    lastOrders(limit: $limit, cursor: $cursor) {
      id
      customer {
        name
        phone
        address
      }
      details
      notes
      price
      finished
      cancelled
    }
  }
`;

export const ADD_ORDER = gql`
  mutation addOrder(
    $customer_name: String!
    $customer_phone: String!
    $customer_address: String!
    $details: String!
    $notes: String
    $price: Float!
  ) {
    addOrder(
      customer_name: $customer_name
      customer_phone: $customer_phone
      customer_address: $customer_address
      details: $details
      notes: $notes
      price: $price
    ) {
      id
    }
  }
`;
