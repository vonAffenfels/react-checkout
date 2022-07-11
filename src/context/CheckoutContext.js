import React, {createContext, useState, useEffect, useContext} from "react";
import {useQuery, useApolloClient} from "@apollo/client";
import useLocalStorage from "../hooks/useLocalStorage";
import useDebounce from "../hooks/useDebounce";
import CONST from "../lib/const";
import CHECKOUT_BY_TOKEN from "../queries/checkoutByToken";
import CHECKOUT_CREATE from "../mutations/checkoutCreate";
import CHECKOUT_ADD_PRODUCT_LINE from "../mutations/checkoutAddProductLine";
import CHECKOUT_DELETE_PRODUCT_LINE from "../mutations/checkoutLineDelete";
import CHECKOUT_SHIPPING_ADDRESS_UPDATE from "../mutations/checkoutShippingAddressUpdate";
import CHECKOUT_BILLING_ADDRESS_UPDATE from "../mutations/checkoutBillingAddressUpdate";
import CHECKOUT_EMAIL_UPDATE from "../mutations/checkoutEmailUpdate";
import CHECKOUT_DELIVERY_METHOD_UPDATE from "../mutations/checkoutDeliveryMethodUpdate";

export const CheckoutContext = createContext({});

export const CheckoutContextProvider = ({children, channel}) => {
    const client = useApolloClient();
    const [checkoutToken, setCheckoutToken] = useLocalStorage(CONST.CHECKOUT_KEY);
    const [checkout, setCheckout] = useState(null);
    const [displayState, setDisplayState] = useState("widget");
    const [isLoading, setIsLoading] = useState(false);
    const [isCartOpen, setCartOpen] = useState(false);
    const [selectedPaymentGatewayId, setSelectedPaymentGatewayId] = useState(null);
    const [addressFormData, setAddressFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        company: "",
        streetAddress1: "",
        streetAddress2: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        phone: ""
    });
    const addressFormDataDebounced = useDebounce(addressFormData, 750);

    const {loading, error, data, refetch} = useQuery(CHECKOUT_BY_TOKEN, {
        variables: {checkoutToken}
    });

    const createCheckout = async (variantId) => {
        const {data} = await client.mutate({
            mutation: CHECKOUT_CREATE,
            variables: {
                email: "anonymous@example.com",
                channel: channel,
                lines: [
                    {
                        quantity: 1,
                        variantId: variantId
                    }
                ]
            }
        });
        console.log("createCheckout, data:", data);
        if (data?.checkoutCreate?.errors?.length) {
            data.checkoutCreate.errors.forEach(err => console.warn(err));
        }

        if (data?.checkoutCreate?.checkout?.token) {
            setCheckoutToken(data.checkoutCreate.checkout.token);
        }
    };

    const addItemToCheckout = async (variantId) => {
        if (!checkout) {
            return createCheckout(variantId);
        }
        console.log("addItemToCheckout", variantId);
        const {data} = await client.mutate({
            mutation: CHECKOUT_ADD_PRODUCT_LINE,
            variables: {
                checkoutToken,
                lines: [
                    {
                        quantity: 1,
                        variantId: variantId
                    }
                ]
            }
        });
        console.log("CHECKOUT_ADD_PRODUCT_LINE, data:", data);
        if (data?.checkoutLinesAdd?.errors?.length) {
            data.checkoutLinesAdd.errors.forEach(err => console.warn(err));
        }

        if (data?.checkoutLinesAdd?.checkout) {
            setCheckout(data.checkoutLinesAdd.checkout);
        }
    };

    const removeItemFromCheckout = async (lineId) => {
        console.log("removeItemFromCheckout", lineId, {
            checkoutToken,
            lineId
        });
        if (!checkout) {
            return;
        }

        const {data} = await client.mutate({
            mutation: CHECKOUT_DELETE_PRODUCT_LINE,
            variables: {
                checkoutToken,
                lineId
            }
        });
        console.log("CHECKOUT_DELETE_PRODUCT_LINE, data:", data);
        if (data?.checkoutLineDelete?.errors?.length) {
            data.checkoutLineDelete.errors.forEach(err => console.warn(err));
        }

        if (data?.checkoutLineDelete?.checkout) {
            setCheckout(data.checkoutLineDelete.checkout);
        }
    };

    const setCheckoutAddress = async (address) => {
        console.log("setCheckoutAddress", {
            checkoutToken,
            address
        });
        if (!checkout) {
            return;
        }

        const [{data}, _] = await Promise.all([
            client.mutate({
                mutation: CHECKOUT_SHIPPING_ADDRESS_UPDATE,
                variables: {
                    checkoutToken,
                    address
                }
            }),
            client.mutate({
                mutation: CHECKOUT_BILLING_ADDRESS_UPDATE,
                variables: {
                    checkoutToken,
                    address
                }
            })
        ]);

        console.log("checkoutShippingAddressUpdate, data:", data);
        if (data?.checkoutShippingAddressUpdate?.errors?.length) {
            data.checkoutShippingAddressUpdate.errors.forEach(err => console.warn(err));
        }

        if (data?.checkoutShippingAddressUpdate?.checkout) {
            setCheckout(data.checkoutShippingAddressUpdate.checkout);
        }
    }

    const setCheckoutEmail = async (email) => {
        console.log("setCheckoutEmail", {
            checkoutToken,
            email
        });
        if (!checkout) {
            return;
        }

        const {data} = await client.mutate({
            mutation: CHECKOUT_EMAIL_UPDATE,
            variables: {
                checkoutToken,
                email
            }
        });
        console.log("checkoutEmailUpdate, data:", data);
        if (data?.checkoutEmailUpdate?.errors?.length) {
            data.checkoutEmailUpdate.errors.forEach(err => console.warn(err));
        }

        if (data?.checkoutEmailUpdate?.checkout) {
            setCheckout(data.checkoutEmailUpdate.checkout);
        }
    }

    const setCheckoutDeliveryMethod = async (deliveryMethodId) => {
        console.log("setCheckoutDeliveryMethod", {
            checkoutToken,
            deliveryMethodId
        });
        if (!checkout) {
            return;
        }

        const {data} = await client.mutate({
            mutation: CHECKOUT_DELIVERY_METHOD_UPDATE,
            variables: {
                checkoutToken,
                deliveryMethodId
            }
        });
        console.log("checkoutDeliveryMethodUpdate, data:", data);
        if (data?.checkoutDeliveryMethodUpdate?.errors?.length) {
            data.checkoutDeliveryMethodUpdate.errors.forEach(err => console.warn(err));
        }

        if (data?.checkoutDeliveryMethodUpdate?.checkout) {
            setCheckout(data.checkoutDeliveryMethodUpdate.checkout);
        }
    }

    const getCheckoutByToken = async () => {
        if (checkoutToken) {
            refetch({checkoutToken});
        } else {
            setCheckout(null);
        }
    };

    const isInputAddressDifferentFromCheckoutAddress = (inputAddress) => {
        let foundDiff = false;
        let checkoutAddress = checkout?.shippingAddress;

        if (!checkoutAddress) {
            return true;
        }

        Object.keys(inputAddress).forEach(key => {
            if (inputAddress[key] !== checkoutAddress[key] && key !== "email") {
                foundDiff = true;
            }
        });
        Object.keys(checkoutAddress).forEach(key => {
            if (inputAddress[key] !== checkoutAddress[key] && key !== "email") {
                foundDiff = true;
            }
        });

        return foundDiff;
    };

    useEffect(() => {
        getCheckoutByToken();
    }, [checkoutToken, checkout?.lines?.length]);

    useEffect(() => {
        let {email, firstName, lastName, streetAddress1, city, country, postalCode, phone, company, state} = addressFormDataDebounced;

        console.log("useEffect addressFormDataDebounced:", addressFormDataDebounced, email, checkout?.email);
        if (email && (email !== checkout?.email)) {
            setCheckoutEmail(email);
        }

        if (firstName && lastName && streetAddress1 && city && country && postalCode) {
            let addressInput = {firstName, lastName, city, country, postalCode, streetAddress1};

            if (phone) {
                addressInput.phone = phone;
            }
            if (company) {
                addressInput.companyName = company;
            }
            if (state) {
                addressInput.countryArea = state;
            }

            console.log("isInputAddressDifferentFromCheckoutAddress(addressInput)", isInputAddressDifferentFromCheckoutAddress(addressInput));
            if (isInputAddressDifferentFromCheckoutAddress(addressInput)) {
                setCheckoutAddress(addressInput);
            }
        }
    }, [addressFormDataDebounced]);

    useEffect(() => {
        console.log("CHECKOUT:", data?.checkout);
        setCheckout(data?.checkout);
    }, [loading, error, data]);

    return (
        <CheckoutContext.Provider value={{
            checkout,
            createCheckout,
            addItemToCheckout,
            removeItemFromCheckout,
            setCheckoutAddress,
            setCheckoutEmail,
            setCheckoutDeliveryMethod,
            displayState,
            setDisplayState,
            isCartOpen,
            setCartOpen,
            isLoading,
            addressFormData,
            setAddressFormData,
            selectedPaymentGatewayId,
            setSelectedPaymentGatewayId,
        }}>
            {children}
        </CheckoutContext.Provider>
    );
};

CheckoutContext.CheckoutContextProvider = CheckoutContextProvider;
export default CheckoutContext;
