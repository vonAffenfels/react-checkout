import React from "react";

//saleor

//shopify
import transformCart from "../lib/transformShopifyCartToContextCheckout";
import SHOPIFY_CART from "../queries/shopify/cart";

const useCart = (shop, uri, apiKey) => {
    if (!shop) {
        return {};
    }

    if (shop === "saleor") {
        return async () => {};
    } else if (shop === "shopify") {
        return async (cartId, totalQuantity) => {
            const {data} = await fetch(uri, {
                method: "POST",
                headers: {
                    "X-Shopify-Storefront-Access-Token": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: SHOPIFY_CART,
                    variables: {cartId, linesCount: (totalQuantity || 0) + 1}
                }),
            }).then(res => res.json());

            return transformCart(data.cart);
        };
    }
}

export default useCart;
