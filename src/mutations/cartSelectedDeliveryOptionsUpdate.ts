import cartDetailsFragment from "../fragments/cartDetailsFragment";

export default `
    ${cartDetailsFragment}
    mutation cartSelectedDeliveryOptionsUpdate(
        $cartId: ID!,
        $selectedDeliveryOptions: [CartSelectedDeliveryOptionInput!]!,
        $linesCount: Int!
    ) {
        cartSelectedDeliveryOptionsUpdate(
            cartId: $cartId,
            selectedDeliveryOptions: $selectedDeliveryOptions
        ) {
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
