import React, {Fragment, useContext} from "react";

import CheckoutContext from "./context/CheckoutContext";
import CartWidget from "./cartWidget.jsx";
import CartFullPage from "./cartFullPage.jsx";

const Cart = ({...props}) => {
    const {displayState} = useContext(CheckoutContext);

    if (displayState === "widget") {
        return <CartWidget />
    } else if (displayState === "cartFullPage") {
        return <CartFullPage />
    }

    return null;
};

export default Cart;
