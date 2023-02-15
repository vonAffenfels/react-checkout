import React from "react";

const useDraftOrder = (shop, client, webhookUri) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({checkoutToken}) => {

        };
    } else if (shop === "shopify") {
        return async ({draftOrderId}) => {

            const draftOrder = await getDraftOrder(webhookUri, JSON.stringify({
                type: "shopify.find_draft_order",
                draftOrderId: draftOrderId,
            }));

            return draftOrder;
        };
    }
}

async function getDraftOrder(webhookUri, body) {
    return fetch(webhookUri, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    }).then(res => res.json());
}

export default useDraftOrder;
