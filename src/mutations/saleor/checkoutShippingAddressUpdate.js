import CheckoutDetailsFragment from "../../fragments/saleor/checkoutDetailsFragment";

export default `
    ${CheckoutDetailsFragment}
    mutation CheckoutShippingAddressUpdate($checkoutToken: UUID!, $address: AddressInput!) {
        checkoutShippingAddressUpdate(
            token: $checkoutToken
            shippingAddress: $address
        ) {
            checkout {
                ...CheckoutDetailsFragmentSaleor
            }
            errors {
                field
                message
                code
            }
        }
    }
`;
