import React, {Fragment} from "react";
import {CheckCircleIcon, RefreshIcon} from "@heroicons/react/solid";

import {Spin} from "../atoms/animate.jsx";
import Price from "../atoms/price.jsx";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const ShippingMethodOption = ({shippingMethod, selectedShippingMethodId, loading, onChange}) => {
    const isFree = parseFloat(shippingMethod.price?.amount) === 0;
    const checked = selectedShippingMethodId === shippingMethod?.id;

    const onClick = () => {
        onChange(shippingMethod?.id);
    };

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
                    <span className="block text-sm font-medium text-color-900">
                        {shippingMethod.name}
                    </span>
                    <span className="mt-1 flex items-center text-sm text-color-500">
                        {shippingMethod.minimumDeliveryDays && shippingMethod.maximumDeliveryDays && `${shippingMethod.minimumDeliveryDays} - ${shippingMethod.maximumDeliveryDays} Tage`}
                    </span>
                    <span className="mt-6 text-sm font-medium text-color-900">
                        Preis: {isFree ? "kostenlos" : (
                        <>
                            <Price price={shippingMethod.price?.amount}/> {shippingMethod.price?.currency}
                        </>
                    )}
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

export default ShippingMethodOption;
