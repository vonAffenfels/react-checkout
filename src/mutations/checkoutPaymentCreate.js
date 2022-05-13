import {gql} from "@apollo/client";

import CheckoutDetailsFragment from "../fragments/checkoutDetailsFragment";

export default gql`
    ${CheckoutDetailsFragment}
    mutation CheckoutPaymentCreate($checkoutToken: UUID!, $input: PaymentInput!) {
        checkoutPaymentCreate(
            token: $checkoutToken
            input: $input
        ) {
            payment {
                id
                chargeStatus
                metadata {
                    key
                    value
                }
            }
            paymentErrors {
                field
                message
            }
        }
    }
`;
