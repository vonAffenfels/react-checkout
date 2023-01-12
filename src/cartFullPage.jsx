import React, {Fragment, useContext, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";

import CheckoutContext from "./context/CheckoutContext";
import FullPageLayout from "./components/fullPageLayout.jsx"
import CloseButton from "./components/closeButton.jsx";
import CheckoutForm from "./components/checkoutForm.jsx";
import CheckoutSummary from "./components/checkoutSummary.jsx";

const CartFullPage = ({props}) => {
    const {
        setDisplayState,
        onBeforePayment,
    } = useContext(CheckoutContext);

    const onSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        onBeforePayment();
    }

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
                    <CloseButton onClick={() => setDisplayState("widget")} />

                    <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                        <h2 className="sr-only">Kasse</h2>

                        {/*<form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16" onSubmit={onSubmit}>*/}
                        {/*    <CheckoutForm />*/}

                        {/*    <div className="mt-10 lg:mt-0">*/}
                        {/*        <h2 className="text-lg font-medium text-color-900">Bestellzusammenfassung</h2>*/}
                        {/*        <CheckoutSummary />*/}
                        {/*    </div>*/}
                        {/*</form>*/}

                    </div>

                </Dialog.Panel>
            </Transition.Child>
        </FullPageLayout>
    );
}

export default CartFullPage;
