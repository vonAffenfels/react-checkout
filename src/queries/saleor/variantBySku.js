export default `
    query ProductVariantBySku(
        $sku: String!
        $locale: LanguageCodeEnum!
    ) {
        productVariant(sku: $sku) {
            id
            sku
            name
            product {
                id
            }
            translation(languageCode: $locale) {
                id
                name
            }
            quantityAvailable
            channelListings {
                channel {
                    id
                    slug
                    name
                    currencyCode
                }
            }
        }
    }
`;
