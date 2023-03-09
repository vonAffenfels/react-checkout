import React from "react";

const useCreateDraftOrder = (shop, multipassUri) => {
    if (!shop) {
        return {};
    }

    if (shop === "saleor") {
        return async ({checkoutToken}) => {

        };
    } else if (shop === "shopify") {
        return async ({body}) => {
            const {token, url} = await doMultiLogin(multipassUri, JSON.stringify(body));

            return {token, url};
        };
    }
}

async function doMultiLogin(multipassUri, body) {
    return fetch(multipassUri, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    }).then(res => res.json());
}

export default useCreateDraftOrder;
