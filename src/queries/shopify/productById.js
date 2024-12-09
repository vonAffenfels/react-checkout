export default `
    query ProductById($id: ID!) {
        product(id: $id) {
            id
            tags
            title
            handle
            sellingPlanGroups(first: 5) {
                nodes {
                    name
                    sellingPlans(first: 3) {
                        nodes {
                            id
                        }
                    }
                }
            }
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
