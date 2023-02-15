import {gql} from "@apollo/client";

import OrderDetailsFragment from "../../fragments/shopify/orderDetailsFragment";

export default gql`
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
