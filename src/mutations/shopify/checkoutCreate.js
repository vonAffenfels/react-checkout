export default `
    mutation CreateCheckout($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
            checkout {
                id
                webUrl
            }
            checkoutUserErrors {
                field
                message
                code
            }
        }
    }
`;
