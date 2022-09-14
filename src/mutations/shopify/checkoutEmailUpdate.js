import {gql} from "@apollo/client";

import CheckoutDetailsFragment from "../../fragments/shopify/checkoutDetailsFragment";

export default gql`
    ${CheckoutDetailsFragment}
    mutation checkoutEmailUpdateV2($checkoutToken: ID!, $email: String!) {
        checkoutEmailUpdateV2(
            checkoutId: $checkoutToken
            email: $email
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
