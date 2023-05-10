import React, {Fragment, useContext, useEffect, useState, useRef} from "react";
import {PaymentElement, Elements, useElements, useStripe} from "@stripe/react-stripe-js";

import CheckoutContext from "../../context/CheckoutContext";
import BuyContext from "../../context/BuyContext";
import {Spin} from "../atoms/animate.jsx";

let GLOBAL_PAYMENT_INTENT_HANDLED_FLAG = false;

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export const StripeSetupForm = ({clientSecret, isStandalone}) => {
    const elements = useElements();
    const stripe = useStripe();
    const [errorMessage, setErrorMessage] = useState("");
    const [setupIntentData, setSetupIntentData] = useState(null);
    const [isActiveConfirmation, setActiveConfirmation] = useState(false);

    const onSubmit = async (e) => {
        console.log("onSubmit");
        // setActiveConfirmation(true);
        // setErrorMessage("");
        e.preventDefault?.();
        e.stopPropagation?.();

        const result = await stripe.confirmSetup({
            elements,
            confirmParams: {
                return_url: window.location.href,
            },
        });

        console.log("confirmSetup", result);
        // setActiveConfirmation(false);
        // if (result?.error?.message) {
        //     setErrorMessage(result.error.message);
        // }
    }

    const isDisabled = !elements || !stripe || isActiveConfirmation;

    return (
        <form id="stripe-payment-form" onSubmit={onSubmit}>
            <PaymentElement id="stripe-payment-element"/>
            {/*{errorMessage ? (*/}
            {/*    <div className="border-t border-gray-200 py-6 text-base font-medium red">{errorMessage}</div>*/}
            {/*) : null}*/}
            <div className="border-t border-gray-200 py-6">
                <button
                    disabled={isDisabled}
                    type="submit"
                    className={
                        classNames(
                            "w-full bg-color-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white",
                            !isDisabled ? "hover:bg-color-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500" : "cursor-not-allowed",
                        )
                    }
                >
                    Speichern
                </button>
            </div>
        </form>
    )
}

export const StripePaymentForm = ({clientSecret, isStandalone}) => {
    const elements = useElements();
    const stripe = useStripe();
    const {successRedirect} = useContext(BuyContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [paymentIntentData, setPaymentIntentData] = useState(null);

    const onSubmit = async (e) => {
        setErrorMessage("");
        e.preventDefault?.();
        e.stopPropagation?.();

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + (successRedirect || ""),
            },
        });

        console.log("confirmPayment", result);
        if (result?.error?.message) {
            setErrorMessage(result.error.message);
        } else {
            GLOBAL_PAYMENT_INTENT_HANDLED_FLAG = false;
        }
    }

    const retrievePaymentIntent = async () => {
        const result = await stripe.retrievePaymentIntent(clientSecret);
        console.log("retrievePaymentIntent", result?.paymentIntent, result?.paymentIntent?.status);
        setPaymentIntentData(result.paymentIntent);
    };

    const formatPrice = amount => {
        return String(amount).substring(0, String(amount).length - 2) + "." + String(amount).substring(String(amount).length - 2);
    }

    useEffect(() => {
        if (!stripe || !clientSecret) {
            return;
        }

        retrievePaymentIntent();
    }, [stripe]);

    const showAsSuccess = paymentIntentData && (paymentIntentData.status === "succeeded" || paymentIntentData.status === "processing");
    const showPaymentForm = !isStandalone || !showAsSuccess;
    const showLoadingAnimation = isStandalone && !paymentIntentData;
    const showSuccessMessage = isStandalone && showAsSuccess;

    if (showLoadingAnimation) {
        return (
            <div className="border-gray-200 py-6 text-base font-medium text-center w-full">
                <Spin className="-ml-1 mr-3" h={6} w={6} style={{margin: "auto"}}/>
            </div>
        );
    }

    if (showSuccessMessage) {
        return (
            <div className="border-gray-200 py-6 text-base font-medium text-center">
                Die Zahlung war erfolgreich.
            </div>
        );
    }

    if (showPaymentForm) {
        return (
            <>
                {isStandalone && (
                    <div className="border-b border-gray-200 mb-6 text-base font-bold dark:text-white">
                        {(paymentIntentData?.description ? paymentIntentData.description + ": " : "")}
                        Zahlung
                        über {formatPrice(paymentIntentData.amount)} {String(paymentIntentData.currency).toUpperCase()} ausstehend
                    </div>
                )}
                <form id="stripe-payment-form" onSubmit={onSubmit}>
                    <PaymentElement id="stripe-payment-element"/>
                    {errorMessage ? (
                        <div className="border-t border-gray-200 py-6 text-base font-medium red">{errorMessage}</div>
                    ) : null}
                    <div className="border-t border-gray-200 py-6">
                        <button
                            disabled={!elements || !stripe}
                            type="submit"
                            className={
                                classNames(
                                    "w-full bg-color-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white",
                                    elements && stripe ? "hover:bg-color-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500" : "cursor-not-allowed",
                                )
                            }
                        >
                            Jetzt bezahlen
                        </button>
                    </div>
                </form>
            </>
        );
    }

    return null;
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
                <StripePaymentForm clientSecret={clientSecret}/>
            </Elements>
        )
    }

    return (
        <Fragment key="stripe-payment-form">{component}</Fragment>
    );
}

export default StripePayment;
