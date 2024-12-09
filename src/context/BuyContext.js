import React, {createContext, useState, useEffect} from "react";
import CONST from "../lib/const";
import {CheckoutContextProvider} from "./CheckoutContext";

import Cart from "../cart.jsx";
import Banner from "../components/banner.jsx";

export const BuyContext = createContext({});

export const BuyContextProvider = (props) => {
    const {uri, shop, children, eftId, useSkeleton} = props;
    const [isDebug, setIsDebug] = useState(false);
    const [bannerMessage, setBannerMessage] = useState({msg: "", isError: false});

    useEffect(() => {
        const htmlElement = document.querySelector("html");
        const observer = new MutationObserver((mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.target.style.position === "fixed") {
                    mutation.target.style.position = null;
                }
            }
        });
        observer.observe(htmlElement, {attributes: true});
        if (htmlElement.style.position === "fixed") {
            htmlElement.style.position = null;
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        setIsDebug(window?.location?.search?.indexOf?.("isDebug") !== -1)
    }, [])

    if (!uri || !shop) {
        return children;
    }

    return (
        <BuyContext.Provider value={{
            ...props,
            bannerMessage,
            setBannerMessage,
            isDebug
        }}>
            {useSkeleton ? (
                children
            ) : (
                <CheckoutContextProvider eftId={eftId}>
                    {children}
                    <Cart />
                    <Banner {...bannerMessage} key="banner-message" />
                </CheckoutContextProvider>
            )}
        </BuyContext.Provider>
    );
};

BuyContext.BuyContextProvider = BuyContextProvider;
export default BuyContext;
