import React from "react";

//saleor

//shopify
import SHOPIFY_PRODUCT_LIST from "../queries/shopify/products";

const useProductList = (shop, client) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({}) => {
            return [];
        };
    } else if (shop === "shopify") {
        return async ({}) => {
            const {data} = await client.query({
                query: SHOPIFY_PRODUCT_LIST,
            });

            return data?.products?.nodes || [];
        };
    }
}

export default useProductList;
