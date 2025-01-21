import React from "react";

//shopify
import SHOPIFY_PRODUCT_BY_ID from "../queries/productById";
import SHOPIFY_PRODUCT_BY_ID_WITH_IMAGE from "../queries/productByIdWithImage";

const useProductById = (uri: string, apiKey: string) => {
    return async ({id, withImage}: {id: string, withImage: boolean}) => {
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
