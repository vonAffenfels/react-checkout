import React, {useContext, useRef, useEffect} from "react";

import CheckoutContext from "../../context/CheckoutContext";
import BuyContext from "../../context/BuyContext";
import {Spin} from "../atoms/animate.jsx";

let timeoutHandle = null;

const Success = () => {
    const {checkout, removeCartId, removeCheckoutToken, setDisplayState, reset} = useContext(CheckoutContext);
    const {setBannerMessage} = useContext(BuyContext);
    const orderName = checkout?.order?.name;
    const executedRef = useRef(false);

    console.log("checkout", checkout, JSON.parse(JSON.stringify(checkout)), orderName);

    useEffect(() => {
        if (executedRef?.current) {
            return;
        }

        executedRef.current = true;

        clearTimeout(timeoutHandle);
        timeoutHandle = setTimeout(() => {
            timeoutHandle = null;
            setBannerMessage({
                msg: `Bestellung ${orderName} wurde erfolgreich getätigt.`
            });
            reset();
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
                <Spin w={10} h={10} />
            </div>
        </>
    );
}

export default Success;
