import React, {Fragment, useContext, useEffect, useState, useRef} from "react";
import {PaymentElement, Elements, useElements, useStripe} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

import CheckoutContext from "../../context/CheckoutContext";
import BuyContext from "../../context/BuyContext";

let GLOBAL_PAYMENT_INTENT_HANDLED_FLAG = false;

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const StripePaymentForm = ({clientSecret}) => {
    const elements = useElements();
    const stripe = useStripe();

    const onSubmit = async (e) => {
        e.preventDefault?.();
        e.stopPropagation?.();

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: window.location.href,
            },
        });

        GLOBAL_PAYMENT_INTENT_HANDLED_FLAG = false;
        console.log("confirmPayment", result);
    }

    const retrievePaymentIntent = async () => {
        const result = await stripe.retrievePaymentIntent(clientSecret);
        console.log("retrievePaymentIntent", result, result?.paymentIntent?.status);
    };

    useEffect(() => {
        if (!stripe || !clientSecret) {
            return;
        }

        retrievePaymentIntent();
    }, [stripe]);

    return (
        <form id="stripe-payment-form" onSubmit={onSubmit}>
            <PaymentElement id="stripe-payment-element" />
            <div className="border-t border-gray-200 py-6">
                <button
                    disabled={!elements || !stripe}
                    type="submit"
                    className={
                        classNames(
                            elements && stripe ? "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500" : "cursor-not-allowed",
                            "w-full bg-color-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white"
                        )
                    }
                >
                    Jetzt bezahlen
                </button>
            </div>
        </form>
    );
};

const StripePayment = ({stripePromise, initialClientSecret = null}) => {
    const executedRef = useRef(false);
    const {paymentProviders} = useContext(BuyContext);
    const {checkout, checkoutToken, selectedPaymentGatewayId} = useContext(CheckoutContext);
    const [clientSecret, setClientSecret] = useState(initialClientSecret);

    let apiUri = "";
    paymentProviders.forEach(provider => {
        if (provider.name === "stripe") {
            apiUri = provider.config.apiUri;
        }
    });

    const createPaymentIntent = async () => {
        try {
            if (GLOBAL_PAYMENT_INTENT_HANDLED_FLAG || clientSecret) {
                return;
            }
            GLOBAL_PAYMENT_INTENT_HANDLED_FLAG = true;

            const paymentIntent = await fetch(apiUri, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: "stripe.create_payment_intent",
                    checkoutToken: checkout?.token,
                    draftOrderId: checkout?.draftOrder?.id,
                    selectedPaymentGatewayId: selectedPaymentGatewayId,
                })
            }).then(res => res.json());
            console.log("paymentIntent", paymentIntent);

            if (!paymentIntent || !paymentIntent.client_secret) {
                return;
            }

            setClientSecret(paymentIntent.client_secret);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (executedRef?.current) {
            return;
        }

        executedRef.current = true;
        createPaymentIntent();

        return () => {
            GLOBAL_PAYMENT_INTENT_HANDLED_FLAG = false;
        };
    }, []);

    let component = null
    if (clientSecret && apiUri) {
        component = (
            <Elements stripe={stripePromise} options={{clientSecret}}>
                <StripePaymentForm clientSecret={clientSecret} />
            </Elements>
        )
    }

    return (
        <Fragment key="stripe-payment-form">{component}</Fragment>
    );
}

export default StripePayment;
