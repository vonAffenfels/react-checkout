//takes a graphql checkout node as parameter
function transformCheckout(node) {
    let shippingRequired = false;
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
            const {quantity, variant, id} = edge.node;

            console.log("lineItem", edge.node);
            if (!variant) {
                return null;
            }

            const {amount, currencyCode} = variant.priceV2;
            return {
                quantity: quantity,
                id: id,
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
        // discount {
        //     ...PriceFragment
        // }
        // discountName
        // availableShippingMethods {
        //     ...ShippingMethodDetailsFragment
        // }

        //TODO need hard config in shopify-config?
        // https://shopify.dev/api/storefront/2022-07/mutations/checkoutCompleteWithTokenizedPaymentV3
        // availablePaymentGateways {
        //     id
        //     name
        //     config {
        //         field
        //         value
        //     }
        // }
        // billingAddress {
        //     ...AddressDetailsFragment
        // }

        //TODO
        // ADMIN-API: https://shopify.dev/api/admin-graphql/2022-07/queries/paymentProviders
        // https://shopify.dev/api/admin-graphql/2022-07/mutations/draftOrderCreate => checkout into order, then complete it
        // https://shopify.dev/api/admin-graphql/2022-07/mutations/draftOrderComplete => if payment pending, then use
        // https://shopify.dev/api/admin-graphql/2022-07/mutations/orderMarkAsPaid
        // noch offen: wie dann die rechnungsabwickling/versand aus shopify? bzw. ist das überhaupt gewünscht oder
        // anderes system dafür?


        // https://shopify.dev/api/admin-graphql/2022-07/mutations/orderCapture => seems linke requirement for the storefront checkout
        // https://shopify.dev/api/admin-graphql/2022-07/objects/PaymentMethod
        // https://shopify.dev/api/admin-graphql/2022-07/objects/CustomPaymentMethod
        // https://shopify.dev/api/admin-graphql/2022-07/mutations/orderCreateMandatePayment
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

    return checkout;
}

export default transformCheckout;
