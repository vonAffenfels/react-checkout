export default {
    shop: "shopify",
    uri: "https://delius-klasing.myshopify.com/api/2022-10/graphql.json",
    webhookUri: "https://mmstupicl7.execute-api.eu-central-1.amazonaws.com/shopify",
    storefrontApiKey: "21ec7ad8aceac22f6fbd61e1fec7c27b",
    channel: function channel() {
        return globalThis?.window?.isRetailer ? "b2b" : "b2c";
    },
    availablePaymentGateways: [
        {
            id: "stripe",
            name: "Stripe",
            description: "Kreditkarte, Lastschrift, SEPA-Überweisung, Giropay",
            isDisabled: function isStripeDisabled(cart) {
                return globalThis?.window?.isRetailer;
            },
            isHidden: function isStripeHidden(cart) {
                return globalThis?.window?.isRetailer;
            },
            isDefault: true,
        },
        {
            id: "invoice",
            name: "Rechnung",
            isDisabled: function isInvoiceDisabled(cart) {
                return cart?.hasDigitalItem && !globalThis?.window?.isRetailer;
            },
            isHidden: function isInvoiceHidden(cart) {
                return false;
            },
            isDefault: true,
        },
        {
            id: "paypal",
            name: "PayPal",
            isDisabled: function isPayPalDisabled(cart) {
                return cart?.hasSubscriptionItem || globalThis?.window?.isRetailer;
            },
            isHidden: function isPayPalHidden(cart) {
                return globalThis?.window?.isRetailer;
            },
        },
    ],
    paymentProviders: [
        {
            name: "stripe",
            config: {
                apiUri: "https://mmstupicl7.execute-api.eu-central-1.amazonaws.com/shopify",
                apiKey: "pk_test_51MCi5UGfzuneej5pJsAnnx22NIEU3B2Ak7xdhuNuKROMp4uHWuxpCKJ4nlOOovqxmSRl1qwOHFyMXtyQDN9cmgRC00oy2Zctgg"
            }
        },
        {
            name: "invoice",
            config: {}
        },
        {
            name: "paypal",
            config: {
                apiUri: "https://mmstupicl7.execute-api.eu-central-1.amazonaws.com/shopify",
                apiKey: "AZQxQ7RoNULnLO2A6Um5rEOZHfn4L5o33RlkYtrOKKUc0A1vpDyPb57hg6PhqypLFher1dxo7lWPyiAD"
            }
        }
    ],
    texts: {
        subCheckoutSummary: "Hinweis: Sie können der Nutzung Ihrer E-Mail-Adresse zu Werbezwecken jederzeit beim " +
            "Delius Klasing Verlag per <strong><a href='mailto:order@delius-klasing.de'>E-Mail</a></strong> (order@delius-klasing.de) " +
            "oder <strong><a href='tel:+49521559955'>telefonisch</a></strong> (+49 521 559 955) widersprechen, " +
            "ohne dass hierfür andere als die Übermittlungskosten nach den Basistarifen entstehen. " +
            "Hinweise zum <strong><a href='https://shop.delius-klasing.de/datenschutz/' target='_blank'>Datenschutz</a></strong> und " +
            "<strong><a href='https://shop.delius-klasing.de/widerrufsbelehrung/' target='_blank'>Widerrufsrecht</a></strong>."
    }
};
