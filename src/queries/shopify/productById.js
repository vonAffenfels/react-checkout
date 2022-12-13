import {gql} from "@apollo/client";

export default gql`
    query ProductById($id: ID!) {
        product(id: $id) {
            id
            tags
            handle
            variants(first: 5) {
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
