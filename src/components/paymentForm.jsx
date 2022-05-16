import React, {Fragment, useContext, useState, useEffect} from "react";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

import CheckoutContext from "../context/CheckoutContext";
import StripePayment from "./payments/stripePayment.jsx";

const PaymentForm = ({}) => {
    const {checkout, selectedPaymentGatewayId, finalizeCheckout} = useContext(CheckoutContext);
    const [selectedPaymentGateway, setSelectedPaymentGateway] = useState(null);
    const [stripePromise, setStripePromise] = useState(null);
    const [stripeApiKey, setStripeApiKey] = useState(null);

    //TODO call after payment?
    //finalizeCheckout();

    useEffect(() => {
        checkout?.availablePaymentGateways?.forEach(paymentGateway => {
            if (paymentGateway.id === selectedPaymentGatewayId) {
                setSelectedPaymentGateway(paymentGateway);
            }
        });
    }, [checkout?.availablePaymentGateways, selectedPaymentGatewayId]);

    useEffect(() => {
        if (selectedPaymentGateway) {
            const name = String(selectedPaymentGateway.name).toLowerCase();
            switch (name) {
                case "stripe":
                    if (!stripePromise) {
                        selectedPaymentGateway.config.forEach(attr => {
                            if (attr.field === "api_key") {
                                setStripeApiKey(attr.value);
                                setStripePromise(loadStripe(attr.value));
                            }
                        });
                    }
                    break;
                default:
                    break;
            }
        }
    }, [selectedPaymentGateway]);

    let component = null;

    if (stripePromise) {
        component = (
            <Elements stripe={stripePromise}><StripePayment apiKey={stripeApiKey} /></Elements>
        );
    }

    return component;
}

export default PaymentForm;
