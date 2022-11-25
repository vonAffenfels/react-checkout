import React, {useContext} from "react";
import BuyContext from "../context/BuyContext";

//saleor
import SALEOR_CHECKOUT_CREATE from "../mutations/saleor/checkoutCreate";

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
            const variables = {
                email: "anonymous@example.com",
                channel: channel,
                lines: [
                    {
                        quantity: 1,
                        variantId: variantId
                    }
                ]
            };
            const {data} = await client.mutate({
                mutation: SALEOR_CHECKOUT_CREATE,
                variables: variables
            });

            if (data?.checkoutCreate?.errors?.length) {
                data.checkoutCreate.errors.forEach(err => console.warn(err));
            }

            if (data?.checkoutCreate?.checkout?.token) {
                return data.checkoutCreate.checkout.token;
            }
        };
    } else if (shop === "shopify") {
        return async ({input}) => {
            const variables = {
                input: input
            };

            const {data} = await client.mutate({
                mutation: SHOPIFY_CHECKOUT_CREATE,
                variables: variables
            });

            if (data?.checkoutCreate?.checkoutUserErrors?.length) {
                data.checkoutCreate.checkoutUserErrors.forEach(err => console.warn(err));
            }

            if (data?.checkoutCreate?.checkout?.id) {
                return data.checkoutCreate.checkout.id;
            }
        };
    }
}

export default useCheckoutCreate;
