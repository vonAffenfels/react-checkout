import CheckoutDetailsFragment from "../../fragments/saleor/checkoutDetailsFragment";

export default `
    ${CheckoutDetailsFragment}
    mutation CheckoutEmailUpdate($checkoutToken: UUID!, $email: String!) {
        checkoutEmailUpdate(
            token: $checkoutToken
            email: $email
        ) {
            checkout {
                ...CheckoutDetailsFragmentSaleor
            }
            errors {
                field
                message
            }
        }
    }
`;
