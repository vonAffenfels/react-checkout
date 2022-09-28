import React from "react";

//saleor
import SALEOR_CHECKOUT_ADD_PRODUCT_LINE from "../mutations/saleor/checkoutAddProductLine";

//shopify
import transformCheckout from "../lib/transformShopifyCheckoutToContextCheckout";
import SHOPIFY_CHECKOUT_ADD_PRODUCT_LINE from "../mutations/shopify/checkoutAddProductLine";

const useAddProductLine = (shop, client) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({checkoutToken, lines}) => {
            const {data} = await client.mutate({
                mutation: SALEOR_CHECKOUT_ADD_PRODUCT_LINE,
                variables: {
                    checkoutToken,
                    lines,
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
        return async ({checkoutToken, lines}) => {
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
    }
}

export default useAddProductLine;
