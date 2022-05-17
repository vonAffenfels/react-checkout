import React, {createContext, useState} from "react";
import CONST from "../lib/const";
import {ApolloContextProvider} from "./ApolloContext";
import {CheckoutContextProvider} from "./CheckoutContext";

import Cart from "../cart.jsx";

export const BuyContext = createContext({});

export const BuyContextProvider = ({children, uri, channel, shop, paymentProviders}) => {
    if (!uri || !shop || typeof window === "undefined") {
        return children;
    }

    if (CONST.ENABLED_SHOPS.indexOf(shop) === -1) {
        throw new Error(`${shop} is not supported by react-ez-checkout`);
    }

    return (
        <BuyContext.Provider value={{
            shop,
            paymentProviders,
            uri
        }}>
            <ApolloContextProvider uri={uri}>
                <CheckoutContextProvider channel={channel}>
                    {children}
                    <Cart />
                </CheckoutContextProvider>
            </ApolloContextProvider>
        </BuyContext.Provider>
    );
};

BuyContext.BuyContextProvider = BuyContextProvider;
export default BuyContext;
