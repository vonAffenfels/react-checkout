import React, {useContext, useEffect} from "react";

import CheckoutContext from "./context/CheckoutContext";
import CartWidget from "./cartWidget.jsx";
import CartFullPage from "./cartFullPage.jsx";
import PaymentFullPage from "./PaymentFullPage.jsx";

const Cart = ({...props}) => {
    let {displayState, setDisplayState, setSelectedPaymentGatewayId} = useContext(CheckoutContext);
    let component = null;

    useEffect(() => {
        if (new URLSearchParams(window?.location?.search)?.get(
            "payment_intent_client_secret"
        )) {
            setDisplayState("payment");
            setSelectedPaymentGatewayId("saleor.payments.stripe");
        }
    }, []);

    //TODO how to transition between states? must be prettier
    if (displayState === "widget") {
        component = <CartWidget />
    } else if (displayState === "cartFullPage") {
        component = <CartFullPage />
    } else if (displayState === "payment") {
        component = <PaymentFullPage />;
    }

    return <div className="react-ez-checkout-cart-wrapper">{component}</div>;
};

export default Cart;
