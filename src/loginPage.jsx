import React, {Fragment, useContext, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";

import CheckoutContext from "./context/CheckoutContext";
import FullPageLayout from "./components/fullPageLayout.jsx"
import CloseButton from "./components/closeButton.jsx";
import BuyContext from "./context/BuyContext";

const LoginPage = ({props}) => {
    const {withLogin} = useContext(BuyContext);
    const {
        setDisplayState,
        setNextDisplayState
    } = useContext(CheckoutContext);

    const login = () => {
        setNextDisplayState("cartFullPage");
        globalThis?.window?.[withLogin?.globalFunc]?.()
    };

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
                    <CloseButton onClick={() => setDisplayState("widget")}/>

                    <div className="max-w-xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
                        <h2 className="sr-only">Login</h2>

                        <div className="lg:grid lg:grid-cols-1 lg:gap-x-12 xl:gap-x-16">
                            <div className="mt-10 lg:mt-0">
                                <h2 className="text-lg font-medium text-color-900">Bestellung fortsetzen</h2>
                                <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <div className="py-6 px-4 sm:px-6">
                                        <button
                                            onClick={login}
                                            type="submit"
                                            className={"w-full bg-color-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"}
                                        >
                                            Anmelden
                                        </button>
                                    </div>
                                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                        <button
                                            onClick={() => setDisplayState("cartFullPage")}
                                            type="submit"
                                            className={"w-full bg-ultradark border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"}
                                        >
                                            Als Gast fortfahren
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </Dialog.Panel>
            </Transition.Child>
        </FullPageLayout>
    );
}

export default LoginPage;
