import React, {Fragment, useEffect} from "react";
import {PaymentElement, IbanElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

const StripePayment = ({}) => {
    const elements = useElements();
    const stripe = useStripe();

    console.log("StripePayment", typeof stripe, stripe);

    const createPaymentIntent = async () => {
        console.log(Object.keys(stripe));
        try {
            const url = new URL("https://api.stripe.com/v1/payment_intents");
            url.searchParams.append("amount", "16");
            url.searchParams.append("currency", "eur");
            const res = await fetch(url.href, {
                method: "POST",
                headers: {
                    Authorization: "Bearer sk_test_51KyvxoC6ZdKmUgieW1IAyZBFfkxEuBdeTxgvYktBP00NA8zW1gNTmDgnrAYG9wZTelB4OyTk6gwUKYHuVZxrDf4V000yCrGre0"
                }
            }).then(res => res.json());
            console.log(res);
        } catch (e) {
            console.log(e);
        }
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
            {/*<PaymentElement />*/}
        </form>
    );
}

export default StripePayment;
