import React, {useContext, useEffect, useState} from "react";
import {RadioGroup} from "@headlessui/react";

import CheckoutContext from "../context/CheckoutContext";
import BuyContext from "../context/BuyContext";
import ShippingMethodOption from "./shippingMethodOption.jsx";
import PaymentMethodOption from "./paymentMethodOption.jsx";
import {LoadingOption} from "./atoms/animate.jsx";

import CONST from "../lib/const";

const CheckoutForm = ({props}) => {
    const {isDebug, availablePaymentGateways} = useContext(BuyContext);
    const {
        checkout,
        addressFormData,
        setAddressFormData,
        setCheckoutDeliveryMethod,
        selectedPaymentGatewayId,
        setSelectedPaymentGatewayId,
        isSettingShippingMethod,
        isLoadingShippingMethods,
    } = useContext(CheckoutContext);
    const [tempSelectedShippingMethodId, setTempSelectedShippingMethodId] = useState("");

    useEffect(() => {
        let updateAddressFormData = {
            ...addressFormData
        };
        if (checkout?.email && checkout?.email !== "anonymous@example.com") {
            updateAddressFormData.email = checkout.email;
        }
        if (checkout?.shippingAddress) {
            let adressData = {
                firstName: checkout?.shippingAddress?.firstName,
                lastName: checkout?.shippingAddress?.lastName,
                streetAddress1: checkout?.shippingAddress?.streetAddress1,
                city: checkout?.shippingAddress?.city,
                country: checkout?.shippingAddress?.countryCode,
                company: checkout?.shippingAddress?.companyName,
                state: checkout?.shippingAddress?.countryArea,
                postalCode: checkout?.shippingAddress?.postalCode,
                phone: checkout?.shippingAddress?.phone
            };
            updateAddressFormData = {
                ...updateAddressFormData,
                ...adressData
            };
        }
        setAddressFormData(updateAddressFormData);
    }, []);

    const onChangeDeliveryMethod = async (deliveryMethodId) => {
        if (checkout?.shippingMethod?.id !== deliveryMethodId) {
            setTempSelectedShippingMethodId(deliveryMethodId);
            await setCheckoutDeliveryMethod(deliveryMethodId);
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
                {isDebug && <a href={checkout?.webUrl} target="_blank" className="text-lg font-medium text-color-900">Zum Shopify Checkout</a>}

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
                <h2 className="text-lg font-medium text-color-900">Lieferadresse</h2>

                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-medium text-color-700">
                            Vorname
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                id="first-name"
                                name="first-name"
                                autoComplete="given-name"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={addressFormData.firstName}
                                onChange={(e) => setAddressFormData({
                                    ...addressFormData,
                                    firstName: e.target.value
                                })}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="last-name" className="block text-sm font-medium text-color-700">
                            Nachname
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                id="last-name"
                                name="last-name"
                                autoComplete="family-name"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={addressFormData.lastName}
                                onChange={(e) => setAddressFormData({
                                    ...addressFormData,
                                    lastName: e.target.value
                                })}
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="company" className="block text-sm font-medium text-color-700">
                            Firma
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="company"
                                id="company"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={addressFormData.company}
                                onChange={(e) => setAddressFormData({
                                    ...addressFormData,
                                    company: e.target.value
                                })}
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-color-700">
                            Straße und Hausnummer
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="address"
                                id="address"
                                autoComplete="street-address"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={addressFormData.streetAddress1}
                                onChange={(e) => setAddressFormData({
                                    ...addressFormData,
                                    streetAddress1: e.target.value
                                })}
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="apartment" className="block text-sm font-medium text-color-700">
                            Apartmentnummer, Eingang, etc.
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="apartment"
                                id="apartment"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={addressFormData.streetAddress2}
                                onChange={(e) => setAddressFormData({
                                    ...addressFormData,
                                    streetAddress2: e.target.value
                                })}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-color-700">
                            Stadt
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="city"
                                id="city"
                                autoComplete="address-level2"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={addressFormData.city}
                                onChange={(e) => setAddressFormData({
                                    ...addressFormData,
                                    city: e.target.value
                                })}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-color-700">
                            Land
                        </label>
                        <div className="mt-1">
                            <select
                                id="country"
                                name="country"
                                autoComplete="country-name"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={addressFormData.country}
                                onChange={(e) => setAddressFormData({
                                    ...addressFormData,
                                    country: e.target.value
                                })}
                            >
                                {Object.keys(CONST.COUNTRIES).map(countryCode => (
                                    <option value={countryCode} key={countryCode}>{CONST.COUNTRIES[countryCode]}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="region" className="block text-sm font-medium text-color-700">
                            Bundesland / Provinz
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="region"
                                id="region"
                                autoComplete="address-level1"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={addressFormData.state || ""}
                                onChange={(e) => setAddressFormData({
                                    ...addressFormData,
                                    state: e.target.value
                                })}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="postal-code" className="block text-sm font-medium text-color-700">
                            Postleitzahl
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="postal-code"
                                id="postal-code"
                                autoComplete="postal-code"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={addressFormData.postalCode}
                                onChange={(e) => setAddressFormData({
                                    ...addressFormData,
                                    postalCode: e.target.value
                                })}
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-color-700">
                            Telefon
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                autoComplete="tel"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={addressFormData.phone}
                                onChange={(e) => setAddressFormData({
                                    ...addressFormData,
                                    phone: e.target.value
                                })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {console.log("checkout?.requiresShipping", checkout?.requiresShipping)}
            {checkout?.requiresShipping !== false && (
                <div className="mt-10 border-t border-gray-200 pt-10">
                    {console.log("checkout?.shippingMethod?.id", checkout?.shippingMethod?.id)}
                    <RadioGroup value={checkout?.shippingMethod?.id || ""} onChange={onChangeDeliveryMethod}>
                        <RadioGroup.Label className="text-lg font-medium text-color-900">Versandart</RadioGroup.Label>

                        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                            {checkout?.shippingMethods?.map((shippingMethod) => (
                                <ShippingMethodOption
                                    shippingMethod={shippingMethod}
                                    key={shippingMethod.id}
                                    loading={(isSettingShippingMethod && (shippingMethod.id === tempSelectedShippingMethodId)) || isDebug}
                                />
                            ))}
                            {((isLoadingShippingMethods && !checkout?.shippingMethods?.length) || isDebug) && <LoadingOption/>}
                            {!isLoadingShippingMethods && !checkout?.shippingMethods?.length && (
                                <p>Nach Eingabe der Adresse werden die verfügbaren Versandarten angezeigt</p>
                            )}
                        </div>
                    </RadioGroup>
                </div>
            )}

            {(checkout?.shippingMethod?.id || (checkout?.requiresShipping === false)) && (
                <div className="mt-10 border-t border-gray-200 pt-10">
                    {console.log("selectedPaymentGatewayId", selectedPaymentGatewayId || "")}
                    <RadioGroup value={selectedPaymentGatewayId || ""} onChange={onChangePaymentMethod}>
                        <RadioGroup.Label className="text-lg font-medium text-color-900">Bezahlart</RadioGroup.Label>

                        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                            {(checkout?.availablePaymentGateways || availablePaymentGateways)?.map((paymentMethod) => (
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
