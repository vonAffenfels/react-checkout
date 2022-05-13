import React, {Fragment, useEffect} from "react";
import {PaymentElement, IbanElement, useElements, useStripe} from "@stripe/react-stripe-js";

const StripePayment = ({}) => {
    const elements = useElements();
    const stripe = useStripe();

    console.log("StripePayment", typeof stripe, stripe);

    const createPaymentIntent = async () => {
        console.log(Object.keys(stripe));
        console.log(stripe.createToken.toString());
        console.log(stripe.createSource.toString());
        const paymentIntent = await stripe?.paymentIntents?.create({
            amount: 2,
            currency: "eur",
        });
        console.log("paymentIntent", paymentIntent);
    };

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
