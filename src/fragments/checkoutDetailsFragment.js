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
            variant {
                id
                name
                thumbnail {
                    url
                    alt
                }
                product {
                    id
                    name
                    thumbnail {
                        url
                        alt
                    }
                }
            }
            quantity
        }
    }
`;
