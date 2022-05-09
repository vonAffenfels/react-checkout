import React, {Fragment, useContext, useState} from "react";
import CheckoutContext from "./context/CheckoutContext";

const Cart = ({...props}) => {
    const {checkout} = useContext(CheckoutContext);

    console.log("Cart, checkout:", checkout);

    return (
        <Fragment>
            {checkout?.lines?.map((cartItem, i) => (
                <div key={"cart-item-" + i} className="fixed inset-0 overflow-hidden">
                    <p>
                        <span>{cartItem.variant.product.name} {cartItem.variant.name} x{cartItem.quantity}</span>
                        <span>Preis: {cartItem.totalPrice.gross.amount} {cartItem.totalPrice.gross.currency}</span>
                    </p>
                </div>
            ))}
        </Fragment>
    );
};

export default Cart;
