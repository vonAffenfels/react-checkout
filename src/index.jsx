import React from "react";
import "./styles/tailwind.css";

import ApolloContext, {ApolloContextProvider} from "./context/ApolloContext";
import CheckoutContext, {CheckoutContextProvider} from "./context/CheckoutContext";
import useLocalStorage from "./hooks/useLocalStorage";
import CONST from "./lib/const";

import Cart from "./cart.jsx";
import CheckoutLine from "./components/checkoutLine.jsx";

Cart.CheckoutLine = CheckoutLine;

Cart.ApolloContext = ApolloContext;
Cart.CheckoutContext = CheckoutContext;
Cart.BuyContext = ({children, uri, channel}) => {
    if (!uri || typeof window === "undefined") {
        return children;
    }

    return (
        <ApolloContextProvider uri={uri}>
            <CheckoutContextProvider channel={channel}>
                {children}
            </CheckoutContextProvider>
        </ApolloContextProvider>
    );
};
Cart.useLocalStorage = useLocalStorage;
Cart.CHECKOUT_KEY = CONST.CHECKOUT_KEY;

export default Cart;
