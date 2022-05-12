import {gql} from "@apollo/client";

import PriceFragment from "../fragments/PriceFragment";
import ShippingMethodDetailsFragment from "../fragments/shippingMethodDetailsFragment";

export default gql`
    ${PriceFragment}
    ${ShippingMethodDetailsFragment}
    fragment CheckoutDetailsFragment on Checkout {
        id
        token
        email
        discount {
            ...PriceFragment
        }
        discountName
        subtotalPrice {
            net {
                ...PriceFragment
            }
            tax {
                ...PriceFragment
            }
        }
        shippingPrice {
            gross {
                ...PriceFragment
            }
        }
        totalPrice {
            gross {
                ...PriceFragment
            }
        }
        availableShippingMethods {
            ...ShippingMethodDetailsFragment
        }
        shippingMethods {
            ...ShippingMethodDetailsFragment
        }
        availablePaymentGateways {
            id
        }
        lines {
            totalPrice {
                gross {
                    ...PriceFragment
                }
            }
            variant {
                id
                name
                pricing {
                    price {
                        gross {
                            ...PriceFragment
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
            id
        }
    }
`;
