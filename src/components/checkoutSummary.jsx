import React, {useContext, useState, useEffect} from "react";

import CheckoutContext from "../context/CheckoutContext";
import CheckoutLine from "./checkoutLine.jsx";
import Price from "./atoms/price.jsx";
import {SpinButton, ButtonBlue} from "./atoms/animate.jsx";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const CheckoutSummary = ({props}) => {
    const {cart, checkout, selectedPaymentGatewayId, loadingDraftOrder, billingAddressDebounced} = useContext(CheckoutContext);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const isValidShippingMethod = (cart?.requiresShipping === false) || (cart?.shippingAddress && cart?.shippingMethod?.id);
        if (!enabled && cart?.email && isValidShippingMethod && selectedPaymentGatewayId) {
            setEnabled(true);
        }
    }, [cart?.email, cart?.shippingAddress, cart?.shippingMethod?.id, selectedPaymentGatewayId]);

    const isInvoice = selectedPaymentGatewayId === "invoice";

    return (
        <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="sr-only">Items in your cart</h3>
            <ul role="list" className="divide-y divide-gray-200 relative">
                {cart?.lines?.map((cartItem) => (
                    <CheckoutLine.Detail {...cartItem} key={cartItem.id} />
                ))}
            </ul>
            <dl className="border-t border-gray-200 py-6 px-4 space-y-6 sm:px-6">
                <div className="flex items-center justify-between">
                    <dt className="text-sm">Preis</dt>
                    <dd className="text-sm font-medium text-color-900">
                        <Price price={cart?.subtotalPrice?.net?.amount}/> {cart?.subtotalPrice?.net?.currency}
                    </dd>
                </div>
                <div className="flex items-center justify-between">
                    <dt className="text-sm">Versand</dt>
                    <dd className="text-sm font-medium text-color-900">
                        <Price price={cart?.shippingPrice?.gross?.amount}/> {cart?.shippingPrice?.gross?.currency}
                    </dd>
                </div>
                <div className="flex items-center justify-between">
                    <dt className="text-sm">Steuern</dt>
                    <dd className="text-sm font-medium text-color-900">
                        <Price price={cart?.subtotalPrice?.tax?.amount}/> {cart?.subtotalPrice?.tax?.currency}
                    </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <dt className="text-base font-medium">Summe</dt>
                    <dd className="text-base font-medium text-color-900">
                        <Price price={cart?.totalPrice?.gross?.amount}/> {cart?.totalPrice?.gross?.currency}
                    </dd>
                </div>
            </dl>

            <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <button
                    disabled={!enabled || loadingDraftOrder}
                    type="submit"
                    className={
                        classNames(
                            (enabled && !loadingDraftOrder) ? "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500" : "cursor-not-allowed",
                            "w-full bg-color-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white"
                        )
                    }
                >
                    {loadingDraftOrder ? (
                        <>
                            <SpinButton />
                            {isInvoice ? "Bestellung wird übertragen ..." : "Bezahlprozess wird vorbereitet ..."}
                        </>
                    ) : (isInvoice ? "Bestellung abschließen" : "Bestellung bestätigen")}
                </button>
            </div>
        </div>
    )
};

export default CheckoutSummary;
