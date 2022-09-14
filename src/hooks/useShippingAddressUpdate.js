import React from "react";

//saleor
import SALEOR_CHECKOUT_SHIPPING_ADDRESS_UPDATE from "../mutations/saleor/checkoutShippingAddressUpdate";

//shopify
import SHOPIFY_CHECKOUT_SHIPPING_ADDRESS_UPDATE from "../mutations/shopify/checkoutShippingAddressUpdate";
import transformCheckout from "../lib/transformShopifyCheckoutToContextCheckout";
import transformAddress from "../lib/transformShopifyAddressInput";

const useDeleteProductLine = (shop, client) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({checkoutToken, address}) => {
            const {data} = await client.mutate({
                mutation: SALEOR_CHECKOUT_SHIPPING_ADDRESS_UPDATE,
                variables: {
                    checkoutToken,
                    address
                }
            })

            if (data?.checkoutShippingAddressUpdate?.errors?.length) {
                data.checkoutShippingAddressUpdate.errors.forEach(err => console.warn(err));
            }

            if (data?.checkoutShippingAddressUpdate?.checkout) {
                return data.checkoutShippingAddressUpdate.checkout;
            }
        };
    } else if (shop === "shopify") {
        return async ({checkoutToken, address}) => {
            console.log(JSON.parse(JSON.stringify(transformAddress(address))))
            const {data} = await client.mutate({
                mutation: SHOPIFY_CHECKOUT_SHIPPING_ADDRESS_UPDATE,
                variables: {
                    checkoutToken,
                    address: JSON.parse(JSON.stringify(transformAddress(address))),
                }
            });

            if (data?.checkoutShippingAddressUpdateV2?.checkoutUserErrors?.length) {
                data.checkoutShippingAddressUpdateV2.checkoutUserErrors.forEach(err => console.warn(err));
            }

            console.log("data?.checkoutShippingAddressUpdateV2?.checkout", data?.checkoutShippingAddressUpdateV2?.checkout);
            if (data?.checkoutShippingAddressUpdateV2?.checkout) {
                const transformedCheckout = transformCheckout(data.checkoutShippingAddressUpdateV2.checkout);
                console.log("transformedCheckout", transformedCheckout);
                return transformedCheckout;
            }
        };
    }
}

export default useDeleteProductLine;
