import React, {Fragment, useContext} from "react";
import {RadioGroup} from "@headlessui/react";
import {CheckCircleIcon} from "@heroicons/react/solid";
import CheckoutContext from "../../context/CheckoutContext";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const PaymentMethodOption = ({paymentMethod}) => {
    const {cart} = useContext(CheckoutContext);
    const isDisabled = false;//typeof paymentMethod.isDisabled === "function" ? paymentMethod.isDisabled(cart) : false;
    console.log("PaymentMethodOption, isDisabled", isDisabled, "paymentMethod", paymentMethod);

    return (
        <RadioGroup.Option
            value={paymentMethod.id}
            disabled={isDisabled}
            className={({active, checked}) =>
                classNames(
                    checked ? "border-transparent" : "border-gray-300",
                    active ? "ring-2 ring-indigo-500" : "",
                    isDisabled ? "cursor-not-allowed opacity-75" : "cursor-pointer",
                    "relative bg-white border rounded-lg shadow-sm p-4 flex focus:outline-none"
                )
            }
        >
            {({active, checked}) => (
                <Fragment>
                    <span className="flex-1 flex">
                        <span className="flex flex-col">
                            <RadioGroup.Label as="span" className={
                                classNames(
                                    "block text-sm font-medium",
                                    isDisabled ? "text-color-500" : "text-color-900"
                                )
                            }>
                                {paymentMethod.name}
                            </RadioGroup.Label>
                            <RadioGroup.Description
                                as="span"
                                className="mt-1 flex items-center text-sm text-color-500"
                            >
                                {paymentMethod.description}
                            </RadioGroup.Description>
                            {isDisabled && (
                                <RadioGroup.Description
                                    as="span"
                                    className="mt-1 flex items-center text-sm text-color-500"
                                >
                                    Für diese Auswahl an Produkten nicht verfügbar
                                </RadioGroup.Description>
                            )}
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
