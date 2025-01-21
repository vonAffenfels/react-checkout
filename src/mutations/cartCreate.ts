import cartDetailsFragment from "../fragments/cartDetailsFragment";

export default `
    ${cartDetailsFragment}
    mutation CreateCart($input: CartInput!, $linesCount: Int!) {
        cartCreate(input: $input) {
            cart {
                ...CartDetailsFragment
            }
            userErrors {
                field
                message
                code
            }
        }
    }
`;
