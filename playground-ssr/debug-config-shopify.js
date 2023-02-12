export default {
    shop: "shopify",
    uri: "https://delius-klasing.myshopify.com/api/2022-10/graphql.json",
    webhookUri: "https://mmstupicl7.execute-api.eu-central-1.amazonaws.com/shopify",
    storefrontApiKey: "21ec7ad8aceac22f6fbd61e1fec7c27b",
    channel: "b2c",
    availablePaymentGateways: [
        {
            id: "stripe",
            name: "Stripe",
            description: "Kreditkarte, Lastschrift, SEPA-Überweisung, Giropay",
            isDisabled: function isStripeDisabled (cart) {
                return false;
            },
            isDefault: true,
        },
        {
            id: "invoice",
            name: "Rechnung",
            isDisabled: function isInvoiceDisabled (cart) {
                return cart.hasDigitalItem;
            }
        },
        {
            id: "paypal",
            name: "PayPal",
            isDisabled: function isPayPalDisabled (cart) {
                return cart.hasSubscriptionItem;
            }
        }
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
    ]
};
