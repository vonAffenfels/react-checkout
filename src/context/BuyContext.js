import React, {createContext, useState, useEffect} from "react";
import CONST from "../lib/const";
import {ApolloContextProvider} from "./ApolloContext";
import {CheckoutContextProvider} from "./CheckoutContext";

import Cart from "../cart.jsx";
import Banner from "../components/banner.jsx";

export const BuyContext = createContext({});

export const BuyContextProvider = ({children, uri, channel, shop, paymentProviders}) => {
    const [bannerMessage, setBannerMessage] = useState("");

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
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(res => res.json());

            // body: new URLSearchParams({
            //     currency: String(checkout?.totalPrice?.gross?.currency).toLowerCase(),
            //     amount: String(checkout?.totalPrice?.gross?.amount).replace(".", "")
            // }).toString()
            console.log("PAYMENT STATE::::", result);
            //TODO correct message
            setBannerMessage(result.status);
            setTimeout(() => setBannerMessage(""));
        }
    }

    useEffect(() => {
        const stripePaymentParam = new URLSearchParams(window?.location?.search)?.get("payment_intent_client_secret");
        if (stripePaymentParam) {
            fetchStripePaymentIntent(stripePaymentParam);
        }
    }, []);

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
                    {bannerMessage && <Banner />}
                </CheckoutContextProvider>
            </ApolloContextProvider>
        </BuyContext.Provider>
    );
};

BuyContext.BuyContextProvider = BuyContextProvider;
export default BuyContext;
