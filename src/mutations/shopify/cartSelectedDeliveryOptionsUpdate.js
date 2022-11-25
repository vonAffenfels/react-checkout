import {gql} from "@apollo/client";

import cartDetailsFragment from "../../fragments/shopify/cartDetailsFragment";

export default gql`
    ${cartDetailsFragment}
    mutation cartSelectedDeliveryOptionsUpdate(
        $cartId: ID!,
        $selectedDeliveryOptions: [CartSelectedDeliveryOptionInput!]!,
        $linesCount: Int!
    ) {
        cartSelectedDeliveryOptionsUpdate(
            cartId: $cartId,
            selectedDeliveryOptions: $selectedDeliveryOptions
        ) {
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
