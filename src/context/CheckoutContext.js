import React, {createContext, useState, useEffect, useContext} from "react";
import {useQuery, useApolloClient} from "@apollo/client";

import useLocalStorage from "../hooks/useLocalStorage";
import useDebounce from "../hooks/useDebounce";
import useProductBySku from "../hooks/useProductBySku";
import useProductList from "../hooks/useProductList";
import useCheckoutCreate from "../hooks/useCheckoutCreate";
import useAddBonusProductLine from "../hooks/useAddBonusProductLine";
import useAddProductLine from "../hooks/useAddProductLine";
import useDeleteProductLine from "../hooks/useDeleteProductLine";
import useShippingAddressUpdate from "../hooks/useShippingAddressUpdate";
import useBillingAddressUpdate from "../hooks/useBillingAddressUpdate";
import useEmailUpdate from "../hooks/useEmailUpdate";
import useDeliveryMethodUpdate from "../hooks/useDeliveryMethodUpdate";
import useCheckout from "../hooks/useCheckout";

import BuyContext from "./BuyContext";
import CONST from "../lib/const";

export const CheckoutContext = createContext({});

export const CheckoutContextProvider = ({children, channel}) => {
    const buyContext = useContext(BuyContext);
    const client = useApolloClient();

    const getProductBySku = useProductBySku(buyContext.shop, client);
    const getProductList = useProductList(buyContext.shop, client);
    const checkoutByToken = useCheckout(buyContext.shop, client);
    const checkoutCreate = useCheckoutCreate(buyContext.shop, client);
    const addBonusProductLine = useAddBonusProductLine(buyContext.shop, client);
    const addProductLine = useAddProductLine(buyContext.shop, client);
    const deleteProductLine = useDeleteProductLine(buyContext.shop, client);
    const shippingAddressUpdate = useShippingAddressUpdate(buyContext.shop, client);
    const billingAddressUpdate = useBillingAddressUpdate(buyContext.shop, client);
    const emailUpdate = useEmailUpdate(buyContext.shop, client);
    const deliveryMethodUpdate = useDeliveryMethodUpdate(buyContext.shop, client);

    const [checkoutToken, setCheckoutToken] = useLocalStorage(CONST.CHECKOUT_KEY);
    const [checkout, setCheckout] = useState(null);
    const [displayState, setDisplayState] = useState("widget");
    const [isCartOpen, setCartOpen] = useState(false);
    const [isLoadingLineItems, setLoadingLineItems] = useState(false);
    const [isLoadingShippingMethods, setLoadingShippingMethods] = useState(false);
    const [isSettingShippingMethod, setSettingShippingMethod] = useState(false);
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

    const createCheckout = async (variantId) => {
        setLoadingLineItems(true);
        const checkoutToken = await checkoutCreate({channel, variantId});
        setLoadingLineItems(false);
        setCheckoutToken(checkoutToken);
    };

    const addItemToCheckout = async (variantId, quantity = 1) => {
        console.log("addItemToCheckout", variantId, quantity, checkout)
        if (!isCartOpen) {
            setCartOpen(true);
        }

        if (!checkout) {
            return createCheckout(variantId);
        }

        const lines = [
            {
                quantity: quantity,
                variantId: variantId
            }
        ];

        setLoadingLineItems(true);
        const checkoutData = await addProductLine({
            checkoutToken,
            lines: lines
        });
        console.log("checkoutData", checkoutData)
        setCheckout({
            ...(checkout || {}),
            ...checkoutData
        });
        setLoadingLineItems(false);
    };

    const removeItemFromCheckout = async (lineId) => {
        if (!checkout) {
            return;
        }

        //TODO check if its abo and there is a bonus product to remove
        const checkoutData = await deleteProductLine({checkoutToken, lineId});
        setCheckout({
            ...(checkout || {}),
            ...checkoutData
        });
    };

    const setCheckoutAddress = async (address) => {
        if (!checkout) {
            return;
        }

        //TODO billing address different from shipping address;
        setLoadingShippingMethods(true);
        const [shippingAddressCheckout, billingAddressCheckout] = await Promise.all([
            shippingAddressUpdate({checkoutToken, address}),
            billingAddressUpdate({checkoutToken, address})
        ]);
        console.log("setCheckoutAddress", checkout, shippingAddressCheckout)
        setCheckout({
            ...(checkout || {}),
            ...shippingAddressCheckout
        });
        setLoadingShippingMethods(false);
    }

    const setCheckoutEmail = async (email) => {
        if (!checkout) {
            return;
        }

        const checkoutData = await emailUpdate({checkoutToken, email});
        setCheckout({
            ...(checkout || {}),
            ...checkoutData
        });
    }

    const setCheckoutDeliveryMethod = async (deliveryMethodId) => {
        if (!checkout) {
            return;
        }

        setSettingShippingMethod(true);
        const checkoutData = await deliveryMethodUpdate({
            checkoutToken,
            deliveryMethodId,
            checkout,
            webhookUri: buyContext.webhookUri
        });
        setCheckout({
            ...(checkout || {}),
            ...checkoutData
        });
        setSettingShippingMethod(false);
    }

    const getCheckoutByToken = async () => {
        if (checkoutToken) {
            const data = await checkoutByToken(checkoutToken);
            setCheckout(data);
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
    }, [checkoutToken]);

    useEffect(() => {
        let {email, firstName, lastName, streetAddress1, city, country, postalCode, phone, company, state} = addressFormDataDebounced;

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

            if (isInputAddressDifferentFromCheckoutAddress(addressInput)) {
                setCheckoutAddress(addressInput);
            }
        }
    }, [addressFormDataDebounced]);

    return (
        <CheckoutContext.Provider value={{
            checkout,
            createCheckout,
            addItemToCheckout,
            addBonusProductLine,
            removeItemFromCheckout,
            setCheckoutAddress,
            setCheckoutEmail,
            setCheckoutDeliveryMethod,
            getProductList,
            getProductBySku,
            displayState,
            setDisplayState,
            isCartOpen,
            setCartOpen,
            isLoadingLineItems,
            isLoadingShippingMethods,
            isSettingShippingMethod,
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
