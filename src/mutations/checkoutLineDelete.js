import {gql} from "@apollo/client";

import CheckoutDetailsFragment from "../fragments/checkoutDetailsFragment";

export default gql`
    ${CheckoutDetailsFragment}
    mutation CheckoutLineDelete($checkoutToken: UUID!, $lineId: ID!) {
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
