import React from "react";

//saleor
import SALEOR_CHECKOUT_LINE_DELETE from "../mutations/saleor/checkoutLineDelete";

//shopify
import SHOPIFY_CHECKOUT_LINE_DELETE from "../mutations/shopify/checkoutLineDelete";
import transformCheckout from "../lib/transformShopifyCheckoutToContextCheckout";

const useDeleteProductLine = (shop, client) => {
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
        return async ({checkoutToken, lineId}) => {
            const {data} = await client.mutate({
                mutation: SHOPIFY_CHECKOUT_LINE_DELETE,
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
    }
}

export default useDeleteProductLine;
