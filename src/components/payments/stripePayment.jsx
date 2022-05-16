import React, {Fragment, useEffect} from "react";
import {PaymentElement, IbanElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

const StripePayment = ({apiKey}) => {
    const elements = useElements();
    const stripe = useStripe();

    console.log("StripePayment", typeof stripe, stripe);

    const createPaymentIntent = async () => {
        console.log(Object.keys(stripe));
        const res = await fetch({
            method: "POST",
            url: "https://api.stripe.com/v1/payment_intents",
            data: JSON.stringify({
                amount: 16.5,
                currency: "eur",
            }),
            headers: {
                Authorization: "Basic " + btoa(apiKey)
            }
        }).then(res => res.json());
        console.log(res);
    };

    useEffect(() => {

    }, []);

    useEffect(() => {
        if (stripe) {
            createPaymentIntent();
        }
    }, [stripe]);

    return (
        <form>
            <IbanElement />
            {/*<PaymentElement />*/}
        </form>
    );
}

export default StripePayment;
