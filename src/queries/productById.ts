export default `
    query ProductById($id: ID!) {
        product(id: $id) {
            id
            tags
            title
            handle
            variants(first: 3) {
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
`;
