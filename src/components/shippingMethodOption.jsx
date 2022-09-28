import React, {Fragment} from "react";
import {RadioGroup} from "@headlessui/react";
import {CheckCircleIcon, RefreshIcon} from "@heroicons/react/solid";

import {Spin} from "./atoms/animate.jsx";
import Price from "./atoms/price.jsx";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const ShippingMethodOption = ({shippingMethod, loading}) => {
    const isFree = parseFloat(shippingMethod.price?.amount) === 0;

    return (
        <RadioGroup.Option
            value={shippingMethod.id}
            disabled={loading}
            className={({active, checked}) =>
                classNames(
                    loading ? "animate-pulse" : "",
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
                                {shippingMethod.name}
                            </RadioGroup.Label>
                            <RadioGroup.Description
                                as="span"
                                className="mt-1 flex items-center text-sm text-color-500"
                            >
                                {shippingMethod.minimumDeliveryDays && shippingMethod.maximumDeliveryDays && `${shippingMethod.minimumDeliveryDays} - ${shippingMethod.maximumDeliveryDays} Tage`}
                            </RadioGroup.Description>
                            <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-color-900">
                                Preis: {isFree ? "kostenlos" : (
                                    <>
                                        <Price price={shippingMethod.price?.amount}/> {shippingMethod.price?.currency}
                                    </>
                                )}
                            </RadioGroup.Description>
                        </span>
                    </span>
                    {loading ? <Spin /> : null}
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
}

export default ShippingMethodOption;
