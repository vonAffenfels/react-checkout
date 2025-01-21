import CheckoutDetailsFragment from "../fragments/checkoutDetailsFragment";

export default `
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
