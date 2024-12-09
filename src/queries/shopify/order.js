import OrderDetailsFragment from "../../fragments/shopify/orderDetailsFragment";

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
