import {gql} from "@apollo/client";

export default gql`
    query ProductList {
        products(first: 8) {
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
