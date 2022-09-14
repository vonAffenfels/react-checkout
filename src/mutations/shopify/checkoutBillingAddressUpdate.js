import {gql} from "@apollo/client";

import CheckoutDetailsShipmentFragment from "../../fragments/shopify/checkoutDetailsShipmentFragment";

//TODO possible to set a different billing address in shopify?!
export default gql`
    ${CheckoutDetailsShipmentFragment}
    mutation checkoutShippingAddressUpdateV2($checkoutToken: ID!, $address: MailingAddressInput!) {
        checkoutShippingAddressUpdateV2(
            checkoutId: $checkoutToken
            shippingAddress: $address
        ) {
            checkout {
                ...CheckoutDetailsShipmentFragment
            }
            checkoutUserErrors {
                field
                message
                code
            }
        }
    }
`;
