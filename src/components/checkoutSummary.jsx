import React, {useContext, useState, useEffect} from "react";

import CheckoutContext from "../context/CheckoutContext";
import CheckoutLine from "./checkoutLine.jsx";
import Price from "./atoms/price.jsx";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const CheckoutSummary = ({props}) => {
    const {checkout, selectedPaymentGatewayId} = useContext(CheckoutContext);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        if (!enabled && checkout?.email && checkout?.shippingAddress && checkout?.shippingMethod?.id && selectedPaymentGatewayId) {
            setEnabled(true);
        }
    }, [checkout?.email, checkout?.shippingAddress, checkout?.shippingMethod?.id, selectedPaymentGatewayId]);

    return (
        <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="sr-only">Items in your cart</h3>
            <ul role="list" className="divide-y divide-gray-200">
                {checkout?.lines?.map((cartItem) => (
                    <CheckoutLine.Detail {...cartItem} key={cartItem.id} />
                ))}
            </ul>
            <dl className="border-t border-gray-200 py-6 px-4 space-y-6 sm:px-6">
                <div className="flex items-center justify-between">
                    <dt className="text-sm">Preis</dt>
                    <dd className="text-sm font-medium text-gray-900">
                        <Price price={checkout?.subtotalPrice?.net?.amount}/> {checkout?.subtotalPrice?.net?.currency}
                    </dd>
                </div>
                <div className="flex items-center justify-between">
                    <dt className="text-sm">Versand</dt>
                    <dd className="text-sm font-medium text-gray-900">
                        <Price price={checkout?.shippingPrice?.gross?.amount}/> {checkout?.shippingPrice?.gross?.currency}
                    </dd>
                </div>
                <div className="flex items-center justify-between">
                    <dt className="text-sm">Steuern</dt>
                    <dd className="text-sm font-medium text-gray-900">
                        <Price price={checkout?.subtotalPrice?.tax?.amount}/> {checkout?.subtotalPrice?.tax?.currency}
                    </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <dt className="text-base font-medium">Summe</dt>
                    <dd className="text-base font-medium text-gray-900">
                        <Price price={checkout?.totalPrice?.gross?.amount}/> {checkout?.totalPrice?.gross?.currency}
                    </dd>
                </div>
            </dl>

            <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <button
                    disabled={!enabled}
                    type="submit"
                    className={
                        classNames(
                            enabled ? "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500" : "cursor-not-allowed",
                            "w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white"
                        )
                    }
                >
                    Bestellung bestätigen
                </button>
            </div>
        </div>
    )
};

export default CheckoutSummary;
