import React from "react";

//saleor

//shopify
import transformCart from "../lib/transformShopifyCartToContextCheckout";
import SHOPIFY_CART_UPDATE_PRODUCT_LINE from "../mutations/shopify/cartUpdateProductLine";
import checkQuantityMissing from "../lib/checkQuantityMissing";

/*
type may be "cart" or "checkout"
 */
const useAddProductLine = (shop, uri, apiKey) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({checkoutToken, lines, totalQuantity}) => {};
    } else if (shop === "shopify") {
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
                    query: SHOPIFY_CART_UPDATE_PRODUCT_LINE,
                    variables: {
                        cartId,
                        lines: lines,
                        linesCount: (totalQuantity || 0) + 1
                    }
                }),
            }).then(res => res.json());

            if (data?.cartLinesUpdate?.userErrors?.length) {
                data.cartLinesUpdate.userErrors.forEach(err => console.warn(err));
            }

            if (data?.cartLinesUpdate?.cart) {
                checkQuantityMissing({
                    lines: data.cartLinesUpdate.cart.lines.nodes,
                    requestedQuantity,
                    updatedVariantId,
                });

                return transformCart(data.cartLinesUpdate.cart);
            }
        };
    }
}

export default useAddProductLine;
