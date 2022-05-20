import {gql} from "@apollo/client";

import CheckoutDetailsFragment from "../fragments/checkoutDetailsFragment";

export default gql`
    ${CheckoutDetailsFragment}
    mutation CheckoutBillingAddressUpdate($checkoutToken: UUID!, $address: AddressInput!) {
        checkoutBillingAddressUpdate(
            token: $checkoutToken
            billingAddress: $address
        ) {
            checkout {
                ...CheckoutDetailsFragment
            }
            errors {
                field
                message
                code
            }
        }
    }
`;
