import {gql} from "@apollo/client";

import PriceFragment from "./PriceFragment";
import ShippingMethodDetailsFragment from "./shippingMethodDetailsFragment";
import AddressDetailsFragment from "./addressDetailsFragment";

export default gql`
    ${PriceFragment}
    ${ShippingMethodDetailsFragment}
    ${AddressDetailsFragment}
    fragment CheckoutDetailsFragmentSaleor on Checkout {
        id
        token
        email
        discount {
            ...PriceFragmentSaleor
        }
        discountName
        subtotalPrice {
            net {
                ...PriceFragmentSaleor
            }
            tax {
                ...PriceFragmentSaleor
            }
        }
        shippingPrice {
            gross {
                ...PriceFragmentSaleor
            }
        }
        totalPrice {
            gross {
                ...PriceFragmentSaleor
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
                    ...PriceFragmentSaleor
                }
            }
            variant {
                id
                name
                pricing {
                    price {
                        gross {
                            ...PriceFragmentSaleor
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
