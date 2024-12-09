export default `
    fragment ShippingMethodDetailsFragment on ShippingMethod {
        id
        name
        active
        price {
            currency
            amount
        }
        minimumDeliveryDays
        maximumDeliveryDays
    }
`;
