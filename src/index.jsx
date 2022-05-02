import React from "react";

import ApolloContext, {ApolloContextProvider} from "./context/ApolloContext";
import CartContext, {CartContextProvider} from "./context/CartContext";
import CheckoutContext, {CheckoutContextProvider} from "./context/CheckoutContext";
import useLocalStorage from "./hooks/useLocalStorage";
import CONST from "./lib/const";

import Cart from "./cart.jsx";

Cart.ApolloContext = ApolloContext;
Cart.CartContext = CartContext;
Cart.CheckoutContext = CheckoutContext;
Cart.BuyContext = ({children, uri, channel}) => {
    console.log(children, uri, channel);
    if (!uri || typeof window === "undefined") {
        return children;
    }

    return (
        <ApolloContextProvider uri={uri}>
            <CheckoutContextProvider channel={channel}>
                <CartContextProvider>
                    {children}
                </CartContextProvider>
            </CheckoutContextProvider>
        </ApolloContextProvider>
    );
};
Cart.useLocalStorage = useLocalStorage;
Cart.CHECKOUT_KEY = CONST.CHECKOUT_KEY;

export default Cart;
