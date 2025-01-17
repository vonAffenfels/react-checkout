import React from "react";

//shopify
import SHOPIFY_CART_CREATE from "../mutations/shopify/cartCreate";
import checkQuantityMissing from "../lib/checkQuantityMissing";

const useCartCreate = (uri, apiKey) => {
    return async ({lines, redirectToMultipass}) => {
        const updatedVariantId = lines?.[0]?.merchandiseId;
        const requestedQuantity = lines?.[0]?.quantity;
        const {data} = await fetch(uri, {
            method: "POST",
            headers: {
                "X-Shopify-Storefront-Access-Token": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: SHOPIFY_CART_CREATE,
                variables: {
                    input: {
                        lines: lines,
                    },
                    linesCount: lines.length,
                }
            }),
        }).then(res => res.json());

        if (data?.cartCreate?.userErrors?.length) {
            data.cartCreate.userErrors.forEach(err => console.warn(err));
        }

        if (data?.cartCreate?.cart?.id) {
            checkQuantityMissing({
                lines: data.cartCreate.cart.lines.nodes,
                requestedQuantity,
                updatedVariantId,
            });

            return {
                id: data.cartCreate.cart.id,
                webUrl: data.cartCreate.cart.checkoutUrl,
            };
        }
    };
}

export default useCartCreate;
