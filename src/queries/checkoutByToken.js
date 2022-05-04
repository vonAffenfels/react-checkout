import {gql} from "@apollo/client";

import CheckoutDetailsFragment from "../fragments/checkoutDetailsFragment";

export default gql`
    ${CheckoutDetailsFragment}
    query CheckoutByToken($checkoutToken: UUID!) {
        checkout(token: $checkoutToken) {
            ...CheckoutDetailsFragment
        }
    }
`;
