import {gql} from "@apollo/client";

export default gql`
    fragment PriceFragmentSaleor on Money {
        currency
        amount
    }
`;
