import React from "react";

//saleor
import SALEOR_CHECKOUT_LINE_DELETE from "../mutations/saleor/checkoutLineDelete";

//shopify
import SHOPIFY_CHECKOUT_LINE_DELETE from "../mutations/shopify/checkoutLineDelete";
import SHOPIFY_CART_LINE_DELETE from "../mutations/shopify/cartLineDelete";
import transformCheckout from "../lib/transformShopifyCheckoutToContextCheckout";
import transformCart from "../lib/transformShopifyCartToContextCheckout";

const useDeleteProductLine = (shop, client, type) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({checkoutToken, lineId}) => {
            const {data} = await client.mutate({
                mutation: SALEOR_CHECKOUT_LINE_DELETE,
                variables: {
                    checkoutToken,
                    lineId
                }
            });

            if (data?.checkoutLineDelete?.errors?.length) {
                data.checkoutLineDelete.errors.forEach(err => console.warn(err));
            }

            if (data?.checkoutLineDelete?.checkout) {
                return data.checkoutLineDelete.checkout;
            }
        };
    } else if (shop === "shopify") {
        const handleCart = async ({cartId, lineId, totalQuantity}) => {
            const {data} = await client.mutate({
                mutation: SHOPIFY_CART_LINE_DELETE,
                variables: {
                    cartId,
                    lineIds: [lineId],
                    linesCount: (totalQuantity || 0),
                }
            });

            if (data?.cartLinesRemove?.userErrors?.length) {
                data.cartLinesRemove.userErrors.forEach(err => console.warn(err));
            }

            if (data?.cartLinesRemove?.cart) {
                return transformCart(data.cartLinesRemove.cart);
            }
        };
        const handleCheckout = async ({checkoutToken, lineId}) => {
            const {data} = await client.mutate({
                mutation: SHOPIFY_CART_LINE_DELETE,
                variables: {
                    checkoutToken,
                    lineItemIds: [lineId]
                }
            });

            if (data?.checkoutLineItemsRemove?.checkoutUserErrors?.length) {
                data.checkoutLineItemsRemove.checkoutUserErrors.forEach(err => console.warn(err));
            }

            if (data?.checkoutLineItemsRemove?.checkout) {
                return transformCheckout(data.checkoutLineItemsRemove.checkout);
            }
        };
        return type === "cart" ? handleCart : handleCheckout;
    }
}

export default useDeleteProductLine;
