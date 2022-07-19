import {gql} from "@apollo/client";

import CheckoutDetailsFragment from "../../fragments/saleor/checkoutDetailsFragment";

export default gql`
    ${CheckoutDetailsFragment}
    mutation CheckoutAddProductLine($checkoutToken: UUID!, $lines: [CheckoutLineInput!]!) {
        checkoutLinesAdd(
            token: $checkoutToken
            lines: $lines
        ) {
            checkout {
                ...CheckoutDetailsFragment
            }
            errors {
                message
                code
            }
        }
    }
`;
