import React, {Fragment, useContext} from "react";
import {Dialog, Transition} from "@headlessui/react";

import CheckoutContext from "./context/CheckoutContext";
import CloseButton from "./components/closeButton.jsx";

const CartFullPage = ({props}) => {
    const {
        checkout,
        setDisplayState
    } = useContext(CheckoutContext);

    return (
        <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
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
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </div>
    );
}

export default CartFullPage;
