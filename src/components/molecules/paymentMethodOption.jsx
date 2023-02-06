import React from "react";
import {CheckCircleIcon} from "@heroicons/react/solid";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const PaymentMethodOption = ({paymentMethod, cart, selectedPaymentGatewayId, onChange}) => {
    const isDisabled = typeof paymentMethod.isDisabled === "function" ? paymentMethod.isDisabled(cart) : false;
    const checked = selectedPaymentGatewayId === paymentMethod?.id;

    const onClick = () => {
        if (!isDisabled) {
            onChange(paymentMethod?.id);
        }
    };

    return (
        <div className={classNames(
            "relative bg-white border rounded-lg shadow-sm p-4 flex focus:outline-none",
            checked ? "ring-2 ring-indigo-500 border-transparent" : "border-gray-300",
            isDisabled ? "cursor-not-allowed opacity-75" : "cursor-pointer",
        )} onClick={onClick}>
            <span className="flex-1 flex">
                <span className="flex flex-col">
                    <span className={classNames(
                        "block text-sm font-medium",
                        isDisabled ? "text-color-500" : "text-color-900"
                    )}>
                        {paymentMethod.name}
                    </span>
                    <span className="mt-1 flex items-center text-sm text-color-500">
                        {paymentMethod.description}
                    </span>
                    {isDisabled && (
                        <span className="mt-1 flex items-center text-sm text-color-500">
                            Für diese Auswahl an Produkten nicht verfügbar
                        </span>
                    )}
                </span>
            </span>
            {checked ? <CheckCircleIcon className="h-5 w-5 text-bg-color-600" aria-hidden="true"/> : null}
            <span
                className={classNames(
                    checked ? "border-indigo-500 border" : "border-transparent border-2",
                    "absolute -inset-px rounded-lg pointer-events-none"
                )}
                aria-hidden="true"
            />
        </div>
    );
};

export default PaymentMethodOption;
