import React, {useContext, useRef, useEffect, useState} from "react";

import CheckoutContext from "../../context/CheckoutContext";
import BuyContext from "../../context/BuyContext";
import {Spin} from "../atoms/animate.jsx";

const PayPalPayment = ({apiUri, apiKey}) => {
    const {checkout, isBillingAddressDeviating, billingAddress, addressFormData, reset} = useContext(CheckoutContext);
    const {setBannerMessage} = useContext(BuyContext);
    const executedRef = useRef(false);
    const [clientToken, setClientToken] = useState(null);
    const [isSDKLoaded, setSDKLoaded] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [name, setName] = useState("");

    const fetchClientToken = async () => {
        try {
            if (clientToken) {
                return;
            }

            const res = await fetch(apiUri, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: "paypal.generate_client_token"
                })
            }).then(res => res.json());

            if (!res || !res?.client_token) {
                return;
            }

            setClientToken(res.client_token);

            let existingScript = document.querySelector("#paypal_sdk");
            if (existingScript) {
                existingScript.remove();
            }
            let script = document.createElement("script");
            script.onload = () => setSDKLoaded(true);
            script.id = "paypal_sdk";
            script.setAttribute("data-client-token", res.client_token);
            script.src = `https://www.paypal.com/sdk/js?components=buttons,hosted-fields,funding-eligibility&client-id=${apiKey}&currency=EUR`;

            document.body.appendChild(script);
        } catch (e) {
            console.log("error while fetching client token for paypal sdk");
            console.log(e);
        }
    };

    const createOrder = (data, actions) => {
        console.log("createOrder", "data", data, "actions", actions);
        return fetch(apiUri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type: "paypal.generate_order",
                checkoutToken: checkout?.token,
            })
        }).then(res => res.json()).then((orderData => {
            console.log("orderData", orderData);
            window.order = orderData;
            return orderData.id;
        }));
    };

    const onApprove = (data, actions) => {
        console.log("onApprove", "data", data, "actions", actions);
        setLoading(true);
        fetch(apiUri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type: "paypal.capture_payment",
                checkoutToken: checkout?.token,
                orderId: data.orderID,
                draftOrderId: checkout?.draftOrder?.id
            })
        }).then(res => res.json()).then((res => {
            console.log("onApprove, payment captured, res:", res);
            setLoading(false);
            setBannerMessage({
                msg: `Bestellung ${res?.order?.name} wurde erfolgreich getätigt.`
            });
            reset();
            return res;
        }));
    };

    const renderPayPalForm = async () => {
        await paypal.Buttons({
            createOrder: createOrder,
            onApprove: onApprove,
            fundingSource: paypal.FUNDING.PAYPAL,
        }).render("#paypal_button_container");
        // await paypal.Buttons({
        //     createOrder: createOrder,
        //     onApprove: onApprove,
        //     fundingSource: paypal.FUNDING.CARD,
        // }).render("#paypal_button_container");

        // if (paypal.HostedFields.isEligible()) {
        //     window.cardFields = await paypal.HostedFields.render({
        //         createOrder: createOrder,
        //         fields: {
        //             number: {
        //                 selector: "#card-number",
        //                 placeholder: "Kartennummer"
        //             },
        //             cvv: {
        //                 selector: "#cvv",
        //                 placeholder: "CVV"
        //             },
        //             expirationDate: {
        //                 selector: "#expiration-date",
        //                 placeholder: "Ablaufdatum MM/YY"
        //             }
        //         }
        //     });
        // }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log("onSubmit", window.cardFields, window.order);
        await window.cardFields.submit({
            cardHolderName: name,
            billingAddress: isBillingAddressDeviating ? {
                streetAddress: billingAddress.streetAddress1,
                extendedAddress: billingAddress.streetAddress2,
                region: billingAddress.state,
                locality: "",
                postalCode: billingAddress.postalCode,
                countryCodeAlpha2: billingAddress.country
            } : {
                streetAddress: addressFormData.streetAddress1,
                extendedAddress: addressFormData.streetAddress2,
                region: addressFormData.state,
                locality: "",
                postalCode: addressFormData.postalCode,
                countryCodeAlpha2: addressFormData.country
            }
        });
        const res = await onApprove({orderID: window.order.id});
        console.log("onApprove res:", res);
    };

    useEffect(() => {
        if (executedRef?.current) {
            return;
        }

        executedRef.current = true;
        fetchClientToken();
    }, []);

    useEffect(() => {
        if (isSDKLoaded && window.paypal?.Buttons) {
            renderPayPalForm();
        }
    }, [isSDKLoaded]);

    return (
        <>
            <div className="mx-auto w-6/12" id="paypal_button_container" />
            <div className="mx-auto w-6/12 space-y-4 sm:items-center" id="paypal_card_container">
                {isSDKLoaded && !isLoading && false && (
                    <>
                        <div className="pt-8 px-4 sm:px-6 inline-grid w-full" style={{gridTemplateColumns: "40% 20% 40%"}}>
                            <div className="col-span-1" style={{gridColumnStart: 1, gridColumnEnd: 2}}>
                                <div className="h-3/6" />
                                <div className="border-t border-gray-200 h-3/6" />
                            </div>
                            <div className="col-span-1 text-center text-color-500" style={{gridColumnStart: 2, gridColumnEnd: 3}}>oder</div>
                            <div className="col-span-1" style={{gridColumnStart: 3, gridColumnEnd: "end"}}>
                                <div className="h-3/6" />
                                <div className="border-t border-gray-200 h-3/6" />
                            </div>
                        </div>
                        <form className="grid" onSubmit={onSubmit}>
                            <div className="col-span-4 py-2">
                                <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                                    Kartennummer
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id="card-number"
                                        name="card-number"
                                        autoComplete="cc-number"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="col-span-4 py-2">
                                <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700">
                                    Name des Karteninhabers
                                </label>
                                <div className="mt-1">
                                    <input
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                        type="text"
                                        id="name-on-card"
                                        name="name-on-card"
                                        autoComplete="cc-name"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="col-span-3 py-2 pr-1">
                                <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                                    Ablaufdatum (MM/YY)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="expiration-date"
                                        id="expiration-date"
                                        autoComplete="cc-exp"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="py-2 pl-1">
                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                                    CVV
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="cvv"
                                        id="cvv"
                                        autoComplete="csv"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="col-span-4 py-6">
                                <button
                                    id="submit"
                                    type="submit"
                                    className={
                                        "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 " +
                                        "w-full bg-color-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white"
                                    }
                                >Bezahlen</button>
                            </div>
                        </form>
                    </>
                )}
            </div>
            {(!isSDKLoaded || isLoading) && (
                <div className="mx-auto w-20 mt-20">
                    <Spin w={10} h={10} />
                </div>
            )}
        </>
    );
}

export default PayPalPayment;
