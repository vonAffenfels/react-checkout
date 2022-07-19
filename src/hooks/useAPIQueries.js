import React from "react";

//saleor
import SALEOR_CHECKOUT_BY_TOKEN from "../queries/saleor/checkoutByToken";
import SALEOR_CHECKOUT_CREATE from "../mutations/saleor/checkoutCreate";
import SALEOR_CHECKOUT_ADD_PRODUCT_LINE from "../mutations/saleor/checkoutAddProductLine";
import SALEOR_CHECKOUT_DELETE_PRODUCT_LINE from "../mutations/saleor/checkoutLineDelete";
import SALEOR_CHECKOUT_SHIPPING_ADDRESS_UPDATE from "../mutations/saleor/checkoutShippingAddressUpdate";
import SALEOR_CHECKOUT_BILLING_ADDRESS_UPDATE from "../mutations/saleor/checkoutBillingAddressUpdate";
import SALEOR_CHECKOUT_EMAIL_UPDATE from "../mutations/saleor/checkoutEmailUpdate";
import SALEOR_CHECKOUT_DELIVERY_METHOD_UPDATE from "../mutations/saleor/checkoutDeliveryMethodUpdate";

//shopify
import SHOPIFY_CHECKOUT_BY_TOKEN from "../queries/shopify/checkout";
import SHOPIFY_CHECKOUT_CREATE from "../mutations/shopify/checkoutCreate";

const useAPIQueries = (shop) => {
    if (!shop) {
        return {};
    }

    if (shop === "saleor") {
        return {
            CHECKOUT_BY_TOKEN: SALEOR_CHECKOUT_BY_TOKEN,
            CHECKOUT_CREATE: SALEOR_CHECKOUT_CREATE,
            getCheckoutCreateVariables: ({email, channel, lines}) => ({email, channel, lines}),
            CHECKOUT_ADD_PRODUCT_LINE: SALEOR_CHECKOUT_ADD_PRODUCT_LINE,
            CHECKOUT_DELETE_PRODUCT_LINE: SALEOR_CHECKOUT_DELETE_PRODUCT_LINE,
            CHECKOUT_SHIPPING_ADDRESS_UPDATE: SALEOR_CHECKOUT_SHIPPING_ADDRESS_UPDATE,
            CHECKOUT_BILLING_ADDRESS_UPDATE: SALEOR_CHECKOUT_BILLING_ADDRESS_UPDATE,
            CHECKOUT_EMAIL_UPDATE: SALEOR_CHECKOUT_EMAIL_UPDATE,
            CHECKOUT_DELIVERY_METHOD_UPDATE: SALEOR_CHECKOUT_DELIVERY_METHOD_UPDATE
        };
    } else if (shop === "shopify") {
        return {
            CHECKOUT_BY_TOKEN: SHOPIFY_CHECKOUT_BY_TOKEN,
            CHECKOUT_CREATE: SHOPIFY_CHECKOUT_CREATE,
            getCheckoutCreateVariables: ({email, lines}) => ({
                input: {
                    email,
                    allowPartialAddresses: true,
                    lineItems: lines
                }
            })
        };
    }
}

export default useAPIQueries;
