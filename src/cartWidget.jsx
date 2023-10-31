import React, {Fragment, useContext, useEffect} from "react";
import {Dialog} from "@headlessui/react";
import {XIcon} from "@heroicons/react/solid";

import BuyContext from "./context/BuyContext";
import CheckoutContext from "./context/CheckoutContext";
import CheckoutLine from "./components/checkoutLine.jsx";
import SidePanelLayout from "./components/sidePanelLayout.jsx";
import {Item, Spin} from "./components/atoms/animate.jsx";
import Price from "./components/atoms/price.jsx";
import {CartIcon} from "./components/atoms/icons.jsx";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const CartWidget = ({props}) => {
    const {isDebug, hideDefaultCartButton, multipassUri, withLogin, withTracking} = useContext(BuyContext);
    const {
        cart,
        email,
        checkout,
        isCartOpen,
        setCartOpen,
        setDisplayState,
        setNextDisplayState,
        isLoadingLineItems,
        isLoadingShippingMethods,
        multipass,
    } = useContext(CheckoutContext);

    const openFullPage = async (e) => {
        e.preventDefault();
        if (cart?.lines?.length) {
            if (multipassUri && (globalThis?.window?.location?.search?.indexOf?.("legacy-checkout") === -1)) {
                const {token, url} = await multipass({});
                //window.open(url);
                window.location.href = url;
            } else {
                setCartOpen(false);
                setDisplayState("cartFullPage");
            }
        }
    };

    const login = (e, data) => {

        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        setNextDisplayState("widget");
        globalThis?.window?.[withLogin?.globalFunc]?.(data);
    };

    // tracking
    useEffect(() => {
        globalThis?.window?.[withTracking?.globalFunc]?.(cart);
    }, [cart]);

    return (
        <Fragment>
            {!isCartOpen && !hideDefaultCartButton && (cart?.totalQuantity > 0) && (
                <div className="bg-opacity-50 flex justify-center items-center fixed right-0 z-50" style={{
                    top: "50%",
                    transform: "translate(0%, -50%)",
                }}>
                    <button
                        className="bg-color-500 px-4 py-2 text-md text-white"
                        onClick={() => setCartOpen(true)}
                    >
                        <span className="pb-2 block">{cart?.totalQuantity || 0}</span>
                        <span><CartIcon /></span>
                    </button>
                </div>
            )}

            <SidePanelLayout show={isCartOpen} onClose={setCartOpen}>
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                        <div className="flex-1 py-6 px-4 sm:px-6 lg:overflow-y-auto xl:overflow-y-auto"> {/*overflow-y-auto*/}
                            <div className="flex items-start justify-between">
                                <Dialog.Title className="text-lg font-medium text-color-900">Warenkorb</Dialog.Title>
                                <div className="ml-3 flex h-7 items-center">
                                    <button
                                        type="button"
                                        className="-m-2 p-2 text-color-400 hover:text-color-500"
                                        onClick={() => setCartOpen(false)}
                                    >
                                        <span className="sr-only">Schließen</span>
                                        <XIcon className="h-5 w-5" aria-hidden="true"/>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="flow-root">
                                    <ul role="list" className="-my-6 divide-y divide-gray-200 relative">
                                        {cart?.lines?.map((cartItem) => <CheckoutLine {...cartItem} key={cartItem.id}/>)}
                                        {(isLoadingLineItems || isDebug) && <Item/>}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                            {cart?.requiresShipping !== false ? (
                                <>
                                    <div className="flex justify-between text-sm font-medium text-color-500">
                                        {cart?.shippingPrice?.gross?.amount === undefined ? (
                                            <p className="mb-2">Versandkosten werden an der Kasse berechnet</p>
                                        ) : (
                                            <>
                                                <p>Versand inkl. gesetzlicher Mwst.</p>
                                                {isLoadingShippingMethods ? (
                                                    <p className="text-sm font-medium text-bg-color-500 mb-2"><Spin/></p>
                                                ) : (
                                                    <>
                                                        {cart?.shippingPrice?.gross?.amount > 0 ? (
                                                            <p className="mb-2">
                                                                <Price price={cart?.shippingPrice?.gross?.amount}/> {cart?.shippingPrice?.gross?.currency}
                                                            </p>
                                                        ) : (
                                                            <p className="text-sm font-medium text-bg-color-500 mb-2">Gratis Versand!</p>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : null}
                            <div className="flex justify-between text-base text-color-900">
                                <p className="font-medium">Gesamtsumme inkl. gesetzlicher Mwst.</p>
                                <p className="font-medium">
                                    <Price price={cart?.totalPrice?.gross?.amount}/> {cart?.totalPrice?.gross?.currency}
                                </p>
                            </div>
                            <div className="mt-6">
                                <a
                                    onClick={openFullPage}
                                    className={
                                        classNames(
                                            !cart ? "cursor-not-allowed" : "hover:bg-color-700",
                                            "flex items-center justify-center rounded-md border border-transparent bg-color-600 px-6 py-3 text-base font-medium text-white shadow-sm"
                                        )
                                    }
                                >
                                    Zur Kasse
                                </a>
                            </div>
                            {withLogin?.globalFunc && !email && (
                                <>
                                    <div className="mt-6">
                                        <div
                                            className={"mb-6 flex items-center justify-between text-center uppercase text-sm text-color-500 before:content-[''] before:inline-block before:h-px before:bg-gray-200 before:grow after:content-[''] after:inline-block after:h-px after:bg-gray-200 after:grow"}>
                                            <span className={"inline-block px-1"}>ODER ANMELDEN</span>
                                        </div>
                                        <div className="lg:grid lg:grid-cols-2">
                                            <div className="pb-3 lg:pr-4">
                                                <button
                                                    onClick={(e) => login(e, {extraQueryParams: {type: "registration"}})}
                                                    type="button"
                                                    className={"w-full text-bg-color-600 border border-bg-color-600 rounded-md shadow-sm py-3 px-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"}
                                                >
                                                    Registrieren
                                                </button>
                                            </div>
                                            <div className="pb-3 lg:pl-4">
                                                <button
                                                    onClick={(e) => login(e)}
                                                    type="button"
                                                    className={"w-full text-bg-color-600 border border-bg-color-600 rounded-md shadow-sm py-3 px-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"}
                                                >
                                                    Anmelden
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="mt-6 flex justify-center text-center text-sm text-color-500">
                                <p>
                                    oder{' '}
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
}

export default CartWidget;
