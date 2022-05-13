import {gql} from "@apollo/client";

import CheckoutDetailsFragment from "../fragments/checkoutDetailsFragment";

export default gql`
    ${CheckoutDetailsFragment}
    mutation checkoutEmailUpdate($checkoutToken: UUID!, $email: String!) {
        checkoutEmailUpdate(
            token: $checkoutToken
            email: $email
        ) {
            checkout {
                ...CheckoutDetailsFragment
            }
            errors {
                field
                message
            }
        }
    }
`;
