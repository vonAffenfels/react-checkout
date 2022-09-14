import {gql} from "@apollo/client";

export default gql`
    fragment PriceFragment on MoneyV2 {
        currencyCode
        amount
    }
`;
