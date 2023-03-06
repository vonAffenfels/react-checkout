import React, {useContext} from "react";
import BuyContext from "../context/BuyContext";

//saleor

//shopify
import SHOPIFY_CHECKOUT_CREATE from "../mutations/shopify/checkoutCreate";
import SHOPIFY_CART_CREATE from "../mutations/shopify/cartCreate";
import checkQuantityMissing from "../lib/checkQuantityMissing";

const useCheckoutCreate = (shop, client) => {
    const {webhookUri} = useContext(BuyContext);

    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({channel, variantId}) => {

        };
    } else if (shop === "shopify") {
        return async ({lines}) => {
            const updatedVariantId = lines?.[0]?.merchandiseId;
            const requestedQuantity = lines?.[0]?.quantity;
            const {data} = await client.mutate({
                mutation: SHOPIFY_CART_CREATE,
                variables: {
                    input: {
                        lines: lines,
                    },
                    linesCount: lines.length,
                }
            });

            if (data?.cartCreate?.userErrors?.length) {
                data.cartCreate.userErrors.forEach(err => console.warn(err));
            }

            if (data?.cartCreate?.cart?.id) {
                checkQuantityMissing({
                    lines: data.cartCreate.cart.lines.nodes,
                    requestedQuantity,
                    updatedVariantId,
                });

                return data.cartCreate.cart.id;
            }
        };
    }
}

export default useCheckoutCreate;
