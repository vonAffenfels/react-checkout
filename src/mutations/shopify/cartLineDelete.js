import cartDetailsFragment from "../../fragments/shopify/cartDetailsFragment";

export default `
    ${cartDetailsFragment}
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!, $linesCount: Int!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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
