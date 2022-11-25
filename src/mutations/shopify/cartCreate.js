import {gql} from "@apollo/client";

export default gql`
    mutation CreateCart($input: CartInput!) {
        cartCreate(input: $input) {
            cart {
                id
                checkoutUrl
            }
            userErrors {
                field
                message
                code
            }
        }
    }
`;
