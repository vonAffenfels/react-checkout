import React from "react";

//saleor
import SALEOR_CHECKOUT_BILLING_ADDRESS_UPDATE from "../mutations/saleor/checkoutBillingAddressUpdate";

//shopify
import SHOPIFY_CHECKOUT_BILLING_ADDRESS_UPDATE from "../mutations/shopify/checkoutBillingAddressUpdate";
import transformCheckout from "../lib/transformShopifyCheckoutToContextCheckout";
import transformAddress from "../lib/transformShopifyAddressInput";

const useDeleteProductLine = (shop, client) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({checkoutToken, address}) => {
            const {data} = await client.mutate({
                mutation: SALEOR_CHECKOUT_BILLING_ADDRESS_UPDATE,
                variables: {
                    checkoutToken,
                    address
                }
            })

            if (data?.checkoutBillingAddressUpdate?.errors?.length) {
                data.checkoutBillingAddressUpdate.errors.forEach(err => console.warn(err));
            }

            if (data?.checkoutBillingAddressUpdate?.checkout) {
                return data.checkoutShippingAddressUpdate.checkout;
            }
        };
    } else if (shop === "shopify") {
        return async ({checkoutToken, address}) => {
            const {data} = await client.mutate({
                mutation: SHOPIFY_CHECKOUT_BILLING_ADDRESS_UPDATE,
                variables: {
                    checkoutToken,
                    address: transformAddress(address),
                }
            });

            if (data?.checkoutShippingAddressUpdateV2?.checkoutUserErrors?.length) {
                data.checkoutShippingAddressUpdateV2.checkoutUserErrors.forEach(err => console.warn(err));
            }

            if (data?.checkoutShippingAddressUpdateV2?.checkout) {
                return transformCheckout(data.checkoutShippingAddressUpdateV2.checkout);
                }
        };
    }
}

export default useDeleteProductLine;
