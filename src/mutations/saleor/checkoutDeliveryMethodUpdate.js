import CheckoutDetailsFragment from "../../fragments/saleor/checkoutDetailsFragment";

export default `
    ${CheckoutDetailsFragment}
    mutation CheckoutDeliveryMethodUpdate($checkoutToken: UUID!, $deliveryMethodId: ID!) {
        checkoutDeliveryMethodUpdate(
            token: $checkoutToken
            deliveryMethodId: $deliveryMethodId
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
