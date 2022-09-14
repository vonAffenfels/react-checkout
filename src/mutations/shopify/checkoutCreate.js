import {gql} from "@apollo/client";

export default gql`
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
