import React from "react";

//saleor

//shopify
import transformCart from "../lib/transformShopifyCartToContextCheckout";
import SHOPIFY_CART_DISCOUNT_CODE_UPDATE from "../mutations/shopify/cartDiscountCodesUpdate";
import SHOPIFY_CHECKOUT_DISCOUNT_CODE_UPDATE from "../mutations/shopify/checkoutDiscountCodeUpdate";

/*
type may be "cart" or "checkout"
 */
const useAddProductLine = (shop, client, type) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({checkoutToken}) => {};
    } else if (shop === "shopify") {
        const handleCart = async ({cartId, discountCodes, totalQuantity}) => {
            const {data} = await client.mutate({
                mutation: SHOPIFY_CART_DISCOUNT_CODE_UPDATE,
                variables: {
                    cartId,
                    discountCodes: discountCodes,
                    linesCount: (totalQuantity || 0) + 1
                }
            });

            if (data?.cartDiscountCodesUpdate?.userErrors?.length) {
                data.cartDiscountCodesUpdate.userErrors.forEach(err => console.warn(err));
            }

            if (data?.cartDiscountCodesUpdate?.cart) {
                return transformCart(data.cartDiscountCodesUpdate.cart);
            }
        };
        const handleCheckout = async ({checkoutToken, discountCode}) => {
            const {data} = await client.mutate({
                mutation: SHOPIFY_CHECKOUT_DISCOUNT_CODE_UPDATE,
                variables: {
                    checkoutToken: checkoutToken,
                    discountCode: discountCode,
                }
            });

            if (data?.checkoutDiscountCodeApplyV2?.checkoutUserErrors?.length) {
                data.checkoutDiscountCodeApplyV2.checkoutUserErrors.forEach(err => console.warn(err));
            }
        };
        return type === "cart" ? handleCart : handleCheckout;
    }
}

export default useAddProductLine;
