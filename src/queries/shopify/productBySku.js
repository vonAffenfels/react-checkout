import {gql} from "@apollo/client";

export default gql`
    query ProductBySku($query: String!, $variantLimit: Int!, $productCursor: String, $variantCursor: String) {
        products(first: 1, query: $query, after: $productCursor) {
            nodes {
                id
                sellingPlanGroups(first: 1) {
                    nodes {
                        sellingPlans(first: 1) {
                            nodes {
                                id
                            }
                        }
                    }
                }
                variants(first: $variantLimit, after: $variantCursor) {
                    nodes {
                        id
                        sku
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`;
