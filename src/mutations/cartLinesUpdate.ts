import cartDetailsFragment from "../fragments/cartDetailsFragment";

export default `
    ${cartDetailsFragment}
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $linesCount: Int!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
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
