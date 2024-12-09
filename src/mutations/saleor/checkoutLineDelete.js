import CheckoutDetailsFragment from "../../fragments/saleor/checkoutDetailsFragment";

export default `
    ${CheckoutDetailsFragment}
    mutation CheckoutLineDelete($checkoutToken: UUID!, $lineId: ID!) {
        checkoutLineDelete(
            token: $checkoutToken
            lineId: $lineId
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
