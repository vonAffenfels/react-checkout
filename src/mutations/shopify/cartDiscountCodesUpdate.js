import {gql} from "@apollo/client";

import CartDetailsFragment from "../../fragments/shopify/cartDetailsFragment";

export default gql`
    ${CartDetailsFragment}
    mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!], $linesCount: Int!) {
        cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
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
