import React, {useState, useEffect} from "react";
import {CheckCircleIcon} from "@heroicons/react/solid";

import {Spin} from "../atoms/animate.jsx";
import CONST from "../../lib/const";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function checkIfAddressIsSame(address, addressFormData) {
    if (!addressFormData) {
        return false;
    }
    let retVal = true;
    Object.keys(addressFormData).forEach(key => {
        if (addressFormData[key] !== address[key]) {
            retVal = false;
        }
    });
    return retVal;
}

const AddressOption = ({address, selectedAddressId, onChange}) => {
    const [loading, setLoading] = useState(false);
    const checked = address?.id === selectedAddressId;
    const {company, firstName, lastName, streetAddress1, houseNumber, city, postalCode, zip, country} = (address || {});

    const onClick = () => {
        if (!checked) {
            setLoading(true);
            onChange(address?.id);
        }
    };

    useEffect(() => {
        setLoading(false);
    }, [selectedAddressId]);

    return (
        <div
            className={classNames(
                loading ? "animate-pulse" : "",
                checked ? "border-transparent" : "border-gray-300",
                checked ? "ring-2 ring-indigo-500" : "",
                "relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none"
            )}
            onClick={onClick}
        >
            <span className="flex-1 flex">
                <span className="flex flex-col">
                    {company && (
                        <span className="block text-sm font-medium text-color-900">
                            {company}
                        </span>
                    )}
                    <span className="block text-sm font-medium text-color-900">
                        {firstName} {lastName}
                    </span>
                    <span className="mt-1 flex items-center text-sm text-color-500">
                        {streetAddress1} {houseNumber}
                    </span>
                    <span className="mt-1 flex items-center text-sm text-color-500">
                        {city} {postalCode || zip}
                    </span>
                    <span className="mt-1 flex items-center text-sm text-color-500">
                        {CONST.COUNTRIES[country] || country}
                    </span>
                </span>
            </span>
            {loading ? <Spin className="-ml-1 mr-3" /> : null}
            {checked ? <CheckCircleIcon className="h-5 w-5 text-bg-color-600" aria-hidden="true"/> : null}
            <span
                className={classNames(
                    checked ? "border" : "border-2",
                    checked ? "border-indigo-500" : "border-transparent",
                    "absolute -inset-px rounded-lg pointer-events-none"
                )}
                aria-hidden="true"
            />
        </div>
);
}

export default AddressOption;
