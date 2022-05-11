import React, {Fragment, useContext, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";

import CheckoutContext from "./context/CheckoutContext";
import FullPageLayout from "./components/fullPageLayout.jsx"
import CloseButton from "./components/closeButton.jsx";

const CartFullPage = ({props}) => {
    const {checkout, setDisplayState} = useContext(CheckoutContext);
    const [isMounting, setMounting] = useState(true);

    useEffect(() => {
        setMounting(false);
    }, []);

    console.log("isMounting", isMounting);

    return (
        <FullPageLayout show={true} onClose={() => setMounting(true)}>
            <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
            >
                <Dialog.Panel className="pointer-events-auto w-screen">
                    <CloseButton onClick={() => setDisplayState("widget")} />

                    <div className="bg-gray-50">
                        <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                            <h2 className="sr-only">Checkout</h2>

                            <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                                <div>
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900">Contact information</h2>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </Dialog.Panel>
            </Transition.Child>
        </FullPageLayout>
    );
}

export default CartFullPage;
