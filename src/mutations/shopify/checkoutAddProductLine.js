import CheckoutDetailsFragment from "../../fragments/shopify/checkoutDetailsFragment";

export default `
    ${CheckoutDetailsFragment}
    mutation checkoutLineItemsAdd($checkoutToken: ID!, $lineItems: [CheckoutLineItemInput!]!) {
        checkoutLineItemsAdd(
            checkoutId: $checkoutToken
            lineItems: $lineItems
        ) {
            checkout {
                ...CheckoutDetailsFragment
            }
            checkoutUserErrors {
                field
                message
                code
            }
        }
    }
`;
