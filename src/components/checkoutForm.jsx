import React, {useContext, useEffect, useState} from "react";
import {RadioGroup} from "@headlessui/react";

import CheckoutContext from "../context/CheckoutContext";
import BuyContext from "../context/BuyContext";
import ShippingMethodOption from "./molecules/shippingMethodOption.jsx";
import PaymentMethodOption from "./molecules/paymentMethodOption.jsx";
import {LoadingOption} from "./atoms/animate.jsx";
import AddressForm from "./molecules/addressForm.jsx";
import {Checkbox} from "./atoms/checkbox.jsx";

const CheckoutForm = ({props}) => {
    const {isDebug, availablePaymentGateways} = useContext(BuyContext);
    const {
        cart,
        checkout,
        addressFormData,
        setAddressFormData,
        billingAddress,
        setBillingAddress,
        setCartDeliveryMethod,
        selectedPaymentGatewayId,
        setSelectedPaymentGatewayId,
        isSettingShippingMethod,
        isLoadingShippingMethods,
        isBillingAddressDeviating,
        setBillingAddressDeviating
    } = useContext(CheckoutContext);
    const [tempSelectedShippingMethodId, setTempSelectedShippingMethodId] = useState("");

    useEffect(() => {
        let updateAddressFormData = {
            ...addressFormData
        };
        if (cart?.email && cart?.email !== "anonymous@example.com") {
            updateAddressFormData.email = cart.email;
        }
        if (cart?.shippingAddress && cart?.requiresShipping) {
            let adressData = {
                firstName: cart?.shippingAddress?.firstName,
                lastName: cart?.shippingAddress?.lastName,
                streetAddress1: cart?.shippingAddress?.streetAddress1,
                city: cart?.shippingAddress?.city,
                country: cart?.shippingAddress?.countryCode,
                company: cart?.shippingAddress?.companyName,
                state: cart?.shippingAddress?.countryArea,
                postalCode: cart?.shippingAddress?.postalCode,
                phone: cart?.shippingAddress?.phone
            };
            updateAddressFormData = {
                ...updateAddressFormData,
                ...adressData
            };
        }
        console.log("checkoutForm.jsx, setAddressFormData!");
        setAddressFormData(updateAddressFormData);
    }, []);

    const onChangeDeliveryMethod = async (deliveryMethodId) => {
        if (cart?.shippingMethod?.id !== deliveryMethodId) {
            setTempSelectedShippingMethodId(deliveryMethodId);
            await setCartDeliveryMethod(deliveryMethodId);
            setTempSelectedShippingMethodId("");
        }
    };

    const onChangePaymentMethod = (paymentGatewayId) => {
        if (selectedPaymentGatewayId !== paymentGatewayId) {
            setSelectedPaymentGatewayId(paymentGatewayId);
        }
    };

    return (
        <div>
            <div>
                <h2 className="text-lg font-medium text-color-900">Kontaktinformation</h2>
                {isDebug && <a href={checkout?.webUrl || cart?.webUrl} target="_blank" className="text-lg font-medium text-color-900">Zum Shopify Checkout</a>}

                <div className="mt-4">
                    <label htmlFor="email-address" className="block text-sm font-medium text-color-700">
                        Email-Adresse
                    </label>
                    <div className="mt-1">
                        <input
                            type="email"
                            id="email-address"
                            name="email-address"
                            autoComplete="email"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={addressFormData.email}
                            onChange={(e) => setAddressFormData({
                                ...addressFormData,
                                email: e.target.value
                            })}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
                <AddressForm
                    heading="Lieferadresse"
                    addressFormData={addressFormData}
                    setAddressFormData={setAddressFormData}
                />
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
                <Checkbox
                    id="different_billing_address"
                    label="Rechnungsadresse weicht ab"
                    onChange={setBillingAddressDeviating}
                />
                {isBillingAddressDeviating && (
                    <AddressForm
                        heading="Rechnungsadresse"
                        addressFormData={billingAddress}
                        setAddressFormData={setBillingAddress}
                    />
                )}
            </div>

            {cart?.requiresShipping !== false && (
                <div className="mt-10 border-t border-gray-200 pt-10">
                    <RadioGroup value={cart?.shippingMethod?.id || ""} onChange={onChangeDeliveryMethod}>
                        <RadioGroup.Label className="text-lg font-medium text-color-900">Versandart</RadioGroup.Label>

                        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                            {cart?.shippingMethods?.map((shippingMethod) => (
                                <ShippingMethodOption
                                    shippingMethod={shippingMethod}
                                    key={shippingMethod.id}
                                    loading={(isSettingShippingMethod && (shippingMethod.id === tempSelectedShippingMethodId)) || isDebug}
                                />
                            ))}
                            {((isLoadingShippingMethods && !cart?.shippingMethods?.length) || isDebug) && <LoadingOption/>}
                            {!isLoadingShippingMethods && !cart?.shippingMethods?.length && (
                                <p>Nach Eingabe der Adresse werden die verfügbaren Versandarten angezeigt</p>
                            )}
                        </div>
                    </RadioGroup>
                </div>
            )}

            {(cart?.shippingMethod?.id || (cart?.requiresShipping === false)) && (
                <div className="mt-10 border-t border-gray-200 pt-10">
                    <RadioGroup value={selectedPaymentGatewayId || ""} onChange={onChangePaymentMethod}>
                        <RadioGroup.Label className="text-lg font-medium text-color-900">Bezahlart</RadioGroup.Label>

                        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                            {(cart?.availablePaymentGateways || availablePaymentGateways)?.map((paymentMethod) => (
                                <PaymentMethodOption
                                    paymentMethod={paymentMethod}
                                    key={paymentMethod.id}
                                />
                            ))}
                        </div>
                    </RadioGroup>
                </div>
            )}
        </div>
    );
}

export default CheckoutForm;
