import React, {Fragment, useContext, useState, useEffect} from "react";
import {loadStripe} from "@stripe/stripe-js";

import CheckoutContext from "../context/CheckoutContext";
import StripePayment from "./payments/stripePayment.jsx";
import ManualPayment from "./payments/manualPayment.jsx";
import Success from "./payments/success.jsx";
import BuyContext from "../context/BuyContext";

const PaymentForm = ({}) => {
    const {availablePaymentGateways, paymentProviders} = useContext(BuyContext);
    const {checkout, selectedPaymentGatewayId} = useContext(CheckoutContext);
    const [selectedPaymentGateway, setSelectedPaymentGateway] = useState(null);
    const [stripePromise, setStripePromise] = useState(null);
    const [component, setComponent] = useState(null);

    useEffect(() => {
        paymentProviders?.forEach(paymentGateway => {
            if ((paymentGateway.name === selectedPaymentGatewayId) && (selectedPaymentGateway?.name !== paymentGateway.name)) {
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
                        setStripePromise(loadStripe(selectedPaymentGateway.config.apiKey));
                    }
                    break;
                case "manual":
                    setComponent(<ManualPayment key="manual-payment" />);
                    break;
                case "invoice":
                    setComponent(<Success key="invoice-success" />);
                    break;
                default:
                    break;
            }
        }
    }, [selectedPaymentGateway]);

    if (stripePromise && !component) {
        setComponent(<StripePayment key="stripe-payment" stripePromise={stripePromise} />);
    }

    return component;
}

export default PaymentForm;
