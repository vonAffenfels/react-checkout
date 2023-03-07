import React, {Fragment, useContext, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";

import CheckoutContext from "./context/CheckoutContext";
import AbortButton from "./components/abortButton.jsx";
import CloseButton from "./components/closeButton.jsx";
import FullPageLayout from "./components/fullPageLayout.jsx";
import PaymentForm from "./components/paymentForm.jsx";
import FullPageFooter from "./components/fullPageFooter.jsx";

const PaymentFullPage = ({}) => {
    const {setDisplayState} = useContext(CheckoutContext);
    const [isMounting, setMounting] = useState(true);

    useEffect(() => {
        setMounting(false);
    }, []);

    return (
        <FullPageLayout show={true} onClose={() => setMounting(true)}>
            <Transition.Child
                as="div"
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
            >
                <Dialog.Panel className="pointer-events-auto w-screen overflow-y-auto">
                    <AbortButton onClick={() => setDisplayState("cartFullPage")} />
                    <CloseButton onClick={() => setDisplayState("widget")} />
                </Dialog.Panel>

                <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <PaymentForm />
                    <FullPageFooter />
                </div>
            </Transition.Child>
        </FullPageLayout>
    );
}

export default PaymentFullPage;
