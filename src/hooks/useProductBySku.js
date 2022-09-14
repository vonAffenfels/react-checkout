import React from "react";

//saleor

//shopify
import SHOPIFY_PRODUCT_BY_SKU from "../queries/shopify/productBySku";

const useProductBySku = (shop, client) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async () => {
            console.warn("saleor: productBySku is not defined");
            return null;
        };
    } else if (shop === "shopify") {
        return async ({sku}) => {
            //TODO filter for specific variant enable
            console.log("useProductBySku, query:", `tag:"${sku}"`);
            const {data} = await client.query({
                query: SHOPIFY_PRODUCT_BY_SKU,
                variables: {
                    query: `tag:${sku}`
                }
            });
            console.log("useProductBySku, data:", data);

            return data?.products?.nodes?.[0];
        };
    }
}

export default useProductBySku;
