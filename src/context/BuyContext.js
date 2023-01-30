import React, {createContext, useState, useEffect, useRef} from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import CONST from "../lib/const";
import {ApolloContextProvider} from "./ApolloContext";
import {CheckoutContextProvider} from "./CheckoutContext";

import Cart from "../cart.jsx";
import Banner from "../components/banner.jsx";

export const BuyContext = createContext({});

export const BuyContextProvider = (props) => {
    const isMountedRef = useRef(false);
    const [isMounted, setMounted] = useState(false);
    const {uri, shop, children, paymentProviders, channel} = props;
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
        console.log("fetchStripePaymentIntent, paymentProviders:", paymentProviders);
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
            let msg = isError ? "Bei der Bestellung ist etwas schiefgegangen." : "Die Bestellung war erfolgreich!";
            let nextUrl = window?.location?.origin + (window?.location?.pathname || "");
            window?.history?.pushState?.({lastPayment: result}, window?.document?.title, nextUrl);
            setBannerMessage({msg: msg});
        }
    }

    useEffect(() => {
        const stripePaymentParam = new URLSearchParams(window?.location?.search)?.get("payment_intent_client_secret");
        console.log("useEffect, stripePaymentParam:", stripePaymentParam);
        if (stripePaymentParam) {
            removeCheckoutToken?.();
            fetchStripePaymentIntent(stripePaymentParam);
        }
    }, []);

    useEffect(() => {
        if (isMountedRef?.current || isMounted) {
            return;
        }

        isMountedRef.current = true;
        setMounted(true);
        return () => isMountedRef.current = false;
    }, []);

    // enable SSR
    if (!isMounted) {
        return children;
    }

    console.log("Starting react-checkout for shop type", shop, "..");
    return (
        <BuyContext.Provider value={{
            ...props,
            bannerMessage,
            setBannerMessage,
            isDebug: window?.location?.search?.indexOf?.("isDebug") !== -1
        }}>
            <ApolloContextProvider uri={uri}>
                <CheckoutContextProvider channel={channel}>
                    {children}
                    <Cart />
                    <Banner {...bannerMessage} key="banner-message" />
                </CheckoutContextProvider>
            </ApolloContextProvider>
        </BuyContext.Provider>
    );
};

BuyContext.BuyContextProvider = BuyContextProvider;
export default BuyContext;
