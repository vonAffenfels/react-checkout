import React from "react";

//saleor
import SALEOR_CHECKOUT_EMAIL_UPDATE from "../mutations/saleor/checkoutEmailUpdate";

//shopify
import SHOPIFY_CHECKOUT_EMAIL_UPDATE from "../mutations/shopify/checkoutEmailUpdate";
import transformCheckout from "../lib/transformShopifyCheckoutToContextCheckout";
import useShippingAddressUpdate from "./useShippingAddressUpdate";

const useEmailUpdate = (shop, client, type) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({checkoutToken, email}) => {
            const {data} = await client.mutate({
                mutation: SALEOR_CHECKOUT_EMAIL_UPDATE,
                variables: {
                    checkoutToken,
                    email
                }
            });

            if (data?.checkoutEmailUpdate?.errors?.length) {
                data.checkoutEmailUpdate.errors.forEach(err => console.warn(err));
            }

            if (data?.checkoutEmailUpdate?.checkout) {
                return data.checkoutEmailUpdate.checkout;
            }
        };
    } else if (shop === "shopify") {
        const handleCart = useShippingAddressUpdate(shop, client, "cart");
        const handleCheckout = async ({checkoutToken, email}) => {
            const {data} = await client.mutate({
                mutation: SHOPIFY_CHECKOUT_EMAIL_UPDATE,
                variables: {
                    checkoutToken,
                    email
                }
            });

            if (data?.checkoutEmailUpdateV2?.checkoutUserErrors?.length) {
                data.checkoutEmailUpdateV2.checkoutUserErrors.forEach(err => console.warn(err));
            }

            if (data?.checkoutEmailUpdateV2?.checkout) {
                return transformCheckout(data.checkoutEmailUpdateV2.checkout);
            }
        };
        return type === "cart" ? handleCart : handleCheckout;
    }
}

export default useEmailUpdate;
