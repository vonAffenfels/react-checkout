import React from "react";

//saleor

//shopify
import transformCart from "../lib/transformShopifyCartToContextCheckout";
import SHOPIFY_CART_UPDATE_PRODUCT_LINE from "../mutations/shopify/cartUpdateProductLine";
import checkQuantityMissing from "../lib/checkQuantityMissing";

/*
type may be "cart" or "checkout"
 */
const useAddProductLine = (shop, client, type) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({checkoutToken, lines, totalQuantity}) => {};
    } else if (shop === "shopify") {
        const handleCart = async ({cartId, lines, totalQuantity}) => {
            const updatedVariantId = lines?.[0]?.merchandiseId;
            const requestedQuantity = lines?.[0]?.quantity;
            const {data} = await client.mutate({
                mutation: SHOPIFY_CART_UPDATE_PRODUCT_LINE,
                variables: {
                    cartId,
                    lines: lines,
                    linesCount: (totalQuantity || 0) + 1
                }
            });

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
        const handleCheckout = async ({checkoutToken, lines}) => {
            console.warn("handleCheckout not implemented for useUpdateProductLine");
        };
        return type === "cart" ? handleCart : handleCheckout;
    }
}

export default useAddProductLine;
