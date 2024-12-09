import cartDetailsFragment from "../../fragments/shopify/cartDetailsFragment";

export default `
    ${cartDetailsFragment}
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, $linesCount: Int!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
                ...CartDetailsFragment
            }
            userErrors {
                field
                message
            }
        }
    }
`;
