import {gql} from "@apollo/client";

export default gql`
    fragment ShippingMethodDetailsFragment on ShippingMethod {
        id
        name
        active
        price {
            currency
            amount
        }
    }
`;
