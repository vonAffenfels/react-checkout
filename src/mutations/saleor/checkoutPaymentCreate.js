export default `
    mutation CheckoutPaymentCreate($checkoutToken: UUID!, $input: PaymentInput!) {
        checkoutPaymentCreate(
            token: $checkoutToken
            input: $input
        ) {
            payment {
                id
                chargeStatus
                metadata {
                    key
                    value
                }
            }
            paymentErrors {
                field
                message
            }
        }
    }
`;
