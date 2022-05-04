import {gql} from "@apollo/client";

export default gql`
    fragment CheckoutDetailsFragment on Checkout {
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
            thumbnail {
                url
                alt
            }
            unitPrice {
                gross {
                    currency
                    amount
                }
            }
            totalPrice {
                gross {
                    currency
                    amount
                }
            }
            productName
            variantName
            quantity
        }
    }
`;
