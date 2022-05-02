import React, {Fragment, useContext, useState} from "react";
import CartContext from "./context/CartContext";

const Cart = ({...props}) => {
    const cartContext = useContext(CartContext);
    const {addItemToCart} = cartContext;

    const [variantId, setVariantId] = useState("");

    const onChange = (e) => {
        setVariantId(e.target.value);
    };

    const onClick = async () => {
        await addItemToCart(variantId);
    };

    return (
        <Fragment>
            <input onChange={onChange} value={variantId} type="text" />
            <input onClick={onClick} type="button" />
        </Fragment>
    );
};

export default Cart;
