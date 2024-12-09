export default `
    mutation CreateCart($input: CartInput!, $linesCount: Int!) {
        cartCreate(input: $input) {
            cart {
                checkoutUrl
                id
                lines(first: $linesCount) {
                    nodes {
                        id
                        quantity
                        merchandise {
                            ...on ProductVariant {
                                id
                            }
                        }
                    }
                }
            }
            userErrors {
                field
                message
                code
            }
        }
    }
`;
