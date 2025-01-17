import React from "react";

//shopify
import SHOPIFY_PRODUCT_BY_ID from "../queries/shopify/productById";
import SHOPIFY_PRODUCT_BY_ID_WITH_IMAGE from "../queries/shopify/productByIdWithImage";

const useProductById = (shop, uri, apiKey) => {
    return async ({id, withImage}) => {
        const {data} = await fetch(uri, {
            method: "POST",
            headers: {
                "X-Shopify-Storefront-Access-Token": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: withImage ? SHOPIFY_PRODUCT_BY_ID_WITH_IMAGE : SHOPIFY_PRODUCT_BY_ID,
                variables: {id}
            }),
        }).then(res => res.json());

        return data?.product;
    };
}

export default useProductById;
