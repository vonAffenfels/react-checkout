import {gql} from "@apollo/client";

import CartDetailsFragment from "../../fragments/shopify/cartDetailsFragment";

export default gql`
    ${CartDetailsFragment}
    mutation cartBuyerIdentityUpdate($buyerIdentity: CartBuyerIdentityInput!, $cartId: ID!, $linesCount: Int!) {
        cartBuyerIdentityUpdate(buyerIdentity: $buyerIdentity, cartId: $cartId) {
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
