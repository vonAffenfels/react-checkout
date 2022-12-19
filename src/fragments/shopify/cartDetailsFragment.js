import {gql} from "@apollo/client";

import PriceFragment from "./priceFragment";
//TODO lines iterable

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
                attribute(key: "bonus_id") {
                    value
                }
                merchandise {
                    ...on ProductVariant {
                        id
                        title
                        requiresShipping
                        priceV2 {
                            ...PriceFragment
                        }
                        product {
                            id
                            title
                            featuredImage {
                                url
                                altText
                            }
                        }
                    }
                }
            }
        }
        # TODO what exactly is a group? because options already is an array, multiple needed here?
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



# TODO shippingLine seems to be the selectedDeliveryOption
#        shippingLine {
#            title
#            priceV2 {
#                ...PriceFragment
#            }
#        }
#        requiresShipping
    }
`;
