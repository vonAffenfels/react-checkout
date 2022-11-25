import {gql} from "@apollo/client";

import CartDetailsFragment from "../../fragments/shopify/cartDetailsFragment";

export default gql`
    ${CartDetailsFragment}
    query Cart($cartId:ID!, $country: CountryCode, $linesCount: Int!) @inContext(country: $country) {
        cart(id: $cartId) {
            id
            ...CartDetailsFragment
        }
    }
`;
