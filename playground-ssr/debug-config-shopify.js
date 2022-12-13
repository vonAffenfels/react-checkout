export default {
    shop: "shopify",
    uri: "https://delius-klasing.myshopify.com/api/2022-10/graphql.json",
    webhookUri: "https://mmstupicl7.execute-api.eu-central-1.amazonaws.com/shopify",
    storefrontApiKey: "21ec7ad8aceac22f6fbd61e1fec7c27b",
    channel: "b2c",
    availablePaymentGateways: [
        {
            id: "stripe",
            name: "Stripe"
        }
    ],
    paymentProviders: [
        {
            name: "stripe",
            config: {
                apiUri: "https://mmstupicl7.execute-api.eu-central-1.amazonaws.com/shopify",
                apiKey: "pk_test_51KyvxoC6ZdKmUgiesvK91vRkvWQ0X7qrPDLObx0U8awu9dyPwfTiU3vcCRpOnvCruyCMUoFsIDoE1aDm8flWLefY00es42eq9A"
            }
        }
    ]
};
