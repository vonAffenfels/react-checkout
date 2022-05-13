import {gql} from "@apollo/client";

import CheckoutDetailsFragment from "../fragments/checkoutDetailsFragment";

export default gql`
    ${CheckoutDetailsFragment}
    mutation CheckoutDeliveryMethodUpdate($checkoutToken: UUID!, $deliveryMethodId: ID!) {
        checkoutDeliveryMethodUpdate(
            token: $checkoutToken
            deliveryMethodId: $deliveryMethodId
        ) {
            checkout {
                ...CheckoutDetailsFragment
            }
            errors {
                field
                message
            }
        }
    }
`;
