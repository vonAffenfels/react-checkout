import CartDetailsFragment from "../fragments/cartDetailsFragment";

export default `
    ${CartDetailsFragment}
    mutation cartBuyerIdentityUpdate($buyerIdentity: CartBuyerIdentityInput!, $cartId: ID!, $linesCount: Int!) {
        cartBuyerIdentityUpdate(buyerIdentity: $buyerIdentity, cartId: $cartId) {
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
