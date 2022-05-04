import React, {Fragment, useContext, useState} from "react";
import CheckoutContext from "./context/CheckoutContext";

const Cart = ({...props}) => {
    const {checkout} = useContext(CheckoutContext);

    console.log("Cart, checkout:", checkout);

    return (
        <Fragment>
            {checkout?.lines?.map((cartItem, i) => (
                <div key={"cart-item-" + i}>
                    {JSON.stringify(cartItem)}
                </div>
            ))}
        </Fragment>
    );
};

export default Cart;
