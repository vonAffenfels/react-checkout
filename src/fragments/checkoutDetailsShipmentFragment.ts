import PriceFragment from "./priceFragment";
import AvailableShippingRatesFragment from "./availableShippingRatesFragment";

export default `
    ${PriceFragment}
    ${AvailableShippingRatesFragment}
    fragment CheckoutDetailsShipmentFragment on Checkout {
        discountApplications(first: 2) {
            pageInfo {
                hasNextPage
                hasPreviousPage
            }
            edges {
                node {
                    allocationMethod
                    targetSelection
                    targetType
                    value {
                        ...PriceFragment
                    }
                }
            }
        }
        lineItems(first: 5) {
            pageInfo {
                hasNextPage
                hasPreviousPage
            }
            edges {
                node {
                    id
                    quantity
                    variant {
                        id
                        title
                        requiresShipping
                        priceV2 {
                            ...PriceFragment
                        }
                        product {
                            id
                            title
                            productType
                            featuredImage {
                                url(transform: {maxHeight: 128, maxWidth: 128, crop: CENTER, preferredContentType: WEBP})
                                altText
                            }
                        }
                    }
                }
            }
        }
        subtotalPriceV2 {
            ...PriceFragment
        }
        paymentDueV2 {
            ...PriceFragment
        }
        totalPriceV2 {
            ...PriceFragment
        }
        totalDuties {
            ...PriceFragment
        }
        shippingLine {
            title
            priceV2 {
                ...PriceFragment
            }
        }
        email
        webUrl
        id
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
        availableShippingRates {
            ...AvailableShippingRatesFragment
        }
        shippingLine {
            handle
            title
            priceV2 {
                amount
                currencyCode
            }
        }
        requiresShipping
    }
`;

//subtotalPriceV2: Price of the checkout before duties, shipping and taxes.
//paymentDueV2: This is equal to the cost of the line items, duties, taxes and shipping minus discounts and gift cards.
//totalPriceV2: The sum of all the prices of all the items in the checkout, duties, taxes and discounts included.
