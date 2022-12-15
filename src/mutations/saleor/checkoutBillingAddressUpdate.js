import {gql} from "@apollo/client";

import CheckoutDetailsFragment from "../../fragments/saleor/checkoutDetailsFragment";

export default gql`
    ${CheckoutDetailsFragment}
    mutation CheckoutBillingAddressUpdate($checkoutToken: UUID!, $address: AddressInput!) {
        checkoutBillingAddressUpdate(
            token: $checkoutToken
            billingAddress: $address
        ) {
            checkout {
                ...CheckoutDetailsFragmentSaleor
            }
            errors {
                field
                message
                code
            }
        }
    }
`;
