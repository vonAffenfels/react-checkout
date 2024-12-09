import CheckoutDetailsFragment from "../../fragments/saleor/checkoutDetailsFragment";

export default `
    ${CheckoutDetailsFragment}
    mutation CheckoutAddProductLine($checkoutToken: UUID!, $lines: [CheckoutLineInput!]!) {
        checkoutLinesAdd(
            token: $checkoutToken
            lines: $lines
        ) {
            checkout {
                ...CheckoutDetailsFragmentSaleor
            }
            errors {
                message
                code
            }
        }
    }
`;
