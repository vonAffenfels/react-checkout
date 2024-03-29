//takes a graphql cart as parameter
import React from "react";

function transformCart(node) {
    if (!node) {
        return null;
    }

    let requiresShipping = false;
    let hasDigitalItem = false;
    let hasSubscriptionItem = false;
    let shippingMethod = null;
    let shippingAddress = null;
    let totalDiscountAllocations = [...(node.discountAllocations || [])];
    let shippingMethods = [];
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
                    currency: deliveryOption.estimatedCost.currencyCode.replace("EUR", "€"),
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
            countryCode: node.shippingAddress?.countryCodeV2 || node.buyerIdentity?.countryCode
        };
    }

    const discountCodes = node.discountCodes;
    const {
        checkoutChargeAmount,
        subtotalAmount,
        totalAmount,
        totalDutyAmount,
        totalTaxAmount,
    } = node.cost;

    const checkout = {
        totalQuantity: node.totalQuantity,
        id: node.id,
        token: node.id,
        webUrl: node.checkoutUrl,
        discountCodes: (node.discountCodes || []).map(discount => {
            return {
                applicable: discount?.applicable,
                code: discount?.code
            }
        }),
        lines: (node.lines?.nodes || []).map(node => {
            const {cost, id, merchandise, quantity, discountAllocations, attributes} = node;

            if (!merchandise) {
                return null;
            }

            if (merchandise.requiresShipping) {
                requiresShipping = true;
            } else {
                hasDigitalItem = true;
            }

            if (String(merchandise.product?.productType).toLowerCase() === "abo") {
                hasSubscriptionItem = true;
            }

            const {amount, currencyCode} = cost.amountPerQuantity;
            const retVal = {
                quantity: quantity,
                id: id,
                variant: {
                    id: merchandise.id,
                    name: merchandise.title,
                    sku: merchandise.sku,
                    pricing: {
                        price: {
                            gross: {
                                amount: amount,
                                currency: currencyCode.replace("EUR", "€")
                            }
                        }
                    },
                    product: {
                        id: merchandise.product.id,
                        name: merchandise.product.title,
                        productType: merchandise.product.productType,
                        thumbnail: {
                            url: merchandise.image?.url,
                            alt: merchandise.image?.altText
                        }
                    }
                },
                totalPrice: {
                    gross: {
                        amount: amount * quantity,
                        currency: currencyCode.replace("EUR", "€")
                    }
                },
                attributes: (attributes || []).map(attr => ({key: attr.key, value: attr.value})),
                displayMessage: node.displayMessage,
            };

            if (discountAllocations?.length) {
                totalDiscountAllocations = totalDiscountAllocations.concat([...discountAllocations]);
                let totalDiscountAmount = discountAllocations.reduce((initialVal, currentVal, i) => {
                    return initialVal + parseFloat(currentVal?.discountedAmount?.amount || 0);
                }, 0);
                retVal.totalDiscounts = {
                    gross: {
                        amount: parseFloat(totalDiscountAmount).toFixed(2),
                        currency: currencyCode.replace("EUR", "€"),
                    },
                    codes: discountCodes.map(v => v.code).join(", "),
                };
            }

            let bonusProductAttribute, giftSubscriptionAttribute;
            (attributes || []).forEach(attr => {
                if (attr.key === "bonus_id") {
                    bonusProductAttribute = attr;
                }
                if (attr.key === "gift_subscription_recipient_address") {
                    giftSubscriptionAttribute = attr;
                }
            })
            if (bonusProductAttribute) {
                const bonusProduct = bonusProductAttribute.value?.split?.("_") || [];
                retVal.bonusProduct = {
                    aboSku: bonusProduct?.[0],
                    variantSku: bonusProduct?.[1],
                };
            }
            if (giftSubscriptionAttribute) {
                try {
                    const parsedAddress = JSON.parse(giftSubscriptionAttribute.value);
                    if (parsedAddress) {
                        retVal.giftedIdentity = {
                            firstName: parsedAddress.name,
                            lastName: parsedAddress.name2,
                            streetAddress: parsedAddress.street,
                            houseNumber: parsedAddress.streetNr,
                            city: parsedAddress.city,
                            zip: parsedAddress.zip,
                            country: String(parsedAddress.country).toUpperCase()
                        }
                    }
                } catch (e) {
                    console.log("giftSubscriptionAttribute is not valid json:", giftSubscriptionAttribute.value);
                }
            }

            return retVal;
        }).filter(Boolean),
        email: node.buyerIdentity?.email,
        subtotalPrice: {
            net: {
                amount: subtotalAmount?.amount,
                currency: subtotalAmount?.currencyCode.replace("EUR", "€")
            },
            tax: {
                amount: totalTaxAmount?.amount,
                currency: totalTaxAmount?.currencyCode.replace("EUR", "€")
            }
        },
        totalPrice: {
            gross: {
                amount: parseFloat(parseFloat(totalAmount?.amount).toFixed(2)),
                currency: totalAmount?.currencyCode.replace("EUR", "€")
            }
        },
        shippingPrice: {
            gross: {
                amount: shippingMethod?.price?.amount,
                currency: shippingMethod?.price?.currency.replace("EUR", "€")
            }
        },
        shippingMethods: shippingMethods,
        buyerIdentity: {
            countryCode: node.buyerIdentity?.countryCode,
            email: node.buyerIdentity?.email,
        }
    };

    checkout.requiresShipping = requiresShipping;
    checkout.hasDigitalItem = hasDigitalItem;
    checkout.hasSubscriptionItem = hasSubscriptionItem;
    checkout.shippingAddress = shippingAddress;

    if (shippingMethod) {
        checkout["shippingMethod"] = shippingMethod;
        checkout["shippingPrice"] = {
            gross: {
                amount: shippingMethod.price.amount,
                currency: shippingMethod.price.currency.replace("EUR", "€")
            }
        }
    }

    if (totalDiscountAllocations?.length) {
        checkout.discountAllocations = totalDiscountAllocations.reduce((initialVal, currentVal, index) => {
            return {
                amount: parseFloat(initialVal?.amount) + parseFloat(currentVal?.discountedAmount?.amount),
                currency: (currentVal?.discountedAmount?.currencyCode || initialVal.currency).replace("EUR", "€")
            }
        }, {amount: 0, currency: "EUR"});
    } else {
        checkout.discountAllocations = null;
    }

    return checkout;
}

export default transformCart;
