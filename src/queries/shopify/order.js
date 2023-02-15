import {gql} from "@apollo/client";

import OrderDetailsFragment from "../../fragments/shopify/orderDetailsFragment";

export default gql`
    ${OrderDetailsFragment}
    query Order($id:ID!) {
        node(id:$id) {
            id
            ... on Order {
                ...OrderDetailsFragment
            }
        }
    }
`;
