import {gql} from "@apollo/client";

import PriceFragment from "./priceFragment";

export default gql`
    ${PriceFragment}
    fragment CheckoutDetailsFragment on Checkout {
        availableShippingRates {
            ready
            shippingRates {
                handle
                priceV2 {
                    amount
                }
                title
            }
        }
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
                endCursor
            }
            edges {
                node {
                    id
                    customAttributes {
                        key
                        value
                    }
                    quantity
                    variant {
                        id
                        title
                        priceV2 {
                            ...PriceFragment
                        }
                        image {
                            url(transform: {maxHeight: 128, maxWidth: 128, crop: CENTER, preferredContentType: WEBP})
                            altText
                        }
                        product {
                            id
                            title
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
        requiresShipping
        order {
            id
        }
    }
`;

//subtotalPriceV2: Price of the checkout before duties, shipping and taxes.
//paymentDueV2: This is equal to the cost of the line items, duties, taxes and shipping minus discounts and gift cards.
//totalPriceV2: The sum of all the prices of all the items in the checkout, duties, taxes and discounts included.
