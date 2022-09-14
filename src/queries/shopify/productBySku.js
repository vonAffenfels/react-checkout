import {gql} from "@apollo/client";

export default gql`
    query ProductBySku($query: String!) {
        products(first: 1, query: $query) {
            nodes {
                id
                title
                variants(first: 1) {
                    nodes {
                        id
                        price
                        sku
                        title
                    }
                }
            }
        }
    }
`;
