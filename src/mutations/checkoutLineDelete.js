import {gql} from "@apollo/client";

import CheckoutDetailsFragment from "../fragments/checkoutDetailsFragment";

export default gql`
    ${CheckoutDetailsFragment}
    mutation CheckoutLineDelete($checkoutToken: UUID!, $lines: [CheckoutLineInput!]!) {
        checkoutLineDelete(
            token: $checkoutToken
            lineId: $lineId
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
