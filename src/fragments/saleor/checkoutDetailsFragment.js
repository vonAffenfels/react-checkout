import {gql} from "@apollo/client";

import PriceFragment from "./PriceFragment";
import ShippingMethodDetailsFragment from "./shippingMethodDetailsFragment";
import AddressDetailsFragment from "./addressDetailsFragment";

export default gql`
    ${PriceFragment}
    ${ShippingMethodDetailsFragment}
    ${AddressDetailsFragment}
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
        shippingMethod {
            ...ShippingMethodDetailsFragment
        }
        availablePaymentGateways {
            id
            name
            config {
                field
                value
            }
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
        billingAddress {
            ...AddressDetailsFragment
        }
        shippingAddress {
            ...AddressDetailsFragment
        }
    }
`;
