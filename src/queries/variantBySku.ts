export default `
    query VariantBySku($query: String!) {
        productVariants (first: 1, query: $query) {
            nodes {
                id
                sku
            }
        }
    }
`;
