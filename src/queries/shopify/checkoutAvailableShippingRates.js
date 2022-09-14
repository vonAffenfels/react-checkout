import {gql} from "@apollo/client";

import CheckoutDetailsFragment from "../../fragments/shopify/checkoutDetailsFragment";

export default gql`
    ${CheckoutDetailsFragment}
    query ($checkoutToken:ID!) {
        node(id:$checkoutToken) {
            id
            ... on Checkout {
                availableShippingRates {
                    ready
                    shippingRates {
                        handle
                        priceV2 {
                            amount
                        }
                        title
                    }
                }
            }
        }
    }
`;
