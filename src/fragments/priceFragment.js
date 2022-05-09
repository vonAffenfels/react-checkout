import {gql} from "@apollo/client";

export default gql`
    fragment PriceFragment on Money {
        currency
        amount
    }
`;
