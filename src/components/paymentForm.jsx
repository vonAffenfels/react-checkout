import React, {Fragment, useContext, useState, useEffect} from "react";
import {loadStripe} from "@stripe/stripe-js";

import CheckoutContext from "../context/CheckoutContext";
import StripePayment from "./payments/stripePayment.jsx";
import ManualPayment from "./payments/manualPayment.jsx";

const PaymentForm = ({}) => {
    const {checkout, selectedPaymentGatewayId} = useContext(CheckoutContext);
    const [selectedPaymentGateway, setSelectedPaymentGateway] = useState(null);
    const [stripePromise, setStripePromise] = useState(null);
    const [component, setComponent] = useState(null);
    console.log("selectedPaymentGatewayId", selectedPaymentGatewayId);
    console.log("selectedPaymentGateway", selectedPaymentGateway);

    useEffect(() => {
        console.log("checkout?.availablePaymentGateways", checkout?.availablePaymentGateways);
        checkout?.availablePaymentGateways?.forEach(paymentGateway => {
            console.log("paymentGateway.id", paymentGateway.id);
            if (paymentGateway.id === selectedPaymentGatewayId) {
                setSelectedPaymentGateway(paymentGateway);
            }
        });
    }, [checkout?.availablePaymentGateways, selectedPaymentGatewayId]);

    useEffect(() => {
        if (selectedPaymentGateway) {
            const name = String(selectedPaymentGateway.name).toLowerCase();
            console.log("NAME:::", name);
            console.log("NAME:::", name);
            console.log("NAME:::", name);
            switch (name) {
                case "stripe":
                    if (!stripePromise) {
                        selectedPaymentGateway.config.forEach(attr => {
                            if (attr.field === "api_key") {
                                setStripePromise(loadStripe(attr.value));
                            }
                        });
                    }
                    break;
                case "manual":
                    const renderOutput = <ManualPayment key="manual-payment" />;
                    console.log("CASE MANUAL", renderOutput);
                    setComponent(renderOutput);
                default:
                    break;
            }
        }
    }, [selectedPaymentGateway]);

    console.log("component", component);

    if (stripePromise) {
        setComponent(<StripePayment key="stripe-payment" stripePromise={stripePromise} />);
    }

    return component;
}

export default PaymentForm;
