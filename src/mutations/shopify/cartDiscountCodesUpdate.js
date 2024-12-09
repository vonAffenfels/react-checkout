import CartDetailsFragment from "../../fragments/shopify/cartDetailsFragment";

export default `
    ${CartDetailsFragment}
    mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!], $linesCount: Int!) {
        cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
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
