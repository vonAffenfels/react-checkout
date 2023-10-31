export default {
    shop: "shopify",
    uri: "https://delius-klasing.myshopify.com/api/2023-10/graphql.json",
    webhookUri: "https://mmstupicl7.execute-api.eu-central-1.amazonaws.com/shopify",
    multipassUri: "https://6e8lbjwzm5.execute-api.eu-central-1.amazonaws.com/generate-token",
    cartUri: "https://uaeslwxw4a.execute-api.eu-central-1.amazonaws.com/ory/order",
    storefrontApiKey: "21ec7ad8aceac22f6fbd61e1fec7c27b",
    // Produkte mit folgendem character/character-collection in sku vom mehrfachkauf ausschliessen
    disableMultipleSku: "KP",
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
        branding: (
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 193 49" width={200} height={36} className="text-skin-logo dark:text-skin-logo-dark fill-current">
                <style type="text/css" dangerouslySetInnerHTML={{__html: `.dk-logo-color-1{fill:#E20613;}
                    .dk-logo-color-2{fill:#1D1D1B;}`}} />
                <path className="dk-logo-color-1"
                      d="M46.278,0.027H2.722c0,0-2.722,0-2.722,2.722v43.555c0,0,0,2.723,2.722,2.723h43.556c0,0,2.722,0,2.722-2.723V2.749C49,2.749,49,0.027,46.278,0.027z M18.288,31.663H8.283l0-5.549h8.023c0.888,0,1.326-0.777,1.326-1.333c0-0.964-0.731-1.291-1.326-1.291H8.283v-5.51h9.992c3.453,0,5.562,3.983,5.562,6.814C23.837,27.916,21.288,31.663,18.288,31.663z M41.338,31.631h-9.445l-7.405-6.875l7.423-6.793h9.445l-8.024,6.793L41.338,31.631z"/>
                <path className="dk-logo-color-2"
                      d="M60.127,29.511h2.921c2.923,0,4.583-1.801,4.583-4.453v-0.153c0-2.653-1.647-4.403-4.544-4.403h-2.96V29.511L60.127,29.511z M63.113,22.573c1.288,0,2.151,0.76,2.151,2.382v0.116c0,1.61-0.863,2.369-2.151,2.369h-0.67v-4.867H63.113L63.113,22.573z M71.289,29.511h6.255v-2.032h-3.965v-1.546h3.527v-1.917h-3.527v-1.482h3.913v-2.033h-6.203V29.511L71.289,29.511z M81.716,29.511h5.856v-2.084h-3.54v-6.925h-2.316V29.511L81.716,29.511z M91.616,29.511h2.316v-9.009h-2.316V29.511L91.616,29.511z M102.223,29.666c2.2,0,3.681-1.145,3.681-3.758v-5.407h-2.341v5.51c0,1.068-0.515,1.558-1.327,1.558c-0.8,0-1.327-0.515-1.327-1.597v-5.471h-2.328v5.446C98.581,28.508,100.021,29.666,102.223,29.666L102.223,29.666z M112.968,29.64c1.932,0,3.282-1.08,3.282-2.83v-0.026c0-1.533-1.066-2.228-2.778-2.781c-1.147-0.425-1.432-0.632-1.432-1.031v-0.013c0-0.334,0.298-0.592,0.827-0.592c0.733,0,1.481,0.349,2.097,0.825l1.171-1.724c-0.939-0.759-2.007-1.094-3.218-1.094c-1.97,0-3.216,1.144-3.216,2.779v0.039c0,1.635,1.196,2.252,2.894,2.833c1.057,0.373,1.327,0.592,1.327,0.952v0.013c0,0.386-0.322,0.656-0.939,0.656c-0.877,0-1.713-0.412-2.446-1.018l-1.235,1.687C110.356,29.228,111.63,29.64,112.968,29.64L112.968,29.64z M124.428,29.511h2.315v-2.343l0.722-0.939l1.814,3.282h2.705l-2.885-5.172l2.795-3.837h-2.665l-2.485,3.566v-3.566h-2.315V29.511L124.428,29.511z M135.705,29.511h5.855v-2.084h-3.54v-6.925h-2.315V29.511L135.705,29.511z M144.69,29.511h2.38l0.515-1.621h2.832l0.527,1.621h2.433l-3.179-9.06h-2.343L144.69,29.511L144.69,29.511z M148.165,26.038l0.838-2.639l0.836,2.639H148.165L148.165,26.038z M160.099,29.64c1.93,0,3.282-1.08,3.282-2.83v-0.026c0-1.533-1.068-2.228-2.78-2.781c-1.147-0.425-1.43-0.632-1.43-1.031v-0.013c0-0.334,0.296-0.592,0.825-0.592c0.735,0,1.483,0.349,2.099,0.825l1.169-1.724c-0.939-0.759-2.005-1.094-3.216-1.094c-1.97,0-3.218,1.144-3.218,2.779v0.039c0,1.635,1.196,2.252,2.896,2.833c1.055,0.373,1.327,0.592,1.327,0.952v0.013c0,0.386-0.322,0.656-0.941,0.656c-0.875,0-1.711-0.412-2.446-1.018l-1.235,1.687C157.486,29.228,158.761,29.64,160.099,29.64L160.099,29.64z M167.502,29.511h2.315v-9.009h-2.315V29.511L167.502,29.511z M174.299,29.511h2.277v-4.723l3.117,4.723h2.06v-9.009h-2.277v4.532l-3.001-4.532h-2.176V29.511L174.299,29.511z M189.692,29.666c1.366,0,2.459-0.489,3.308-1.119v-4.299h-3.604v1.788h1.43v1.34c-0.257,0.167-0.592,0.27-1.044,0.27c-1.158,0-2.047-0.915-2.047-2.562v-0.129c0-1.493,0.875-2.498,2.02-2.498c0.774,0,1.289,0.322,1.766,0.748l1.286-1.764c-0.875-0.707-1.814-1.093-3.102-1.093c-2.485,0-4.337,1.878-4.337,4.583v0.179C185.368,27.929,187.233,29.666,189.692,29.666L189.692,29.666z"/>
            </svg>
        ),
        fullPageFooter: (
            <>
                <a target="_blank" href="https://www.delius-klasing.de/widerrufsbelehrung">Widerrufsbelehrung</a>
                <a target="_blank" href="https://www.delius-klasing.de/versandkosten">Versandkosten</a>
                <a target="_blank" href="https://www.delius-klasing.de/home/datenschutz">Datenschutz</a>
                <a target="_blank" href="https://www.delius-klasing.de/agb">AGB</a>
                <a target="_blank" href="https://www.delius-klasing.de/impressum">Impressum</a>
            </>
        ),
        subCheckoutSummary: "Hinweis: Sie können der Nutzung Ihrer E-Mail-Adresse zu Werbezwecken jederzeit beim " +
            "Delius Klasing Verlag per <strong><a href='mailto:order@delius-klasing.de'>E-Mail</a></strong> (order@delius-klasing.de) " +
            "oder <strong><a href='tel:+49521559955'>telefonisch</a></strong> (+49 521 559 955) widersprechen, " +
            "ohne dass hierfür andere als die Übermittlungskosten nach den Basistarifen entstehen. " +
            "Hinweise zum <strong><a href='https://shop.delius-klasing.de/datenschutz/' target='_blank'>Datenschutz</a></strong> und " +
            "<strong><a href='https://shop.delius-klasing.de/widerrufsbelehrung/' target='_blank'>Widerrufsrecht</a></strong>."
    }
};
