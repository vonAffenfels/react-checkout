import React, {useContext} from "react";
import BuyContext from "../context/BuyContext";

//saleor
import SALEOR_CHECKOUT_CREATE from "../mutations/saleor/checkoutCreate";

//shopify
import SHOPIFY_CHECKOUT_CREATE from "../mutations/shopify/checkoutCreate";

const useCheckoutCreate = (shop, client) => {
    const {webhookUri} = useContext(BuyContext);

    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({channel, variantId}) => {
            const variables = {
                email: "anonymous@example.com",
                channel: channel,
                lines: [
                    {
                        quantity: 1,
                        variantId: variantId
                    }
                ]
            };
            const {data} = await client.mutate({
                mutation: SALEOR_CHECKOUT_CREATE,
                variables: variables
            });

            if (data?.checkoutCreate?.errors?.length) {
                data.checkoutCreate.errors.forEach(err => console.warn(err));
            }

            if (data?.checkoutCreate?.checkout?.token) {
                return data.checkoutCreate.checkout.token;
            }
        };
    } else if (shop === "shopify") {
        return async ({variantId}) => {
            const variables = {
                input: {
                    allowPartialAddresses: true,
                    lineItems: [
                        {
                            quantity: 1,
                            variantId: "gid://shopify/ProductVariant/" + String(variantId).replace("gid://shopify/ProductVariant/", "")
                        }
                    ]
                }
            };

            const {data} = await client.mutate({
                mutation: SHOPIFY_CHECKOUT_CREATE,
                variables: variables
            });

            if (data?.checkoutCreate?.checkoutUserErrors?.length) {
                data.checkoutCreate.checkoutUserErrors.forEach(err => console.warn(err));
            }

            if (data?.checkoutCreate?.checkout?.id) {
                return data.checkoutCreate.checkout.id;
            }
        };
    }
}

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

export default useCheckoutCreate;