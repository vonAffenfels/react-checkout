import {gql} from "@apollo/client";

import CheckoutDetailsFragment from "../../fragments/shopify/checkoutDetailsFragment";

export default gql`
    ${CheckoutDetailsFragment}
    mutation checkoutLineItemsAdd($checkoutToken: ID!, $lineItems: [CheckoutLineItemInput!]!) {
        checkoutLineItemsAdd(
            checkoutId: $checkoutToken
            lineItems: $lineItems
        ) {
            checkout {
                ...CheckoutDetailsFragment
            }
            checkoutUserErrors {
                field
                message
                code
            }
        }
    }
`;
