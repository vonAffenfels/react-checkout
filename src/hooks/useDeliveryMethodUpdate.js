import React from "react";

//saleor
import SALEOR_CHECKOUT_DELIVERY_METHOD_UPDATE from "../mutations/saleor/checkoutDeliveryMethodUpdate";

//shopify
import SHOPIFY_CART_DELIVERY_METHOD_UPDATE from "../mutations/shopify/cartSelectedDeliveryOptionsUpdate";
import transformAddress from "../lib/transformShopifyAddressInput";
import transformLineItems from "../lib/transformShopifyLineItems";
import transformCart from "../lib/transformShopifyCartToContextCheckout";

const useDeliveryMethodUpdate = (shop, client, type) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({checkoutToken, deliveryMethodId}) => {
            const {data} = await client.mutate({
                mutation: SALEOR_CHECKOUT_DELIVERY_METHOD_UPDATE,
                variables: {
                    checkoutToken,
                    deliveryMethodId
                }
            });

            if (data?.checkoutDeliveryMethodUpdate?.errors?.length) {
                data.checkoutDeliveryMethodUpdate.errors.forEach(err => console.warn(err));
            }

            if (data?.checkoutDeliveryMethodUpdate?.checkout) {
                return data.checkoutDeliveryMethodUpdate.checkout;
            }
        };
    } else if (shop === "shopify") {
        const handleCart = async ({cartId, deliveryMethodId, cart}) => {
            let deliveryGroupId = "";
            let deliveryOptionHandle = "";
            cart.shippingMethods.forEach(shippingMethod => {
                if (shippingMethod.id === deliveryMethodId) {
                    deliveryGroupId = shippingMethod.deliveryGroupId;
                    deliveryOptionHandle = shippingMethod.handle;
                }
            });
            const {data} = await client.mutate({
                mutation: SHOPIFY_CART_DELIVERY_METHOD_UPDATE,
                variables: {
                    cartId,
                    selectedDeliveryOptions: [{
                        deliveryGroupId: deliveryGroupId,
                        deliveryOptionHandle: deliveryOptionHandle
                    }],
                    linesCount: (cart?.totalQuantity || 0) + 1
                }
            });

            if (data.cartSelectedDeliveryOptionsUpdate?.userErrors?.length) {
                data.cartSelectedDeliveryOptionsUpdate.userErrors.forEach(console.warn);
            }

            if (data?.cartSelectedDeliveryOptionsUpdate?.cart) {
                return transformCart(data.cartSelectedDeliveryOptionsUpdate.cart);
            }
        };
        const handleCheckout = async ({checkoutToken, deliveryMethodId, webhookUri, checkout}) => {
            console.log("useDeliveryMethodUpdate", checkoutToken, deliveryMethodId, webhookUri, checkout);
            if (checkout.draftOrder) {
                console.log("already having an draftOrder", checkout);
                return checkout;
            }

            const shippingMethod = checkout.shippingMethods.filter(v => v.id === deliveryMethodId)?.[0];

            if (!shippingMethod) {
                return checkout;
            }

            return {
                ...(checkout || {}),
                shippingMethod: shippingMethod,
            }
        };
        return type === "cart" ? handleCart : handleCheckout;
    }
}

async function createDraftOrder(webhookUri, input) {
    return fetch(webhookUri, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type: "shopify.draft_order_create",
            input: input
        })
    }).then(res => res.json());
}

export default useDeliveryMethodUpdate;
