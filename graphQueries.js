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

export const LAST_WAITING_ORDERS = gql`
  query lastWaitingOrders($limit: Int!, $cursor: ID) {
    lastWaitingOrders(limit: $limit, cursor: $cursor) {
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

export const LAST_FINISHED_ORDERS = gql`
  query lastFinsiedOrders($limit: Int!, $cursor: ID) {
    lastFinsiedOrders(limit: $limit, cursor: $cursor) {
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

export const LAST_CANCELLED_ORDERS = gql`
  query lastCancelledOrders($limit: Int!, $cursor: ID) {
    lastCancelledOrders(limit: $limit, cursor: $cursor) {
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

export const FINISH_ORDER = gql`
  mutation finishOrder($id: ID!) {
    finishOrder(id: $id)
  }
`;
export const UNFINISH_ORDER = gql`
  mutation unfinishOrder($id: ID!) {
    unFinishOrder(id: $id)
  }
`;
export const CANCEL_ORDER = gql`
  mutation cancelOrder($id: ID!) {
    cancelOrder(id: $id)
  }
`;
export const UNCANCEL_ORDER = gql`
  mutation UnCancelOrder($id: ID!) {
    UnCancelOrder(id: $id)
  }
`;
export const DELETE_ORDER = gql`
  mutation deleteOrder($id: ID!) {
    deleteOrder(id: $id)
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

export const EDIT_ORDER = gql`
  mutation editOrder(
    $id: ID!
    $customer_name: String!
    $customer_phone: String!
    $customer_address: String!
    $details: String!
    $notes: String
    $price: Float!
  ) {
    editOrder(
      id: $id
      customer_name: $customer_name
      customer_phone: $customer_phone
      customer_address: $customer_address
      details: $details
      notes: $notes
      price: $price
    ) {
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
