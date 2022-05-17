import React, {Fragment, useContext, useEffect, useState} from "react";
import {PaymentElement, Elements, useElements, useStripe} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

import CheckoutContext from "../../context/CheckoutContext";
import BuyContext from "../../context/BuyContext";

let GLOBAL_PAYMENT_INTENT_HANDLED_FLAG = false;

const StripePaymentForm = () => {
    const elements = useElements();
    const stripe = useStripe();

    console.log("StripePaymentForm", stripe, elements);
    const onSubmit = (e) => {
        console.log("StripePaymentForm onSubmit", e);
        console.log(elements);
    }

    return (
        <form id="stripe-payment-form" onSubmit={onSubmit}>
            <PaymentElement id="stripe-payment-element" />
            <button type="submit" disabled={!elements || !stripe}>Jetzt bezahlen</button>
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

    console.log("stripePayment", clientSecret)
    const createPaymentIntent = async () => {
        try {
            console.log("createPaymentIntent", clientSecret);
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
            console.log(paymentIntent);
            setClientSecret(paymentIntent.client_secret);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        console.log("useEffect");
        createPaymentIntent();

        return () => {
            GLOBAL_PAYMENT_INTENT_HANDLED_FLAG = false;
        };
    }, []);

    console.log(stripePromise, clientSecret)
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
