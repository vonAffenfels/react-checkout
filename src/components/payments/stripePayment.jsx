import React, {Fragment} from "react";
import {PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";

const StripePayment = ({}) => {
    const elements = useElements();
    const stripe = useStripe();

    return (
        <form>
            <PaymentElement />
        </form>
    );
}

export default StripePayment;
