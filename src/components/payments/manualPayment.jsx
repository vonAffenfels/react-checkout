import React, {Fragment, useContext, useEffect, useState, useRef} from "react";

import CheckoutContext from "../../context/CheckoutContext";
import BuyContext from "../../context/BuyContext";
import {RadioGroup} from "@headlessui/react";
import {CheckCircleIcon} from "@heroicons/react/solid";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const manualPaymentMethods = [
    {
        id: "invoice",
        name: "Rechnung",
        description: ""
    },
    {
        id: "direct_debit",
        name: "Lastschrift",
        description: ""
    },
];

const ManualPaymentMethodOption = ({id, name, description}) => (
    <RadioGroup.Option
        value={id}
        className={({active, checked}) =>
            classNames(
                checked ? "border-transparent" : "border-gray-300",
                active ? "ring-2 ring-indigo-500" : "",
                "relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none"
            )
        }
    >
        {({active, checked}) => (
            <Fragment>
                <span className="flex-1 flex">
                    <span className="flex flex-col">
                        <RadioGroup.Label as="span" className="block text-sm font-medium text-color-900">
                            {name}
                        </RadioGroup.Label>
                        <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-color-900">
                            {description}
                        </RadioGroup.Description>
                    </span>
                </span>
                {checked ? <CheckCircleIcon className="h-5 w-5 text-bg-color-600" aria-hidden="true"/> : null}
                <span
                    className={classNames(
                        active ? "border" : "border-2",
                        checked ? "border-indigo-500" : "border-transparent",
                        "absolute -inset-px rounded-lg pointer-events-none"
                    )}
                    aria-hidden="true"
                />
            </Fragment>
        )}
    </RadioGroup.Option>
);

const ManualPayment = ({}) => {
    const {checkout, selectedPaymentGatewayId} = useContext(CheckoutContext);
    const {paymentProviders} = useContext(BuyContext);
    const [manualPaymentMethod, setManualPaymentMethod] = useState(null);
    const [directDebitData, setDirectDebitData] = useState({
        iban: "",
        accountHolder: ""
    });

    let apiUri = "";
    paymentProviders.forEach(provider => {
        if (provider.name === "manual") {
            apiUri = provider.config.apiUri;
        }
    });

    const onChangePaymentMethod = (paymentMethod) => setManualPaymentMethod(paymentMethod);

    const isValidPayment = () => {
        return manualPaymentMethod === "invoice" || (
            manualPaymentMethod === "direct_debit" && directDebitData.iban && directDebitData.accountHolder
        );
    }

    const onFinalize = async () => {
        console.log("onFinalize");
        const paymentIntent = await fetch(apiUri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type: "manual.create_payment_intent",
                checkoutToken: checkout?.token,
                selectedPaymentGatewayId: selectedPaymentGatewayId,
                amount: String(checkout?.totalPrice?.gross?.amount),
                additionalData: JSON.stringify({
                    manualPaymentMethod,
                    directDebitData
                })
            })
        }).then(res => res.json());

        console.log("finalized:", paymentIntent);
        window.location.href = window.location.href;
    };

    return (
        <Fragment key="manuel-payment-form">
            <div>
                <RadioGroup value={manualPaymentMethod} onChange={onChangePaymentMethod}>
                    <RadioGroup.Label className="text-lg font-medium text-color-900">Zahlungsart</RadioGroup.Label>

                    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                        {manualPaymentMethods.map((entry, i) => (
                            <ManualPaymentMethodOption key={"manual-payment-method-" + i} {...entry} />
                        ))}
                    </div>
                </RadioGroup>
            </div>
            {(manualPaymentMethod === "direct_debit") && (
                <div className="mt-10 border-t border-gray-200 pt-10">
                    <div className="sm:col-span-2">
                        <label htmlFor="apartment" className="block text-sm font-medium text-color-700">
                            Name Kontoinhaber
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="apartment"
                                id="apartment"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={directDebitData.accountHolder}
                                onChange={(e) => setDirectDebitData({
                                    ...directDebitData,
                                    accountHolder: e.target.value
                                })}
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="apartment" className="block text-sm font-medium text-color-700">
                            IBAN
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="apartment"
                                id="apartment"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={directDebitData.iban}
                                onChange={(e) => setDirectDebitData({
                                    ...directDebitData,
                                    iban: e.target.value
                                })}
                            />
                        </div>
                    </div>
                </div>
            )}
            {isValidPayment() && (
                <div className="mt-10 border-t border-gray-200 pt-10">
                    <button
                        type="button"
                        className={
                            classNames(
                                "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500",
                                "w-full bg-color-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white"
                            )
                        }
                        onClick={onFinalize}
                    >
                        Jetzt kostenpflichtig bestellen
                    </button>
                </div>
            )}
        </Fragment>
    );
}

export default ManualPayment;
