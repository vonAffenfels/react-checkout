export default `
    mutation checkoutDiscountCodeApplyV2($checkoutToken: ID!, $discountCode: String!) {
        checkoutDiscountCodeApplyV2(
            checkoutId: $checkoutToken
            discountCode: $discountCode
        ) {
            checkoutUserErrors {
                field
                message
                code
            }
        }
    }
`;
