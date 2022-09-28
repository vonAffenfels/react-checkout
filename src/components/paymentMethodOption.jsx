import React, {Fragment} from "react";
import {RadioGroup} from "@headlessui/react";
import {CheckCircleIcon} from "@heroicons/react/solid";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const PaymentMethodOption = ({paymentMethod}) => {

    return (
        <RadioGroup.Option
            value={paymentMethod.id}
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
                                {paymentMethod.name}
                            </RadioGroup.Label>
                            <RadioGroup.Description
                                as="span"
                                className="mt-1 flex items-center text-sm text-color-500"
                            >
                                {paymentMethod.id}
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
};

export default PaymentMethodOption;
