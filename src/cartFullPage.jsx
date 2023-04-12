import React, {Fragment, useContext, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";

import CheckoutContext from "./context/CheckoutContext";
import FullPageLayout from "./components/fullPageLayout.jsx"
import CloseButton from "./components/closeButton.jsx";
import CheckoutForm from "./components/checkoutForm.jsx";
import CheckoutSummary from "./components/checkoutSummary.jsx";
import BuyContext from "./context/BuyContext";
import FullPageFooter from "./components/fullPageFooter.jsx";

const CartFullPage = ({props}) => {
    const {texts, withLogin} = useContext(BuyContext);
    const {
        email,
        setDisplayState,
        setNextDisplayState,
        onBeforePayment,
    } = useContext(CheckoutContext);

    const onSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        onBeforePayment();
    }

    const login = (e, data) => {

        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        setNextDisplayState("cartFullPage");
        globalThis?.window?.[withLogin?.globalFunc]?.(data)
    };

    const hasBranding = !!texts.branding;

    return (
        <FullPageLayout show={true}>
            <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
            >
                <Dialog.Panel className="pointer-events-auto w-screen overflow-y-auto">
                    {hasBranding && (
                        <div className="bg-opacity-50">
                            <div className="px-16 py-14 rounded-md text-center">
                                {texts.branding}
                            </div>
                        </div>
                    )}
                    <CloseButton onClick={() => setDisplayState("widget")}/>

                    <div className={`max-w-2xl mx-auto ${hasBranding ? "" : "pt-16"} pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8`}>
                        <h2 className="sr-only">Kasse</h2>

                        <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16" onSubmit={onSubmit}>

                            <div>
                                {withLogin?.globalFunc && !email && (
                                    <>
                                        <div className="lg:grid lg:grid-cols-2">
                                            <div className="pt-12 pb-3 lg:py-6 lg:pr-4">
                                                <button
                                                    onClick={(e) => login(e, {extraQueryParams: {type: "registration"}})}
                                                    type="button"
                                                    className={"w-full text-bg-color-600 border border-bg-color-600 rounded-md shadow-sm py-3 px-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"}
                                                >
                                                    Registrieren
                                                </button>
                                            </div>
                                            <div className="pb-6 lg:py-6 lg:pl-4">
                                                <button
                                                    onClick={(e) => login(e)}
                                                    type="button"
                                                    className={"w-full bg-color-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"}
                                                >
                                                    Anmelden
                                                </button>
                                            </div>
                                        </div>
                                        <div
                                            className={"flex items-center justify-between text-center uppercase pb-7 text-sm text-color-500 before:content-[''] before:inline-block before:h-px before:bg-gray-200 before:grow after:content-[''] after:inline-block after:h-px after:bg-gray-200 after:grow"}>
                                            <span className={"inline-block px-1"}>ODER ALS GAST BESTELLEN</span>
                                        </div>
                                    </>
                                )}
                                <CheckoutForm/>
                            </div>

                            <div className="mt-10 lg:mt-0">
                                <h2 className="text-lg font-medium text-color-900">Bestellzusammenfassung</h2>
                                <CheckoutSummary/>
                                {texts.subCheckoutSummary && (
                                    <div
                                        className="mt-10 text-sm text-color-500"
                                        dangerouslySetInnerHTML={{__html: texts.subCheckoutSummary}}
                                    />
                                )}
                            </div>
                        </form>

                        <FullPageFooter/>

                    </div>

                </Dialog.Panel>
            </Transition.Child>
        </FullPageLayout>
    );
}

export default CartFullPage;
