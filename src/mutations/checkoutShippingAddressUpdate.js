import {gql} from "@apollo/client";

import CheckoutDetailsFragment from "../fragments/checkoutDetailsFragment";

export default gql`
    ${CheckoutDetailsFragment}
    mutation CheckoutShippingAddressUpdate($checkoutToken: UUID!, $address: AddressInput!) {
        checkoutShippingAddressUpdate(
            token: $checkoutToken
            shippingAddress: $address
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
