import gql from "graphql-tag";
const ORDER_DATE = gql`
  fragment allDetails on Order {
    id
    customer {
      name
      phone
      address
    }
    details
    status
    trackID
    price {
      order
      shipment
    }
    notes
    cancelled
    updated_by
    updated_at
    created_by
    created_at
  }
`;
export const GET_ORDER = gql`
  query order($id: ID, $trackID: Int) {
    getOrder(id: $id, trackID: $trackID) {
      ...allFields
    }
  }
  ${ORDER_DATE}
`;
export const LAST_ORDERS = gql`
  query lastOrders(
    $limit: Int!
    $cursor: ID
    $search: String
    $category: String!
  ) {
    lastOrders(
      limit: $limit
      cursor: $cursor
      search: $search
      category: $category
    ) {
      ...allDetails
    }
  }
  ${ORDER_DATE}
`;

export const ADD_ORDER = gql`
  mutation addOrder(
    $customer_name: String!
    $customer_phone: String!
    $customer_address: String!
    $details: String!
    $notes: String
    $order_price: Float!
    $shipment_price: Float
  ) {
    addOrder(
      customer_name: $customer_name
      customer_phone: $customer_phone
      customer_address: $customer_address
      details: $details
      notes: $notes
      order_price: $order_price
      shipment_price: $shipment_price
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
    $order_price: Float!
    $shipment_price: Float
  ) {
    editOrder(
      id: $id
      customer_name: $customer_name
      customer_phone: $customer_phone
      customer_address: $customer_address
      details: $details
      notes: $notes
      order_price: $order_price
      shipment_price: $shipment_price
    ) {
      ...allDetails
    }
  }
  ${ORDER_DATE}
`;

export const UPDATE_ORDERS = gql`
  mutation UpdateStatus($ids: [ID!]!, $status: String!) {
    updateStatus(ids: $ids, status: $status)
  }
`;

export const CANCEL_ORDERS = gql`
  mutation cancelOrders($ids: [ID!]!) {
    cancelOrders(ids: $ids)
  }
`;
export const UNCANCEL_ORDERS = gql`
  mutation unCancelOrders($ids: [ID!]!) {
    unCancelOrders(ids: $ids)
  }
`;

export const DELETE_ORDERS = gql`
  mutation deleteOrders($ids: [ID!]!) {
    deleteOrders(ids: $ids)
  }
`;
