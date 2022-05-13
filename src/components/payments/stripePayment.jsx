import React, {Fragment} from "react";
import {PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";

const StripePayment = ({}) => {
    const elements = useElements();
    const stripe = useStripe();

    console.log("StripePayment", typeof stripe, stripe);

    return (
        <form>
            <PaymentElement />
        </form>
    );
}

export default StripePayment;
