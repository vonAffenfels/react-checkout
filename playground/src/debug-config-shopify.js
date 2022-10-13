export default {
    shop: "shopify",
    uri: "https://vonaffenfels-playground.myshopify.com/api/2022-07/graphql.json",
    webhookUri: "https://mmstupicl7.execute-api.eu-central-1.amazonaws.com/shopify",
    storefrontApiKey: "5861012507d5e7b228c9c8f13b88551f",
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
