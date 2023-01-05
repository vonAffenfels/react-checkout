import React from "react";

//saleor
import SALEOR_CHECKOUT_SHIPPING_ADDRESS_UPDATE from "../mutations/saleor/checkoutShippingAddressUpdate";

//shopify
import SHOPIFY_CHECKOUT_SHIPPING_ADDRESS_UPDATE from "../mutations/shopify/checkoutShippingAddressUpdate";
import SHOPIFY_CART_SHIPPING_ADDRESS_UPDATE from "../mutations/shopify/cartShippingAddressUpdate";
import transformCheckout from "../lib/transformShopifyCheckoutToContextCheckout";
import transformCart from "../lib/transformShopifyCartToContextCheckout";
import transformAddress from "../lib/transformShopifyAddressInput";
import transformBuyerIdentity from "../lib/transformShopifyBuyerIdentity";

const useShippingAddressUpdate = (shop, client, type) => {
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
            });

            if (data?.checkoutShippingAddressUpdate?.errors?.length) {
                data.checkoutShippingAddressUpdate.errors.forEach(err => console.warn(err));
            }

            if (data?.checkoutShippingAddressUpdate?.checkout) {
                return data.checkoutShippingAddressUpdate.checkout;
            }
        };
    } else if (shop === "shopify") {
        const handleCart = async ({cartId, address, totalQuantity}) => {
            const {data} = await client.mutate({
                mutation: SHOPIFY_CART_SHIPPING_ADDRESS_UPDATE,
                variables: {
                    cartId,
                    buyerIdentity: JSON.parse(JSON.stringify(transformBuyerIdentity(address))),
                    linesCount: (totalQuantity || 0) + 1,
                }
            });

            if (data?.cartBuyerIdentityUpdate?.userErrors?.length) {
                data.cartBuyerIdentityUpdate.userErrors.forEach(err => console.warn(err));
            }

            if (data?.cartBuyerIdentityUpdate?.cart) {
                console.log("data.cartBuyerIdentityUpdate.cart", data.cartBuyerIdentityUpdate.cart);
                return transformCart(data.cartBuyerIdentityUpdate.cart);
            }
        };
        const handleCheckout = async ({checkoutToken, address}) => {
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

            if (data?.checkoutShippingAddressUpdateV2?.checkout) {
                return transformCheckout(data.checkoutShippingAddressUpdateV2.checkout);
            }
        };
        return type === "cart" ? handleCart : handleCheckout;
    }
}

export default useShippingAddressUpdate;
