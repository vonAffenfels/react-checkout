
async function completeDraftOrder(webhookUri, id, paymentPending) {
    return fetch(webhookUri, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type: "shopify.draft_order_complete",
            id: id,
            paymentPending: !!paymentPending,
        })
    }).then(res => res.json());
}
