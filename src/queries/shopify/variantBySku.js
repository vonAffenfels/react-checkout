import {gql} from "@apollo/client";

export default gql`
    query VariantBySku($query: String!) {
        productVariants (first: 1, query: $query) {
            nodes {
                id
                sku
            }
        }
    }
`;
