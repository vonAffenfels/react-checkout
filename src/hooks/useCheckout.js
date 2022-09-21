import React from "react";

//saleor
import SALEOR_CHECKOUT_BY_TOKEN from "../queries/saleor/checkoutByToken";

//shopify
import transformCheckout from "../lib/transformShopifyCheckoutToContextCheckout";
import SHOPIFY_CHECKOUT from "../queries/shopify/checkout";

const useCheckout = (shop, client) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async (checkoutToken) => {
            const {data} = await client.query({
                query: SALEOR_CHECKOUT_BY_TOKEN,
                variables: {checkoutToken}
            });

            return data?.checkout;
        };
    } else if (shop === "shopify") {
        return async (checkoutToken) => {
            const {data} = await client.query({
                query: SHOPIFY_CHECKOUT,
                variables: {checkoutToken}
            });

            if (data?.node?.__typename !== "Checkout") {
                return null;
            }

            return transformCheckout(data.node);
        };
    }
}

export default useCheckout;
