import React, {Fragment} from "react";
import {PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";

const StripePayment = ({}) => {
    const elements = useElements();
    const stripe = useStripe();

    return (
        <PaymentElement />
    );
}

export default StripePayment;
