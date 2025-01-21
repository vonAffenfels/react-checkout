// TODO type for config from ReactEzCheckoutConfig
export default {
    uri: "https://delius-klasing.myshopify.com/api/2025-01/graphql.json",
    multipassUri: "https://6e8lbjwzm5.execute-api.eu-central-1.amazonaws.com/generate-token",
    cartUri: "https://uaeslwxw4a.execute-api.eu-central-1.amazonaws.com/ory/order",
    storefrontApiKey: "21ec7ad8aceac22f6fbd61e1fec7c27b",
    channel: function channel() {
        return globalThis?.window?.isRetailer ? "b2b" : "b2c";
    },
    texts: {
        subCheckoutSummary: "Hinweis: Sie können der Nutzung Ihrer E-Mail-Adresse zu Werbezwecken jederzeit beim " +
            "Delius Klasing Verlag per <strong><a href='mailto:order@delius-klasing.de'>E-Mail</a></strong> (order@delius-klasing.de) " +
            "oder <strong><a href='tel:+49521559955'>telefonisch</a></strong> (+49 521 559 955) widersprechen, " +
            "ohne dass hierfür andere als die Übermittlungskosten nach den Basistarifen entstehen. " +
            "Hinweise zum <strong><a href='https://shop.delius-klasing.de/datenschutz/' target='_blank'>Datenschutz</a></strong> und " +
            "<strong><a href='https://shop.delius-klasing.de/widerrufsbelehrung/' target='_blank'>Widerrufsrecht</a></strong>."
    }
};
