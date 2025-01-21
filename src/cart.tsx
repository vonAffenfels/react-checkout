import React from "react";

import CartWidget, { type CartWidgetProps } from "./cartWidget";

const Cart = (props: CartWidgetProps) => {
    return (
        <div className="react-ez-checkout-cart-wrapper">
            <CartWidget {...props} />
        </div>
    );
};

export default Cart;
