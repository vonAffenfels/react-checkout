import React, {Fragment, useContext, useEffect, useState} from "react";
import {PaymentElement, Elements, useElements, useStripe} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

import CheckoutContext from "../../context/CheckoutContext";
import BuyContext from "../../context/BuyContext";

let GLOBAL_PAYMENT_INTENT_HANDLED_FLAG = false;

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const StripePaymentForm = () => {
    const elements = useElements();
    const stripe = useStripe();

    console.log("StripePaymentForm", stripe, elements);
    const onSubmit = (e) => {
        e.preventDefault?.();
        e.stopPropagation?.();
        console.log("StripePaymentForm onSubmit", e);
        console.log(elements);
    }

    return (
        <form id="stripe-payment-form" onSubmit={onSubmit}>
            <PaymentElement id="stripe-payment-element" />
            <button
                disabled={!elements || !stripe}
                type="submit"
                className={
                    classNames(
                        elements && stripe ? "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500" : "cursor-not-allowed",
                        "w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white"
                    )
                }
            >
                Jetzt bezahlen
            </button>
        </form>
    );
};

const StripePayment = ({stripePromise}) => {
    const {shop, paymentProviders, uri} = useContext(BuyContext);
    const {checkout, checkoutToken} = useContext(CheckoutContext);
    const [clientSecret, setClientSecret] = useState(null);

    let apiUri = "";
    paymentProviders.forEach(provider => {
        if (provider.name === "stripe") {
            apiUri = provider.config.apiUri;
        }
    });

    const createPaymentIntent = async () => {
        try {
            if (GLOBAL_PAYMENT_INTENT_HANDLED_FLAG) {
                return;
            }
            GLOBAL_PAYMENT_INTENT_HANDLED_FLAG = true;

            const paymentIntent = await fetch(apiUri, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: "stripe.create_payment_intent",
                    checkoutToken: checkout?.token,
                    shop: shop,
                    shopUri: uri
                })
            }).then(res => res.json());

            setClientSecret(paymentIntent.client_secret);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        createPaymentIntent();

        return () => {
            GLOBAL_PAYMENT_INTENT_HANDLED_FLAG = false;
        };
    }, []);

    if (!clientSecret || !apiUri) {
        return null;
    }

    return (
        <Elements stripe={stripePromise} options={{clientSecret}}>
            <StripePaymentForm />
        </Elements>
    );
}

export default StripePayment;
