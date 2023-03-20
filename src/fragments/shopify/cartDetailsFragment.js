import {gql} from "@apollo/client";

import PriceFragment from "./priceFragment";

export default gql`
    ${PriceFragment}
    fragment CartDetailsFragment on Cart {
        totalQuantity
        discountAllocations {
            discountedAmount {
                ...PriceFragment
            }
        }
        discountCodes {
            applicable
            code
        }
        checkoutUrl
        id
        buyerIdentity {
            countryCode
            email
            customer {
                id
            }
        }
        cost {
            checkoutChargeAmount {
                ...PriceFragment
            }
            subtotalAmount {
                ...PriceFragment
            }
            totalAmount {
                ...PriceFragment
            }
            totalDutyAmount {
                ...PriceFragment
            }
            totalTaxAmount {
                ...PriceFragment
            }
        }
        lines(first: $linesCount) {
            nodes {
                id
                quantity
                cost {
                    amountPerQuantity {
                        ...PriceFragment
                    }
                }
                attributes {
                    key
                    value
                }
                discountAllocations {
                    discountedAmount {
                        ...PriceFragment
                    }
                }
                merchandise {
                    ...on ProductVariant {
                        id
                        title
                        requiresShipping
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
                            productType
                            sellingPlanGroups(first: 1) {
                                nodes {
                                    name
                                    sellingPlans(first: 1) {
                                        nodes {
                                            id
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        deliveryGroups(first: 2) {
            nodes {
                id
                selectedDeliveryOption {
                    code
                    title
                }
                deliveryOptions {
                    code
                    title
                    handle
                    estimatedCost {
                        ...PriceFragment
                    }
                }
                deliveryAddress {
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
        }
    }
`;
