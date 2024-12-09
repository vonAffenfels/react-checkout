import PriceFragment from "./priceFragment";

export default `
    ${PriceFragment}
    fragment OrderDetailsFragment on Order {
        currencyCode
        currentSubtotalPrice {
            ...PriceFragment
        }
        currentTotalDuties {
            ...PriceFragment
        }
        totalPriceV2 {
            ...PriceFragment
        }
        subtotalPriceV2 {
            ...PriceFragment
        }
        financialStatus
        fulfillmentStatus
        name
        orderNumber
        shippingAddress {
            id
            phone
            firstName
            lastName
            city
            zip
            address1
            address2
            company
            province
            country
            countryCodeV2
        }
    }
`;

//subtotalPriceV2: Price of the checkout before duties, shipping and taxes.
//paymentDueV2: This is equal to the cost of the line items, duties, taxes and shipping minus discounts and gift cards.
//totalPriceV2: The sum of all the prices of all the items in the checkout, duties, taxes and discounts included.
