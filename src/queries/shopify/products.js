import {gql} from "@apollo/client";

import PriceFragment from "../../fragments/shopify/priceFragment";

export default gql`
    ${PriceFragment}
    query ProductList {
        products(first: 8, query: "variants.price:>0") {
            nodes {
                id
                title
                variants(first: 1) {
                    nodes {
                        id
                        price {
                            ...PriceFragment
                        }
                        sku
                        title
                    }
                }
            }
        }
    }
`;
