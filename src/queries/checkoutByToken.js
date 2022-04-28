import {gql} from "@apollo/client";

export default gql`
    query CheckoutByToken($checkoutToken: UUID!) {
        checkout(token: $checkoutToken) {
            id
            token
            email
            availableShippingMethods {
                id
            }
            availablePaymentGateways {
                id
            }
            lines {
                id
                variant {
                    id
                    product {
                        id
                    }
                }
            }
        }
    }
`;
