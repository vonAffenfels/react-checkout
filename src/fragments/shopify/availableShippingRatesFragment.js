import {gql} from "@apollo/client";

export default gql`
    fragment AvailableShippingRatesFragment on AvailableShippingRates {
        ready
        shippingRates {
            handle
            title
            priceV2 {
                amount
                currencyCode
            }
        }
    }
`;
