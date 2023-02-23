import React, {useContext, useState, useEffect} from "react";

import CheckoutContext from "../context/CheckoutContext";
import BuyContext from "../context/BuyContext";
import ShippingMethodOption from "./molecules/shippingMethodOption.jsx";
import PaymentMethodOption from "./molecules/paymentMethodOption.jsx";
import AddressOption from "./molecules/addressOption.jsx";
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
        email,
        setEmail,
        hideEmailInput,

        addressBook,
        onSelectAddressBookEntry,
        onSelectBillingAddressBookEntry,
        selectedShippingAddressId,
        setSelectedShippingAddressId,
        selectedBillingAddressId,
        setSelectedBillingAddressId,

        setCartAddress,
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
    const [createNewShippingAddress, _setNewShippingAddress] = useState(
        !selectedShippingAddressId &&
        Object.keys(addressFormData).map(key => addressFormData[key]).filter(Boolean).length
    );
    const [createNewBillingAddress, _setNewBillingAddress] = useState(
        !selectedBillingAddressId &&
        isBillingAddressDeviating &&
        Object.keys(addressFormData).map(key => billingAddress[key]).filter(Boolean).length
    );

    const setNewShippingAddress = (val) => {
        _setNewShippingAddress(val);
        if (val) {
            setSelectedShippingAddressId("");
        }
    }

    const setNewBillingAddress = (val) => {
        _setNewBillingAddress(val);
        if (val) {
            setSelectedBillingAddressId("");
        }
    }

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

    const shippingAddresses = (addressBook || []).filter(address => address.type === "shipping");
    const billingAddresses = (addressBook || []).filter(address => address.type === "billing");

    useEffect(() => {
        if (selectedBillingAddressId) {
            setNewBillingAddress(false);
        }
    }, [selectedBillingAddressId]);

    useEffect(() => {
        if (selectedShippingAddressId) {
            setNewShippingAddress(false);
        }
    }, [selectedShippingAddressId]);

    return (
        <div>
            <div>
                <h2 className="text-lg font-medium text-color-900">Kontaktinformation</h2>
                {isDebug && <a href={checkout?.webUrl || cart?.webUrl} target="_blank" className="text-lg font-medium text-color-900">Zum Shopify Checkout</a>}

                {!hideEmailInput && (
                    <div className="mt-4">
                        <label htmlFor="email-address" className="block text-sm font-medium text-color-700">
                            Email-Adresse
                        </label>
                        <div className="mt-1">
                            <input
                                required
                                type="email"
                                id="email-address"
                                name="email-address"
                                autoComplete="email"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className={`${hideEmailInput ? "" : "mt-10 border-t"} border-gray-200 pt-10`}>
                <h2 className="text-lg font-medium text-color-900">Lieferadresse</h2>

                {shippingAddresses.length > 0 && (
                    <>
                        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                            {shippingAddresses.map((address) => (
                                <AddressOption
                                    key={address.id}
                                    selectedAddressId={selectedShippingAddressId}
                                    address={address}
                                    onChange={onSelectAddressBookEntry}
                                />
                            ))}
                        </div>
                        <div className="mt-10">
                            <Checkbox
                                id="new_shipping_address"
                                label="Neue Adresse anlegen"
                                onChange={setNewShippingAddress}
                                checked={createNewShippingAddress}
                            />
                        </div>
                    </>
                )}

                {(createNewShippingAddress || (shippingAddresses.length === 0)) && (
                    <AddressForm
                        addressFormData={addressFormData}
                        setAddressFormData={setAddressFormData}
                    />
                )}
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-color-900">Rechnungsadresse</h2>

                <div className="mt-10">
                    <Checkbox
                        id="different_billing_address"
                        label="Rechnungsadresse weicht ab"
                        onChange={setBillingAddressDeviating}
                        checked={isBillingAddressDeviating}
                    />
                </div>
                {isBillingAddressDeviating && (
                    <>
                        {billingAddresses.length > 0 && (
                            <>
                                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    {billingAddresses.map((address) => (
                                        <AddressOption
                                            key={address.id}
                                            selectedAddressId={selectedBillingAddressId}
                                            address={address}
                                            onChange={onSelectBillingAddressBookEntry}
                                        />
                                    ))}
                                </div>
                                <div className="mt-10">
                                    <Checkbox
                                        id="new_billing_address"
                                        label="Neue Adresse anlegen"
                                        onChange={setNewBillingAddress}
                                        checked={createNewBillingAddress}
                                    />
                                </div>
                            </>
                        )}

                        {(createNewBillingAddress || (billingAddresses.length === 0)) && (
                            <AddressForm
                                addressFormData={billingAddress}
                                setAddressFormData={setBillingAddress}
                            />
                        )}
                    </>
                )}
            </div>

            {(cart?.requiresShipping !== false) && (cart?.shippingMethods?.length > 1) && (
                <div className="mt-10 border-t border-gray-200 pt-10">
                    <label className="text-lg font-medium text-color-900">Versandart</label>

                    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                        {cart?.shippingMethods?.map((shippingMethod) => (
                            <ShippingMethodOption
                                shippingMethod={shippingMethod}
                                selectedShippingMethodId={cart?.shippingMethod?.id}
                                key={shippingMethod.id}
                                loading={(isSettingShippingMethod && (shippingMethod.id === tempSelectedShippingMethodId)) || isLoadingShippingMethods}
                                onChange={onChangeDeliveryMethod}
                            />
                        ))}
                        {((isLoadingShippingMethods && !cart?.shippingMethods?.length) || isDebug) && <LoadingOption/>}
                        {!isLoadingShippingMethods && !cart?.shippingMethods?.length && (
                            <p>Nach Eingabe der Adresse werden die verfügbaren Versandarten angezeigt</p>
                        )}
                    </div>
                </div>
            )}

            {(cart?.shippingMethod?.id || (cart?.requiresShipping === false)) && (
                <div className="mt-10 border-t border-gray-200 pt-10">
                    <label className="text-lg font-medium text-color-900">Zahlungsmethode</label>

                    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                        {(cart?.availablePaymentGateways || availablePaymentGateways)?.map((paymentMethod) => (
                            <PaymentMethodOption
                                key={paymentMethod.id}
                                paymentMethod={paymentMethod}
                                onChange={onChangePaymentMethod}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CheckoutForm;
