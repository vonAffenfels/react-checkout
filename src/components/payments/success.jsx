import React, {useContext, useRef, useEffect} from "react";

import CheckoutContext from "../../context/CheckoutContext";
import BuyContext from "../../context/BuyContext";
import {Spin} from "../atoms/animate.jsx";

let timeoutHandle = null;

export const Success = () => {
    const {checkout} = useContext(CheckoutContext);
    console.log("checkout", checkout)
    const orderName = checkout?.order?.name;

    return <Banner orderName={orderName} />;
}

export const Banner = ({orderName}) => {
    const {reset} = useContext(CheckoutContext);
    const {setBannerMessage, successRedirect} = useContext(BuyContext);
    const executedRef = useRef(false);

    useEffect(() => {
        if (executedRef?.current) {
            return;
        }

        executedRef.current = true;

        clearTimeout(timeoutHandle);
        timeoutHandle = setTimeout(() => {
            timeoutHandle = null;
            // setBannerMessage({
            //     msg: `Bestellung ${orderName} wurde erfolgreich getätigt.`
            // });
            reset();
            if (successRedirect) {
                window.location.href = window.location.origin + successRedirect;
            }
        }, 2000);

        return () => {
            clearTimeout(timeoutHandle);
            timeoutHandle = null;
        };
    }, []);

    return (
        <>
            <div className="mx-auto w-6/12 text-center">
                Bestellung {orderName} wurde erfolgreich getätigt. Sie werden weitergeleitet.
            </div>
            <div className="mx-auto w-20 mt-20">
                <Spin className="-ml-1 mr-3" w={10} h={10}/>
            </div>
        </>
    );
}
