import PriceFragment from "../fragments/priceFragment";

export default `
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
