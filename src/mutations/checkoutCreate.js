import {gql} from "@apollo/client";

export default gql`
    mutation CreateCheckout($email: String!, $lines: [CheckoutLineInput!]!, $channel: String!) {
        checkoutCreate(input: {channel: $channel, email: $email, lines: $lines}) {
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
