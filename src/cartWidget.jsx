import React, {Fragment, useContext} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {XIcon} from "@heroicons/react/solid";

import BuyContext from "./context/BuyContext";
import CheckoutContext from "./context/CheckoutContext";
import CheckoutLine from "./components/checkoutLine.jsx";
import SidePanelLayout from "./components/sidePanelLayout.jsx";
import {Item} from "./components/atoms/animate.jsx";
import Price from "./components/atoms/price.jsx";

const CartWidget = ({props}) => {
    const {isDebug} = useContext(BuyContext);
    const {
        checkout,
        isCartOpen,
        setCartOpen,
        setDisplayState,
        isLoadingLineItems
    } = useContext(CheckoutContext);

    const openFullPage = (e) => {
        e.preventDefault();
        setCartOpen(false);
        setDisplayState("cartFullPage");
    };

    return (
        <Fragment>
            {!isCartOpen && (
                <div className="bg-opacity-50 flex justify-center items-center fixed top-10 right-0 z-50">
                    <button
                        className="bg-indigo-500 px-4 py-2 text-md text-white"
                        onClick={() => setCartOpen(true)}
                    >
                        Warenkorb öffnen
                    </button>
                </div>
            )}

            <SidePanelLayout show={isCartOpen} onClose={setCartOpen}>
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                        <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                            <div className="flex items-start justify-between">
                                <Dialog.Title className="text-lg font-medium text-gray-900">Warenkorb</Dialog.Title>
                                <div className="ml-3 flex h-7 items-center">
                                    <button
                                        type="button"
                                        className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                        onClick={() => setCartOpen(false)}
                                    >
                                        <span className="sr-only">Schließen</span>
                                        <XIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="flow-root">
                                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                                        {checkout?.lines?.map((cartItem) => {
                                            return (
                                                <CheckoutLine {...cartItem} key={cartItem.id} />
                                            )
                                        })}
                                        {(isLoadingLineItems || isDebug) && <Item/>}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                                <p>Warenkorb</p>
                                <p><Price price={checkout?.subtotalPrice?.net?.amount}/> {checkout?.subtotalPrice?.net?.currency}</p>
                            </div>
                            {!!checkout?.shippingPrice?.gross?.amount ? (
                                <div className="flex justify-between text-base font-small text-gray-500">
                                    <p>Versand</p>
                                    <p><Price price={checkout?.shippingPrice?.gross?.amount}/> {checkout?.shippingPrice?.gross?.currency}</p>
                                </div>
                            ) : (
                                <p className="mt-0.5 text-sm text-gray-500">Versandkosten werden an der Kasse berechnet.</p>
                            )}
                            <div className="mt-6">
                                <a
                                    onClick={openFullPage}
                                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                >
                                    Kasse
                                </a>
                            </div>
                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                <p>
                                    oder{' '}
                                    <button
                                        type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                        onClick={() => setCartOpen(false)}
                                    >
                                        Weiter einkaufen<span aria-hidden="true"> &rarr;</span>
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </SidePanelLayout>
        </Fragment>
    );
}

export default CartWidget;
