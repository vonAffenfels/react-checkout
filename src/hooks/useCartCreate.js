import React, {useContext} from "react";
import BuyContext from "../context/BuyContext";

//saleor

//shopify
import SHOPIFY_CHECKOUT_CREATE from "../mutations/shopify/checkoutCreate";
import SHOPIFY_CART_CREATE from "../mutations/shopify/cartCreate";

const useCheckoutCreate = (shop, client) => {
    const {webhookUri} = useContext(BuyContext);

    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({channel, variantId}) => {

        };
    } else if (shop === "shopify") {
        return async ({variantId}) => {
            const lines = [
                {
                    quantity: 1,
                    merchandiseId: "gid://shopify/ProductVariant/" + String(variantId).replace("gid://shopify/ProductVariant/", "")
                }
            ];
            const {data} = await client.mutate({
                mutation: SHOPIFY_CART_CREATE,
                variables: {
                    input: {
                        lines: lines,
                    }
                }
            });

            if (data?.cartCreate?.userErrors?.length) {
                data.cartCreate.userErrors.forEach(err => console.warn(err));
            }

            if (data?.cartCreate?.cart?.id) {
                return data.cartCreate.cart.id;
            }
        };
    }
}

export default useCheckoutCreate;
