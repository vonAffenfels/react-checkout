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
            }
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
                apiKey: "pk_live_51MCi5UGfzuneej5pip9BTmYZzbCeQHngCbYNhousDpeWxwXitHsw0s3ElYdPGQYBwSqnZO74jJeystZZuB8thVrt0064WrDXJv"
            }
        },
        {
            name: "invoice",
            config: {}
        },
        {
            name: "paypal",
            config: {}
        }
    ]
};
