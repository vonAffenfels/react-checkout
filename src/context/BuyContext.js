import React, {createContext, useState, useEffect} from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import CONST from "../lib/const";
import {ApolloContextProvider} from "./ApolloContext";
import {CheckoutContextProvider} from "./CheckoutContext";

import Cart from "../cart.jsx";
import Banner from "../components/banner.jsx";

export const BuyContext = createContext({});

export const BuyContextProvider = (props) => {
    const {uri, shop, children, paymentProviders, channel} = props;
    const [checkoutToken, setCheckoutToken, removeCheckoutToken] = useLocalStorage(CONST.CHECKOUT_KEY);
    const [bannerMessage, setBannerMessage] = useState(null);

    if (!uri || !shop || typeof window === "undefined") {
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

            console.log("PAYMENT STATE:", result);
            let isError = result.status !== "succeeded";
            let msg = isError ? "Bei der Bestellung ist etwas schiefgegangen." : "Die Bestellung war erfolgreich!";
            setBannerMessage({msg, isError});
            setTimeout(() => setBannerMessage(null), 10000);
        }
    }

    useEffect(() => {
        const stripePaymentParam = new URLSearchParams(window?.location?.search)?.get("payment_intent_client_secret");
        if (stripePaymentParam) {
            removeCheckoutToken?.();
            fetchStripePaymentIntent(stripePaymentParam);
        }
    }, []);

    console.log("Starting react-checkout for shop type", shop, "..");
    return (
        <BuyContext.Provider value={{
            ...props,
            setBannerMessage,
            isDebug: window?.location?.search?.indexOf?.("isDebug") !== -1
        }}>
            <ApolloContextProvider uri={uri}>
                <CheckoutContextProvider channel={channel}>
                    {children}
                    <Cart />
                    {bannerMessage && <Banner {...bannerMessage} />}
                </CheckoutContextProvider>
            </ApolloContextProvider>
        </BuyContext.Provider>
    );
};

BuyContext.BuyContextProvider = BuyContextProvider;
export default BuyContext;
