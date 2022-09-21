import {gql} from "@apollo/client";

export default gql`
    query ProductBySku($query: String!, $variantLimit: Int!, $variantCursor: String) {
        products(first: 1, query: $query) {
            nodes {
                id
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
        }
    }
`;
