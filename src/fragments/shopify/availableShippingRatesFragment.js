export default `
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
