import React from "react";

//saleor

//shopify
import SHOPIFY_ORDER from "../queries/shopify/order";

const useOrder = (shop, client) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async ({checkoutToken}) => {

        };
    } else if (shop === "shopify") {
        return async ({orderId}) => {
            console.log("variables", {orderId})
            const data = await client.query({
                query: SHOPIFY_ORDER,
                variables: {orderId}
            });
            console.log("data", data);

            if (data.errors?.length) {
                data.errors.forEach(err => console.warn(err));
                return null;
            }

            return data?.order;
        };
    }
}

export default useOrder;
