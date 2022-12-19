import React from "react";

//saleor
import SALEOR_CHECKOUT_ADD_PRODUCT_LINE from "../mutations/saleor/checkoutAddProductLine";

//shopify
import transformCheckout from "../lib/transformShopifyCheckoutToContextCheckout";
import transformCart from "../lib/transformShopifyCartToContextCheckout";
import SHOPIFY_CHECKOUT_ADD_PRODUCT_LINE from "../mutations/shopify/checkoutAddProductLine";
import SHOPIFY_CART_ADD_PRODUCT_LINE from "../mutations/shopify/cartAddProductLine";

/*
type may be "cart" or "checkout"
 */
const useAddProductLine = (shop, client, type) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({checkoutToken, lines, totalQuantity}) => {
            const {data} = await client.mutate({
                mutation: SALEOR_CHECKOUT_ADD_PRODUCT_LINE,
                variables: {
                    checkoutToken,
                    lines,
                    linesCount: (totalQuantity || 0) + 1
                }
            });

            if (data?.checkoutLinesAdd?.errors?.length) {
                data.checkoutLinesAdd.errors.forEach(err => console.warn(err));
            }

            if (data?.checkoutLinesAdd?.checkout) {
                setCheckout(data.checkoutLinesAdd.checkout);
            }

            return data.checkoutLinesAdd.checkout;
        };
    } else if (shop === "shopify") {
        const handleCart = async ({cartId, lines, totalQuantity}) => {
            const {data} = await client.mutate({
                mutation: SHOPIFY_CART_ADD_PRODUCT_LINE,
                variables: {
                    cartId,
                    lines: lines,
                    linesCount: (totalQuantity || 0) + 1
                }
            });

            if (data?.cartLinesAdd?.userErrors?.length) {
                data.cartLinesAdd.userErrors.forEach(err => console.warn(err));
            }

            if (data?.cartLinesAdd?.cart) {
                return transformCart(data.cartLinesAdd.cart);
            }
        };
        const handleCheckout = async ({checkoutToken, lines}) => {
            const {data} = await client.mutate({
                mutation: SHOPIFY_CHECKOUT_ADD_PRODUCT_LINE,
                variables: {
                    checkoutToken,
                    lineItems: lines
                }
            });

            if (data?.checkoutLineItemsAdd?.checkoutUserErrors?.length) {
                data.checkoutLineItemsAdd.checkoutUserErrors.forEach(err => console.warn(err));
            }

            if (data?.checkoutLineItemsAdd?.checkout) {
                return transformCheckout(data.checkoutLineItemsAdd.checkout);
            }
        };
        return type === "cart" ? handleCart : handleCheckout;
    }
}

export default useAddProductLine;
