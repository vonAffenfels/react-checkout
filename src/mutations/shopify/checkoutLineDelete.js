import CheckoutDetailsFragment from "../../fragments/shopify/checkoutDetailsFragment";

export default `
    ${CheckoutDetailsFragment}
    mutation checkoutLineItemsRemove($checkoutToken: ID!, $lineItemIds: [ID!]!) {
        checkoutLineItemsRemove(
            checkoutId: $checkoutToken
            lineItemIds: $lineItemIds
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
