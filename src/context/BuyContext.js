import React, {createContext, useState, useEffect, useRef} from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import CONST from "../lib/const";
import {ApolloContextProvider} from "./ApolloContext";
import {CheckoutContextProvider} from "./CheckoutContext";

import Cart from "../cart.jsx";
import Banner from "../components/banner.jsx";

export const BuyContext = createContext({});

export const BuyContextProvider = (props) => {
    const {uri, shop, children, paymentProviders, channel, eftId, useSkeleton} = props;
    const [isDebug, setIsDebug] = useState(false);
    const [checkoutToken, setCheckoutToken, removeCheckoutToken] = useLocalStorage(CONST.CHECKOUT_KEY);
    const [bannerMessage, setBannerMessage] = useState({msg: "", isError: false});

    if (!uri || !shop) {
        return children;
    }

    if (CONST.ENABLED_SHOPS.indexOf(shop) === -1) {
        throw new Error(`${shop} is not supported by react-ez-checkout`);
    }

    const fetchStripePaymentIntent = async (clientSecret) => {
        let apiKey;
        paymentProviders.forEach(provider => {
            if (provider.name === "stripe") {
                apiKey = provider.config.apiKey;
            }
        });

        if (clientSecret && apiKey) {
            let paymentIntent = new URLSearchParams(window?.location?.search)?.get("payment_intent");
            let queryString = new URLSearchParams({
                key: apiKey,
                is_stripe_sdk: false,
                client_secret: clientSecret
            }).toString();
            let result = await fetch("https://api.stripe.com/v1/payment_intents/" + paymentIntent + "?" + queryString, {
                method: "GET",
                headers: {"Content-Type": "application/x-www-form-urlencoded"}
            }).then(res => res.json());
            console.log("paymentIntent:", result);

            let isError = result.status !== "succeeded" && result.status !== "processing";
            let msg = isError ? "Bei der Bestellung ist etwas schiefgegangen." : "Die Zahlung war erfolgreich!";
            let nextUrl = window?.location?.origin + (window?.location?.pathname || "");
            window?.history?.pushState?.({lastPayment: result}, window?.document?.title, nextUrl);
            // setBannerMessage({msg: msg});
        }
    }

    useEffect(() => {
        const stripePaymentParam = new URLSearchParams(window?.location?.search)?.get("payment_intent_client_secret");
        if (stripePaymentParam) {
            removeCheckoutToken?.();
            fetchStripePaymentIntent(stripePaymentParam);
        }
    }, []);

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
                <ApolloContextProvider uri={uri}>
                    <CheckoutContextProvider channel={channel} eftId={eftId}>
                        {children}
                        <Cart />
                        <Banner {...bannerMessage} key="banner-message" />
                    </CheckoutContextProvider>
                </ApolloContextProvider>
            )}
        </BuyContext.Provider>
    );
};

BuyContext.BuyContextProvider = BuyContextProvider;
export default BuyContext;
