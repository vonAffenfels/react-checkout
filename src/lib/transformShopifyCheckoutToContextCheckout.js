//takes a graphql checkout node as parameter
function transformCheckout(node) {
    const shippingMethods = (node.availableShippingRates?.shippingRates || []).map(rate => {
        return {
            id: rate.handle,
            name: rate.title,
            active: true,
            price: {
                currency: rate.priceV2.currencyCode,
                amount: rate.priceV2.amount
            },
            minimumDeliveryDays: null,
            maximumDeliveryDays: null,
        };
    });
    const shippingMethod = node.shippingLine ? {
        id: node.shippingLine.handle,
        name: node.shippingLine.title,
        active: true,
        price: {
            currency: node.shippingLine.priceV2.currencyCode,
            amount: node.shippingLine.priceV2.amount
        },
        minimumDeliveryDays: null,
        maximumDeliveryDays: null,
    } : null;

    const checkout = {
        id: node.id,
        token: node.id,
        webUrl: node.webUrl,
        requiresShipping: node.requiresShipping,
        lines: (node.lineItems?.edges || []).map(edge => {
            const {quantity, variant, id, customAttributes = []} = edge.node;

            if (!variant) {
                return null;
            }

            const {amount, currencyCode} = variant.priceV2;
            return {
                quantity: quantity,
                id: id,
                customAttributes: customAttributes.map(v => ({key: v.key, value: v.value})),
                variant: {
                    id: variant.id,
                    name: variant.title,
                    pricing: {
                        price: {
                            gross: {
                                amount: amount,
                                currency: currencyCode
                            }
                        }
                    },
                    product: {
                        id: variant.product.id,
                        name: variant.product.title,
                        thumbnail: {
                            url: variant.product.featuredImage?.url,
                            alt: variant.product.featuredImage?.altText
                        }
                    }
                },
                totalPrice: {
                    gross: {
                        amount: amount * quantity,
                        currency: currencyCode
                    }
                }
            }
        }).filter(Boolean),
        email: node.email,
        subtotalPrice: {
            net: {
                amount: node.subtotalPriceV2?.amount,
                currency: node.subtotalPriceV2?.currencyCode
            },
            tax: {
                amount: node.totalDuties?.amount,
                currency: node.totalDuties?.currencyCode
            }
        },
        totalPrice: {
            gross: {
                amount: node.totalPriceV2?.amount,
                currency: node.totalPriceV2?.currencyCode
            }
        },
        shippingPrice: {
            gross: {
                amount: node.shippingLine?.priceV2?.amount,
                currency: node.shippingLine?.priceV2?.currencyCode
            }
        },
        shippingAddress: {
            id: node.shippingAddress?.id,
            phone: node.shippingAddress?.phone,
            firstName: node.shippingAddress?.firstName,
            lastName: node.shippingAddress?.lastName,
            streetAddress1: node.shippingAddress?.address1,
            streetAddress2: node.shippingAddress?.address2,
            city: node.shippingAddress?.city,
            postalCode: node.shippingAddress?.zip,
            isDefaultBillingAddress: false,
            isDefaultShippingAddress: false,
            companyName: node.shippingAddress?.company,
            countryArea: node.shippingAddress?.province,
            country: node.shippingAddress?.countryCode || node.shippingAddress?.country,
            countryCode: node.shippingAddress?.countryCodeV2
        },
        shippingMethods: shippingMethods,
    };

    if (shippingMethod) {
        checkout["shippingMethod"] = shippingMethod;
        checkout["shippingPrice"] = {
            gross: {
                amount: shippingMethod.price.amount,
                currency: shippingMethod.price.currency
            }
        }
    }

    if (node.order) {
        checkout.order = node.order;
    }

    return checkout;
}

export default transformCheckout;
