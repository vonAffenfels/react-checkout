import React, {Fragment, useContext, useState} from "react";
import CartContext from "./context/CartContext";

const Cart = ({...props}) => {
    const cartContext = useContext(CartContext);
    const {cartItems} = cartContext;

    return (
        <Fragment>
            {cartItems.map((cartItem, i) => (
                <div key={"cart-item-" + i}>
                    {JSON.stringify(cartItem)}
                </div>
            ))}
        </Fragment>
    );
};

export default Cart;
