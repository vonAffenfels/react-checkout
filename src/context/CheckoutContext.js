import React, {createContext, useState, useEffect, useContext} from "react";
import {useQuery, useApolloClient} from "@apollo/client";
import useLocalStorage from "../hooks/useLocalStorage";
import CONST from "../lib/const";
import CHECKOUT_BY_TOKEN from "../queries/checkoutByToken";
import CHECKOUT_CREATE from "../mutations/checkoutCreate";
import CHECKOUT_ADD_PRODUCT_LINE from "../mutations/checkoutAddProductLine";
import VARIANT_BY_SKU from "../queries/variantBySku";

export const CheckoutContext = createContext({});

export const CheckoutContextProvider = ({children, channel}) => {
    const client = useApolloClient();
    const [checkoutToken, setCheckoutToken] = useLocalStorage(CONST.CHECKOUT_KEY);
    const [checkout, setCheckout] = useState(null);

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

    const removeItemFromCheckout = async (variantId) => {
        console.log("removeItemFromCheckout", variantId);
        if (!checkout) {
            return;
        }

        const {data} = await client.mutate({
            mutation: CHECKOUT_ADD_PRODUCT_LINE,
            variables: {
                checkoutToken,
                lines: [
                    {
                        quantity: 0,
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

    const getCheckoutByToken = async () => {
        console.log("getCheckoutByToken", checkoutToken);
        if (checkoutToken) {
            refetch({checkoutToken});
        } else {
            setCheckout(null);
        }
    };

    useEffect(() => {
        getCheckoutByToken();
    }, [checkoutToken, checkout?.lines?.length]);

    useEffect(() => {
        console.log(loading, data, "setCheckout to:", data?.checkout);
        setCheckout(data?.checkout);
    }, [loading, error, data]);

    return (
        <CheckoutContext.Provider value={{
            checkout,
            createCheckout,
            addItemToCheckout,
            removeItemFromCheckout,
        }}>
            {children}
        </CheckoutContext.Provider>
    );
};

CheckoutContext.CheckoutContextProvider = CheckoutContextProvider;
export default CheckoutContext;
