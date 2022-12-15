import {gql} from "@apollo/client";

import CheckoutDetailsFragment from "../../fragments/saleor/checkoutDetailsFragment";

export default gql`
    ${CheckoutDetailsFragment}
    query CheckoutByToken($checkoutToken: UUID!) {
        checkout(token: $checkoutToken) {
            ...CheckoutDetailsFragmentSaleor
        }
    }
`;
