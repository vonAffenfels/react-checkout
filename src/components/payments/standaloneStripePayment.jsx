import React, {useContext, useEffect, useRef, useState} from "react";
import {Elements} from "@stripe/react-stripe-js";

import BuyContext from "../../context/BuyContext";
import {StripePaymentForm, StripeSetupForm} from "./stripePayment.jsx";
import {loadStripe} from "@stripe/stripe-js/dist/pure.esm";

const StandaloneStripePayment = ({
    clientSecret,
    isSetup,
    className,
    listeners = {},
}) => {
    const executedRef = useRef(false);
    const buyContext = useContext(BuyContext);
    const paymentProviders = buyContext.paymentProviders;
    const [loadedConfig, setLoadedConfig] = useState(null);

    useEffect(() => {
        if (executedRef.current || !paymentProviders) {
            return;
        }

        executedRef.current = true;
        const stripeCfg = (paymentProviders || []).find(provider => provider.name === "stripe")
        setLoadedConfig({
            stripeCfg: stripeCfg,
            stripePromise: loadStripe(stripeCfg.config.apiKey),
            clientSecret: clientSecret || new URL(window?.location?.href)?.searchParams?.get?.("client_secret"),
        });
    }, [paymentProviders]);

    if (!executedRef?.current || !loadedConfig?.stripePromise || !loadedConfig?.clientSecret) {
        return null;
    }

    return (
        <div className="react-ez-checkout-cart-wrapper">
            <div className={className || "absolute z-insane inset-0 bg-white max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8"}>
                <Elements stripe={loadedConfig.stripePromise} options={{clientSecret: loadedConfig.clientSecret}}>
                    {isSetup ? (
                        <StripeSetupForm clientSecret={loadedConfig.clientSecret} isStandalone={true} listeners={listeners} />
                    ) : (
                        <StripePaymentForm clientSecret={loadedConfig.clientSecret} isStandalone={true} listeners={listeners} />
                    )}
                </Elements>
            </div>
        </div>
    )
};

export default StandaloneStripePayment;
