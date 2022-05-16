import React, {Fragment, useContext, useEffect, useState} from "react";
import {PaymentElement, Elements, useElements, useStripe} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

import CheckoutContext from "../../context/CheckoutContext";

let GLOBAL_PAYMENT_INTENT_HANDLED_FLAG = false;

const StripePaymentForm = () => {
    const elements = useElements();
    const stripe = useStripe();

    console.log("StripePaymentForm", stripe, elements);
    const onSubmit = (e) => {
        console.log("StripePaymentForm onSubmit",e );
    }

    return (
        <form id="stripe-payment-form" onSubmit={onSubmit}>
            <PaymentElement id="stripe-payment-element" />
        </form>
    );
};

const StripePayment = ({stripePromise}) => {
    const {checkout} = useContext(CheckoutContext);
    const [clientSecret, setClientSecret] = useState(null);

    console.log("stripePayment", clientSecret)
    const createPaymentIntent = async () => {
        try {
            console.log("createPaymentIntent", clientSecret);
            if (GLOBAL_PAYMENT_INTENT_HANDLED_FLAG) {
                return;
            }
            GLOBAL_PAYMENT_INTENT_HANDLED_FLAG = true;
            //TODO create the paymentIntent on the server side for given checkout!
            const paymentIntent = await fetch("https://api.stripe.com/v1/payment_intents", {
                method: "POST",
                headers: {
                    Authorization: "Bearer sk_test_51KyvxoC6ZdKmUgieW1IAyZBFfkxEuBdeTxgvYktBP00NA8zW1gNTmDgnrAYG9wZTelB4OyTk6gwUKYHuVZxrDf4V000yCrGre0",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    "currency": String(checkout?.totalPrice?.gross?.currency).toLowerCase(),
                    "amount": String(checkout?.totalPrice?.gross?.amount).replace(".", ""),
                    "automatic_payment_methods[enabled]": true
                }).toString()
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
    }, []);

    console.log(stripePromise, clientSecret)
    if (!clientSecret) {
        return null;
    }

    return (
        <Elements stripe={stripePromise} options={{clientSecret}}>
            <StripePaymentForm />
        </Elements>
    );
}

export default StripePayment;
