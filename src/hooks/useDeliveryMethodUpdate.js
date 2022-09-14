import React from "react";

//saleor
import SALEOR_CHECKOUT_DELIVERY_METHOD_UPDATE from "../mutations/saleor/checkoutDeliveryMethodUpdate";

//shopify
import transformAddress from "../lib/transformShopifyAddressInput";
import transformLineItems from "../lib/transformShopifyLineItems";

const useDeliveryMethodUpdate = (shop, client) => {
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
        return async ({checkoutToken, deliveryMethodId, webhookUri, checkout}) => {
            console.log("useDeliveryMethodUpdate", checkoutToken, deliveryMethodId, webhookUri, checkout);
            if (checkout.draftOrder) {
                console.log("already having an draftOrder", checkout);
                return checkout;
            }

            const shippingMethod = checkout.shippingMethods.filter(v => v.id === deliveryMethodId)?.[0];

            if (!shippingMethod) {
                return checkout;
            }

            const draftOrder = await createDraftOrder(webhookUri, {
                lineItems: transformLineItems(checkout.lines),
                shippingLine: {
                    price: shippingMethod.price.amount,
                    shippingRateHandle: shippingMethod.id,
                    title: shippingMethod.name,
                },
                email: checkout.email,
                billingAddress: transformAddress(checkout.billingAddress || checkout.shippingAddress),
                shippingAddress: transformAddress(checkout.shippingAddress),
                metafields: [
                    {
                        key: "checkoutId",
                        namespace: "checkoutId",
                        type: "single_line_text_field",
                        value: checkoutToken
                    }
                ]
            });

            console.log("draftOrder", draftOrder);

            if (draftOrder) {
                return {
                    ...(checkout || {}),
                    //TODO way to make this not being overwritten?!
                    shippingMethod: shippingMethod,
                    draftOrder: draftOrder
                }
            } else {
                return checkout;
            }
        };
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
