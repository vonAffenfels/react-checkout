import React, {createContext, useState, useContext, useEffect} from "react";
import ApolloContext from "./ApolloContext";
import CheckoutContext from "./CheckoutContext";

export const CartContext = createContext({
    cartItems: []
});

export const CartContextProvider = ({children}) => {
    const {checkout, createCheckout, addItemToCheckout} = useContext(CheckoutContext);

    const addItemToCart = async (variantId) => {
        console.log("addItemToCart", variantId, checkout);
        if (!checkout) {
            await createCheckout(variantId);
        } else {
            await addItemToCheckout(variantId);
        }
    };

    return (
        <CartContext.Provider value={{
            addItemToCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};

CartContext.CartContextProvider = CartContextProvider;
export default CartContext;
