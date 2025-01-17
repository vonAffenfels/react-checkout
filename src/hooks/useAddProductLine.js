import React from "react";

//shopify
import transformCart from "../lib/transformShopifyCartToContextCheckout";
import SHOPIFY_CART_ADD_PRODUCT_LINE from "../mutations/shopify/cartAddProductLine";
import checkQuantityMissing from "../lib/checkQuantityMissing";

const useAddProductLine = (uri, apiKey) => {
    return async ({cartId, lines, totalQuantity}) => {
        const updatedVariantId = lines?.[0]?.merchandiseId;
        const requestedQuantity = lines?.[0]?.quantity;
        const {data} = await fetch(uri, {
            method: "POST",
            headers: {
                "X-Shopify-Storefront-Access-Token": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: SHOPIFY_CART_ADD_PRODUCT_LINE,
                variables: {
                    cartId,
                    lines: lines,
                    linesCount: (totalQuantity || 0) + 1
                }
            }),
        }).then(res => res.json());

        if (data?.cartLinesAdd?.userErrors?.length) {
            data.cartLinesAdd.userErrors.forEach(err => console.warn(err));
        }

        if (data?.cartLinesAdd?.cart) {
            checkQuantityMissing({
                lines: data.cartLinesAdd.cart.lines.nodes,
                requestedQuantity,
                updatedVariantId,
            });

            return transformCart(data.cartLinesAdd.cart);
        }
    };
}

export default useAddProductLine;
