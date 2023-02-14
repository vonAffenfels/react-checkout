import React from "react";

//saleor

//shopify
import SHOPIFY_PRODUCT_BY_ID from "../queries/shopify/productById";

const useProductById = (shop, client) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async () => {
            console.warn("saleor: productBySku is not defined");
            return null;
        };
    } else if (shop === "shopify") {
        return async ({id}) => {
            const {data} = await client.query({
                query: SHOPIFY_PRODUCT_BY_ID,
                variables: {id}
            });

            return data?.product;
        };
    }
}

export default useProductById;
