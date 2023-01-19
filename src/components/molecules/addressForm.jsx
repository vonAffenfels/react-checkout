import React, {useContext, useEffect, useState} from "react";
import CONST from "../../lib/const";
import useDebounce from "../../hooks/useDebounce";
import CheckoutContext from "../../context/CheckoutContext";

const AddressForm = ({heading, addressFormData, setAddressFormData}) => {
    const {cart} = useContext(CheckoutContext);

    const [_addressFormData, _setAddressFormData] = useState({
        ...addressFormData,
    });
    const addressFormDataDebounced = useDebounce(_addressFormData, 1000);

    useEffect(() => {
        setAddressFormData({
            ...addressFormDataDebounced,
            email: cart?.email
        });
    }, [addressFormDataDebounced]);
    console.log("AddressForm, addressFormData", addressFormData, "_addressFormData", _addressFormData);

    return (
        <>
            <h2 className="text-lg font-medium text-color-900">{heading}</h2>

            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-color-700">
                        Vorname
                    </label>
                    <div className="mt-1">
                        <input
                            required
                            type="text"
                            id="first-name"
                            name="first-name"
                            autoComplete="given-name"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={_addressFormData.firstName || ""}
                            onChange={(e) => _setAddressFormData({
                                ..._addressFormData,
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
                            required
                            type="text"
                            id="last-name"
                            name="last-name"
                            autoComplete="family-name"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={_addressFormData.lastName || ""}
                            onChange={(e) => _setAddressFormData({
                                ..._addressFormData,
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
                            value={_addressFormData.company || ""}
                            onChange={(e) => _setAddressFormData({
                                ..._addressFormData,
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
                            required
                            type="text"
                            name="address"
                            id="address"
                            autoComplete="street-address"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={_addressFormData.streetAddress1 || ""}
                            onChange={(e) => _setAddressFormData({
                                ..._addressFormData,
                                streetAddress1: e.target.value
                            })}
                        />
                    </div>
                </div>

                {/*<div className="sm:col-span-2">*/}
                {/*    <label htmlFor="apartment" className="block text-sm font-medium text-color-700">*/}
                {/*        Apartmentnummer, Eingang, etc.*/}
                {/*    </label>*/}
                {/*    <div className="mt-1">*/}
                {/*        <input*/}
                {/*            type="text"*/}
                {/*            name="apartment"*/}
                {/*            id="apartment"*/}
                {/*            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"*/}
                {/*            value={_addressFormData.streetAddress2 || ""}*/}
                {/*            onChange={(e) => _setAddressFormData({*/}
                {/*                ..._addressFormData,*/}
                {/*                streetAddress2: e.target.value*/}
                {/*            })}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-color-700">
                        Stadt
                    </label>
                    <div className="mt-1">
                        <input
                            required
                            type="text"
                            name="city"
                            id="city"
                            autoComplete="address-level2"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={_addressFormData.city || ""}
                            onChange={(e) => _setAddressFormData({
                                ..._addressFormData,
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
                            required
                            id="country"
                            name="country"
                            autoComplete="country-name"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={_addressFormData.country || ""}
                            onChange={(e) => _setAddressFormData({
                                ..._addressFormData,
                                country: e.target.value
                            })}
                        >
                            <option value={null}>Bitte wählen</option>
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
                            value={_addressFormData.state || ""}
                            onChange={(e) => _setAddressFormData({
                                ..._addressFormData,
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
                            required
                            type="text"
                            name="postal-code"
                            id="postal-code"
                            autoComplete="postal-code"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={_addressFormData.postalCode || ""}
                            onChange={(e) => _setAddressFormData({
                                ..._addressFormData,
                                postalCode: e.target.value
                            })}
                        />
                    </div>
                </div>

                {/*<div className="sm:col-span-2">*/}
                {/*    <label htmlFor="phone" className="block text-sm font-medium text-color-700">*/}
                {/*        Telefon*/}
                {/*    </label>*/}
                {/*    <div className="mt-1">*/}
                {/*        <input*/}
                {/*            type="text"*/}
                {/*            name="phone"*/}
                {/*            id="phone"*/}
                {/*            autoComplete="tel"*/}
                {/*            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"*/}
                {/*            value={_addressFormData.phone || ""}*/}
                {/*            onChange={(e) => _setAddressFormData({*/}
                {/*                ..._addressFormData,*/}
                {/*                phone: e.target.value*/}
                {/*            })}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </>
    );
};

export default AddressForm;
