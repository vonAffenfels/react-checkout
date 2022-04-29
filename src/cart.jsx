import "regenerator-runtime/runtime.js";

import React, {Fragment, useContext, useState} from "react";
import CartContext from "./context/CartContext";

const Cart = ({...props}) => {
    const {addItemToCart} = useContext(CartContext);

    const [variantId, setVariantId] = useState("");

    const onClick = async () => {
        await addItemToCart(variantId);
    };

    return (
        <Fragment>
            <input onChange={setVariantId} value={variantId} type="text" />
            <input onClick={onClick} type="button" />
        </Fragment>
    );
};

export default Cart;
