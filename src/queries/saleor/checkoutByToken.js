import CheckoutDetailsFragment from "../../fragments/saleor/checkoutDetailsFragment";

export default `
    ${CheckoutDetailsFragment}
    query CheckoutByToken($checkoutToken: UUID!) {
        checkout(token: $checkoutToken) {
            ...CheckoutDetailsFragmentSaleor
        }
    }
`;
