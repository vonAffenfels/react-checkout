import {gql} from "@apollo/client";

export default gql`
    mutation CreateCheckout($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
            checkout {
                id
                token
            }
            errors {
                field
                message
                code
            }
        }
    }
`;
