import CheckoutDetailsShipmentFragment from "../../fragments/shopify/checkoutDetailsShipmentFragment";

export default `
    ${CheckoutDetailsShipmentFragment}
    mutation checkoutShippingAddressUpdateV2($checkoutToken: ID!, $address: MailingAddressInput!) {
        checkoutShippingAddressUpdateV2(
            checkoutId: $checkoutToken
            shippingAddress: $address
        ) {
            checkout {
                ...CheckoutDetailsShipmentFragment
            }
            checkoutUserErrors {
                field
                message
                code
            }
        }
    }
`;
