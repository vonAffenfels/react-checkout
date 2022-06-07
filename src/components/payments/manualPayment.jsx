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
                        <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                            {name}
                        </RadioGroup.Label>
                        <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-gray-900">
                            {description}
                        </RadioGroup.Description>
                    </span>
                </span>
                {checked ? <CheckCircleIcon className="h-5 w-5 text-indigo-600" aria-hidden="true"/> : null}
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
    const [manualPaymentMethod, setManualPaymentMethod] = useState(null);

    const onChangePaymentMethod = (paymentMethod) => setManualPaymentMethod(paymentMethod);

    return (
        <Fragment key="manuel-payment-form">
            <div className="mt-10 border-t border-gray-200 pt-10">
                <RadioGroup value={manualPaymentMethod} onChange={onChangePaymentMethod}>
                    <RadioGroup.Label className="text-lg font-medium text-gray-900">Zahlungsart</RadioGroup.Label>

                    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                        {manualPaymentMethods.map((entry, i) => (
                            <ManualPaymentMethodOption key={"manual-payment-method-" + i} {...entry} />
                        ))}
                    </div>
                </RadioGroup>
            </div>
        </Fragment>
    );
}

export default ManualPayment;
