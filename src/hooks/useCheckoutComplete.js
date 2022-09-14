
//TODO is debug, later remove
// try {
//     const createdDraftOrder = await createDraftOrder(webhookUri, variables);
//     console.log("createdDraftOrder", createdDraftOrder);
//     const completedDraftOrder = await completeDraftOrder(webhookUri, createdDraftOrder.id, false);
//     console.log("completedDraftOrder", completedDraftOrder);
// } catch (e) {
//     console.error(e);
// }

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
