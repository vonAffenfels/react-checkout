import React from "react";

//saleor

//shopify
import transformAddress from "../lib/transformShopifyAddressInput";
import transformLineItems from "../lib/transformShopifyLineItems";

const useCreateDraftOrder = (shop, client, webhookUri) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({checkoutToken}) => {

        };
    } else if (shop === "shopify") {
        return async ({checkoutToken, checkout, billingAddress, selectedPaymentGatewayId, customAttributes}) => {
            const input = {
                lineItems: transformLineItems(checkout.lines),
                email: checkout.email,
                billingAddress: transformAddress(billingAddress),
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
            if (customAttributes?.length) {
                input.customAttributes = customAttributes;
            }
            const {draftOrder, order} = await createDraftOrder(webhookUri, JSON.stringify({
                type: "shopify.draft_order_create",
                input: input,
                selectedPaymentGatewayId: selectedPaymentGatewayId,
            }));

            return {
                ...(checkout || {}),
                draftOrder: draftOrder,
                order: order
            }
        };
    }
}

async function createDraftOrder(webhookUri, body) {
    return fetch(webhookUri, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    }).then(res => res.json());
}

export default useCreateDraftOrder;
