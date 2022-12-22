import React from "react";

//saleor

//shopify
import transformAddress from "../lib/transformShopifyAddressInput";
import transformLineItems from "../lib/transformShopifyLineItems";

const useDeliveryMethodUpdate = (shop, client) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({checkoutToken, deliveryMethodId}) => {

        };
    } else if (shop === "shopify") {
        return async ({checkoutToken, webhookUri, checkout}) => {
            const input = {
                lineItems: transformLineItems(checkout.lines),
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
            };
            const {shippingMethod} = checkout;
            if (checkout.requiresShipping) {
                input.shippingLine = {
                    price: shippingMethod.price.amount,
                    shippingRateHandle: shippingMethod.id,
                    title: shippingMethod.name,
                };
            }
            const draftOrder = await createDraftOrder(webhookUri, input);

            if (draftOrder) {
                return {
                    ...(checkout || {}),
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
