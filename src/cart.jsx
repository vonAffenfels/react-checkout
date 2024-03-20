import React, {useContext} from "react";

import CheckoutContext from "./context/CheckoutContext";
import CartWidget from "./cartWidget.jsx";
import CartFullPage from "./cartFullPage.jsx";
import PaymentFullPage from "./paymentFullPage.jsx";

const Cart = ({...props}) => {
    let {displayState} = useContext(CheckoutContext);
    let component = null;

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
