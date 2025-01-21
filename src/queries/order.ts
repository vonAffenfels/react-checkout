import OrderDetailsFragment from "../fragments/orderDetailsFragment";

export default `
    ${OrderDetailsFragment}
    query Order($orderId:ID!) {
        node(id:$orderId) {
            id
            ... on Order {
                ...OrderDetailsFragment
            }
        }
    }
`;
