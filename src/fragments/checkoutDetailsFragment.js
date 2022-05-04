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
            totalPrice {
                gross {
                    currency
                    amount
                }
            }
            variant {
                id
                name
                pricing {
                    price {
                        gross {
                            currency
                            amount
                        }
                    }
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
