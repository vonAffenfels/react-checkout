import React from "react";

//saleor

//shopify
import transformCart from "../lib/transformShopifyCartToContextCheckout";
import SHOPIFY_CART from "../queries/shopify/cart";

const useCart = (shop, client) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async (checkoutToken) => {};
    } else if (shop === "shopify") {
        return async (cartId, totalQuantity) => {
            const {data} = await client.query({
                query: SHOPIFY_CART,
                variables: {cartId, linesCount: (totalQuantity || 0) + 1}
            });

            return transformCart(data.cart);
        };
    }
}

export default useCart;
