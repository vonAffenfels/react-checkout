import {gql} from "@apollo/client";

import cartDetailsFragment from "../../fragments/shopify/cartDetailsFragment";

export default gql`
    ${cartDetailsFragment}
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $linesCount: Int!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
            cart {
                ...CartDetailsFragment
            }
            userErrors {
                field
                message
            }
        }
    }
`;
