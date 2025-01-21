import React, { Fragment, useContext, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";

import CheckoutLine from "./components/checkoutLine";
import SidePanelLayout from "./components/sidePanelLayout";
import { Item } from "./components/atoms/animate";
import Price from "./components/atoms/price";
import { CartIcon } from "./components/atoms/icons";
import classNames from "./lib/classNames";
import useCartStore, { CartState } from "./stores/cartStore";

type AuthCallbackData = {
    extraQueryParams: {
        type: string;
    };
};
export type CartWidgetProps = {
    onLoginClick: null | ((data?: AuthCallbackData) => void);
    onRegistrationClick: null | ((data?: AuthCallbackData) => void);
    onCheckout: null | (() => void);
    onCartUpdate: null | ((cart: Cart | null) => void);
    hideDefaultCartButton: boolean;
};

const CartWidget = ({ onLoginClick, onRegistrationClick, onCheckout, onCartUpdate, hideDefaultCartButton }: CartWidgetProps) => {
    const { cart, email, isCartOpen, setCartOpen, isLoadingLineItems, isLoadingShippingMethods } = useCartStore(
        (state: CartState) => ({
            cart: state.cart,
            email: state.email,
            isCartOpen: state.isCartOpen,
            setCartOpen: state.setCartOpen,
            isLoadingLineItems: state.isLoadingLineItems,
            isLoadingShippingMethods: state.isLoadingShippingMethods,
        })
    );
    const hasAuthCallback = onLoginClick || onRegistrationClick;

    const proceedToCheckout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        // TODO migrate all of this to an onCheckout callback handler?
        console.error(
            "cartWidget.tsx::proceedToCheckout - need to implement multipass, create own server hook, that will then be imported e.g. in the lambda?"
        );
        if (!cart?.lines.length) {
            return;
        }

        if (onCheckout) {
            onCheckout();
        } else {
            window.location.href = cart.checkoutUrl;
        }
        // if (cart?.lines?.length) {
        //     if (multipassUri && globalThis?.window?.location?.search?.indexOf?.("legacy-checkout") === -1) {

        //         const { token, url } = await multipass({});
        //         window.location.href = url;
        //     } else {
        //         // TODO open cart.checkoutUrl
        //     }
        // }
    };

    const login = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (onLoginClick) {
            onLoginClick();
        }
    };

    const registration = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (onRegistrationClick) {
            onRegistrationClick({ extraQueryParams: { type: "registration" } });
        }
    };

    // tracking
    useEffect(() => {
        // globalThis?.window?.[withTracking?.globalFunc]?.(cart);
        onCartUpdate?.(cart);
    }, [cart]);

    return (
        <Fragment>
            {!isCartOpen && !hideDefaultCartButton && (cart?.totalQuantity || 0) > 0 && (
                <div
                    className="bg-opacity-50 flex justify-center items-center fixed right-0 z-50"
                    style={{
                        top: "50%",
                        transform: "translate(0%, -50%)",
                    }}
                >
                    <button className="bg-color-500 px-4 py-2 text-md text-white" onClick={() => setCartOpen(true)}>
                        <span className="pb-2 block">{cart?.totalQuantity || 0}</span>
                        <span>
                            <CartIcon />
                        </span>
                    </button>
                </div>
            )}

            <SidePanelLayout show={isCartOpen} onClose={setCartOpen}>
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                        <div className="flex-1 py-6 px-4 sm:px-6 lg:overflow-y-auto xl:overflow-y-auto">
                            {" "}
                            {/*overflow-y-auto*/}
                            <div className="flex items-start justify-between">
                                <Dialog.Title className="text-lg font-medium text-color-900">Warenkorb</Dialog.Title>
                                <div className="ml-3 flex h-7 items-center">
                                    <button
                                        type="button"
                                        className="-m-2 p-2 text-color-400 hover:text-color-500"
                                        onClick={() => setCartOpen(false)}
                                    >
                                        <span className="sr-only">Schließen</span>
                                        <XIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-8">
                                <div className="flow-root">
                                    <ul role="list" className="-my-6 divide-y divide-gray-200 relative">
                                        {cart?.lines?.map((cartItem) => (
                                            <CheckoutLine {...cartItem} key={cartItem.id} />
                                        ))}
                                        {isLoadingLineItems && <Item />}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                            {cart?.requiresShipping !== false ? (
                                <>
                                    <div className="flex justify-between text-sm font-medium text-color-500">
                                        {cart?.requiresShipping && (
                                            <p className="mb-2">Versandkosten werden an der Kasse berechnet</p>
                                        )}
                                    </div>
                                </>
                            ) : null}
                            <div className="flex justify-between text-base text-color-900">
                                <p className="font-medium">Gesamtsumme inkl. gesetzlicher Mwst.</p>
                                <p className="font-medium">
                                    <Price price={cart?.cost.totalAmount.amount} />{" "}
                                    {cart?.cost.totalAmount.currencyCode}
                                </p>
                            </div>
                            <div className="mt-6">
                                <a
                                    onClick={proceedToCheckout}
                                    className={classNames(
                                        !cart ? "cursor-not-allowed" : "hover:bg-color-700",
                                        "flex items-center justify-center rounded-md border border-transparent bg-color-600 px-6 py-3 text-base font-medium text-white shadow-sm"
                                    )}
                                >
                                    Zur Kasse
                                </a>
                            </div>
                            {hasAuthCallback && !email && (
                                <>
                                    <div className="mt-6">
                                        <div
                                            className={
                                                "mb-6 flex items-center justify-between text-center uppercase text-sm text-color-500 before:content-[''] before:inline-block before:h-px before:bg-gray-200 before:grow after:content-[''] after:inline-block after:h-px after:bg-gray-200 after:grow"
                                            }
                                        >
                                            <span className={"inline-block px-1"}>ODER ANMELDEN</span>
                                        </div>
                                        <div className="lg:grid lg:grid-cols-2">
                                            {onRegistrationClick && (
                                                <div className="pb-3 lg:pr-4">
                                                    <button
                                                        onClick={registration}
                                                        type="button"
                                                        className={
                                                            "w-full text-bg-color-600 border border-bg-color-600 rounded-md shadow-sm py-3 px-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                                                        }
                                                    >
                                                        Registrieren
                                                    </button>
                                                </div>
                                            )}
                                            {onLoginClick && (
                                                <div className="pb-3 lg:pl-4">
                                                    <button
                                                        onClick={login}
                                                        type="button"
                                                        className={
                                                            "w-full text-bg-color-600 border border-bg-color-600 rounded-md shadow-sm py-3 px-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                                                        }
                                                    >
                                                        Anmelden
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="mt-6 flex justify-center text-center text-sm text-color-500">
                                <p>
                                    oder{" "}
                                    <button
                                        type="button"
                                        className="font-medium text-bg-color-600 hover:text-bg-color-500"
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
};

export default CartWidget;
