//takes a graphql cart as parameter
function transformCart(node) {
    if (!node) {
        return null;
    }
    let requiresShipping = false;
    let shippingMethod = null;
    let shippingAddress = null;
    const shippingMethods = [];
    (node.deliveryGroups?.nodes || []).forEach(deliveryGroup => {
        let foundMethod = null;

        (deliveryGroup?.deliveryOptions || []).forEach(deliveryOption => {
            const cfg = {
                id: deliveryOption.code,
                name: deliveryOption.title,
                handle: deliveryOption.handle,
                deliveryGroupId: deliveryGroup.id,
                active: true,
                price: {
                    currency: deliveryOption.estimatedCost.currencyCode,
                    amount: deliveryOption.estimatedCost.amount
                },
                minimumDeliveryDays: null,
                maximumDeliveryDays: null,
            };
            if (deliveryGroup.selectedDeliveryOption?.code === cfg.id) {
                foundMethod = cfg;
            }
            shippingMethods.push(cfg);
        });

        if (!shippingAddress && deliveryGroup.deliveryAddress) {
            shippingAddress = {
                id: deliveryGroup.deliveryAddress?.id,
                phone: deliveryGroup.deliveryAddress?.phone,
                firstName: deliveryGroup.deliveryAddress?.firstName,
                lastName: deliveryGroup.deliveryAddress?.lastName,
                streetAddress1: deliveryGroup.deliveryAddress?.address1,
                streetAddress2: deliveryGroup.deliveryAddress?.address2,
                city: deliveryGroup.deliveryAddress?.city,
                postalCode: deliveryGroup.deliveryAddress?.zip,
                isDefaultBillingAddress: false,
                isDefaultShippingAddress: false,
                companyName: deliveryGroup.deliveryAddress?.company,
                countryArea: deliveryGroup.deliveryAddress?.province,
                country: deliveryGroup.deliveryAddress?.countryCode || deliveryGroup.deliveryAddress?.country,
                countryCode: deliveryGroup.deliveryAddress?.countryCodeV2
            }
        }

        if (!shippingMethod && foundMethod) {
            shippingMethod = {
                ...foundMethod
            }
        }
    });

    if (!shippingAddress) {
        shippingAddress = {
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
        };
    }

    const {
        checkoutChargeAmount,
        subtotalAmount,
        totalAmount,
        totalDutyAmount,
        totalTaxAmount,
    } = node.cost;

    const checkout = {
        //TODO its variant x quantity, not count of lineItems
        totalQuantity: node.totalQuantity,
        id: node.id,
        token: node.id,
        webUrl: node.checkoutUrl,
        lines: (node.lines?.nodes || []).map(node => {
            const {cost, id, merchandise, quantity, attribute} = node;

            if (!merchandise) {
                return null;
            }

            if (merchandise.requiresShipping) {
                requiresShipping = true;
            }

            const {amount, currencyCode} = cost.amountPerQuantity;
            const retVal = {
                quantity: quantity,
                id: id,
                variant: {
                    id: merchandise.id,
                    name: merchandise.title,
                    pricing: {
                        price: {
                            gross: {
                                amount: amount,
                                currency: currencyCode
                            }
                        }
                    },
                    product: {
                        id: merchandise.product.id,
                        name: merchandise.product.title,
                        thumbnail: {
                            url: merchandise.product.featuredImage?.url,
                            alt: merchandise.product.featuredImage?.altText
                        }
                    }
                },
                totalPrice: {
                    gross: {
                        amount: amount * quantity,
                        currency: currencyCode
                    }
                }
            };

            const bonusProduct = attribute?.value?.split?.("_") || [];
            if (bonusProduct?.length) {
                retVal.bonusProduct = {
                    sku: bonusProduct?.[0],
                    variantId: bonusProduct?.[1],
                };
            }

            return retVal;
        }).filter(Boolean),
        email: node.buyerIdentity?.email,
        subtotalPrice: {
            net: {
                amount: subtotalAmount?.amount,
                currency: subtotalAmount?.currencyCode
            },
            tax: {
                amount: totalTaxAmount?.amount,
                currency: totalTaxAmount?.currencyCode
            }
        },
        totalPrice: {
            gross: {
                amount: parseFloat(parseFloat(totalAmount?.amount).toFixed(2)),
                currency: totalAmount?.currencyCode
            }
        },
        shippingPrice: {
            gross: {
                amount: shippingMethod?.price?.amount,
                currency: shippingMethod?.price?.currency
            }
        },
        shippingMethods: shippingMethods,
    };

    checkout.requiresShipping = requiresShipping;
    checkout.shippingAddress = shippingAddress;

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

export default transformCart;
