import {gql} from "@apollo/client";

export default gql`
    query ($checkoutToken:ID!) {
        node(id:$checkoutToken) {
            id
            ... on Checkout {
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
                                ... on MoneyV2 {
                                    amount
                                }
                                ... on PricingPercentageValue {
                                    percentage
                                }
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
                            quantity
                            variant {
                                id
                                price
                            }
                        }
                    }
                }
                lineItemsSubtotalPrice {
                    amount
                }
                paymentDueV2 {
                    amount
                }
            }
        }
    }
`;
