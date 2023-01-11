import React, {createContext, useState, useEffect, useContext} from "react";
import {useQuery, useApolloClient} from "@apollo/client";

//misc
import useLocalStorage from "../hooks/useLocalStorage";
import useDebounce from "../hooks/useDebounce";

//helpers
import useProductBySku from "../hooks/useProductBySku";
import useProductById from "../hooks/useProductById";
import useProductList from "../hooks/useProductList";

//cart
import useCartCreate from "../hooks/useCartCreate";
import useCart from "../hooks/useCart";

//checkout
import useCheckoutCreate from "../hooks/useCheckoutCreate";
import useAddProductLine from "../hooks/useAddProductLine";
import useDeleteProductLine from "../hooks/useDeleteProductLine";
import useUpdateProductLine from "../hooks/useUpdateProductLine";
import useShippingAddressUpdate from "../hooks/useShippingAddressUpdate";
import useBillingAddressUpdate from "../hooks/useBillingAddressUpdate";
import useEmailUpdate from "../hooks/useEmailUpdate";
import useDeliveryMethodUpdate from "../hooks/useDeliveryMethodUpdate";
import useCheckout from "../hooks/useCheckout";
import useCreateDraftOrder from "../hooks/useCreateDraftOrder";
import useDiscountCodeUpdate from "../hooks/useDiscountCodeUpdate";

import BuyContext from "./BuyContext";
import CONST from "../lib/const";

export const CheckoutContext = createContext({});

export const CheckoutContextProvider = ({children, channel}) => {
    const buyContext = useContext(BuyContext);
    const client = useApolloClient();

    //helpers
    const getProductBySku = useProductBySku(buyContext.shop, client);
    const getProductById = useProductById(buyContext.shop, client);
    const getProductList = useProductList(buyContext.shop, client);

    //cart
    const cartById = useCart(buyContext.shop, client);
    const cartCreate = useCartCreate(buyContext.shop, client);
    const addProductLine = useAddProductLine(buyContext.shop, client, "cart");
    const deleteProductLine = useDeleteProductLine(buyContext.shop, client, "cart");
    const updateProductLine = useUpdateProductLine(buyContext.shop, client, "cart");
    const shippingAddressUpdate = useShippingAddressUpdate(buyContext.shop, client, "cart");
    const billingAddressUpdate = useBillingAddressUpdate(buyContext.shop, client, "cart");
    const deliveryMethodUpdate = useDeliveryMethodUpdate(buyContext.shop, client, "cart");
    const discountCodeUpdate = useDiscountCodeUpdate(buyContext.shop, client, "cart");

    //checkout
    const checkoutByToken = useCheckout(buyContext.shop, client);
    const checkoutCreate = useCheckoutCreate(buyContext.shop, client);
    const addProductLineCheckout = useAddProductLine(buyContext.shop, client, "checkout");
    const deleteProductLineCheckout = useDeleteProductLine(buyContext.shop, client, "checkout");
    const shippingAddressUpdateCheckout = useShippingAddressUpdate(buyContext.shop, client, "checkout");
    const billingAddressUpdateCheckout = useBillingAddressUpdate(buyContext.shop, client, "checkout");
    const emailUpdateCheckout = useEmailUpdate(buyContext.shop, client, "checkout");
    const deliveryMethodUpdateCheckout = useDeliveryMethodUpdate(buyContext.shop, client, "checkout");
    const discountCodeUpdateCheckout = useDiscountCodeUpdate(buyContext.shop, client, "checkout");

    //order
    const createDraftOrder = useCreateDraftOrder(buyContext.shop, client);

    const [checkoutToken, setCheckoutToken, removeCheckoutToken] = useLocalStorage(CONST.CHECKOUT_KEY);
    const [checkout, setCheckout] = useState(null);

    const [cartId, setCartId, removeCartId] = useLocalStorage(CONST.CART_KEY);
    const [cart, _setCart] = useState(null);

    const setCart = (cart) => {
        console.log("setCart called", cart);
        _setCart(cart);
    }

    const [displayState, setDisplayState] = useState("widget");
    const [isCartOpen, setCartOpen] = useState(false);
    const [isLoadingLineItems, setLoadingLineItems] = useState(false);
    const [isLoadingShippingMethods, setLoadingShippingMethods] = useState(false);
    const [isSettingShippingMethod, setSettingShippingMethod] = useState(false);
    const [selectedPaymentGatewayId, setSelectedPaymentGatewayId] = useState(null);
    const [loadingDraftOrder, setLoadingDraftOrder] = useState(false);

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
    const [isBillingAddressDeviating, setBillingAddressDeviating] = useState(false);
    const [billingAddress, setBillingAddress] = useState({
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
    const billingAddressDebounced = useDebounce(billingAddress, 750);

    const createCart = async (lines) => {
        setLoadingLineItems(true);
        try {
            const createdCartId = await cartCreate({channel, lines});
            setCartId(createdCartId);
        } catch (e) {
            console.log("error in createCart");
            console.log(e);
        }
        setLoadingLineItems(false);
    };

    const createCheckout = async ({variants}) => {
        if (!Array.isArray(variants)) {
            variants = [variants];
        }

        try {
            const lineItems = variants.map(variant => ({
                quantity: variant.quantity || 1,
                variantId: "gid://shopify/ProductVariant/" + String(variant.id).replace("gid://shopify/ProductVariant/", "")
            }));
            const checkoutToken = await checkoutCreate({channel, lineItems});
            setCheckoutToken(checkoutToken);
        } catch (e) {
            console.log("error in createCheckout");
            console.log(e);
        }
    };

    const addItemToCart = async (variantId, quantity = 1, attributes) => {
        if (!isCartOpen) {
            setCartOpen(true);
        }

        const lines = [
            {
                quantity: quantity,
                merchandiseId: "gid://shopify/ProductVariant/" + String(variantId).replace("gid://shopify/ProductVariant/", ""),
            }
        ];
        if (attributes?.length) {
            lines[0].attributes = attributes;
        }

        if (!cart) {
            return createCart(lines);
        }

        setLoadingLineItems(true);
        try {
            const cartData = await addProductLine({
                checkoutToken,
                cartId,
                lines: lines,
                totalQuantity: cart.totalQuantity,
            });
            setCart({
                ...(cart || {}),
                ...cartData
            });
        } catch (e) {
            console.log("error in addProductLine", e);
            getCartById();
        }
        setLoadingLineItems(false);
    };

    const updateCartItems = async ({lineId, variantId, quantity, bonusProduct}) => {
        if (!isCartOpen) {
            setCartOpen(true);
        }

        const lines = [
            {
                id: lineId,
                quantity: quantity,
                merchandiseId: "gid://shopify/ProductVariant/" + String(variantId).replace("gid://shopify/ProductVariant/", ""),
            }
        ];
        if (bonusProduct) {
            lines[0].attributes = [{key: "bonus_id", value: bonusProduct.aboSku + "_" + bonusProduct.variantSku}];
        }

        if (!cart) {
            return createCart(lines);
        }

        setLoadingLineItems(true);
        try {
            const cartData = await updateProductLine({
                checkoutToken,
                cartId,
                lines: lines,
                totalQuantity: cart.totalQuantity,
            });
            setCart({
                ...(cart || {}),
                ...cartData
            });
        } catch (e) {
            console.log("error in updateCartItems", e);
            getCartById();
        }
        setLoadingLineItems(false);
    }

    const removeItemFromCart = async (lineId) => {
        if (!cart) {
            return;
        }

        try {
            const cartData = await deleteProductLine({checkoutToken, cartId, lineId, totalQuantity: cart.totalQuantity});
            setCart({
                ...(cart || {}),
                ...cartData
            });
        } catch (e) {
            console.log("error in removeItemFromCart", e);
            getCartById();
        }
    };

    const setCartAddress = async (address) => {
        console.log("setCartAddress", address, !!cart);
        if (!cart || !address?.country) {
            return;
        }

        console.log("shippingAddressUpdate call is blocked..");
        setLoadingShippingMethods(true);
        try {
            const shippingAddressCart = await shippingAddressUpdate({
                checkoutToken,
                cartId,
                address,
                totalQuantity: cart.totalQuantity
            });
            setCart({
                ...(cart || {}),
                ...(shippingAddressCart || {}),
            });
        } catch (e) {
            console.log("catch setCartAddress");
            console.log("setCartAddress", e.toString());
            await getCartById();
        } finally {
            console.log("finally");
        }
        setLoadingShippingMethods(false);
    }

    const setCartDeliveryMethod = async (deliveryMethodId) => {
        if (!cart) {
            return;
        }

        setSettingShippingMethod(true);
        try {
            const cartData = await deliveryMethodUpdate({
                checkoutToken,
                checkout,
                cartId,
                deliveryMethodId,
                cart,
                webhookUri: buyContext.webhookUri,
            });
            setCart({
                ...(cart || {}),
                ...cartData
            });
        } catch (e) {
            console.log("catch setCartDeliveryMethod");
            console.log(e);
            getCartById();
        }
        setSettingShippingMethod(false);
    }

    const applyDiscountCode = async (discountCodes = [""]) => {
        if (!cart) {
            return;
        }

        try {
            const cartData = await discountCodeUpdate({
                cartId,
                discountCodes: discountCodes,
                totalQuantity: cart.totalQuantity,
            });
            setCart({
                ...(cart || {}),
                ...cartData
            });
        } catch (e) {
            console.log("catch applyDiscountCode");
            console.log(e);
        }
    }

    const onBeforePayment = async () => {
        if (!cart || !cart?.lines?.length) {
            return;
        }

        setLoadingDraftOrder(true);
        const lineItems = cart.lines.map(line => ({
            quantity: line.quantity || 1,
            variantId: "gid://shopify/ProductVariant/" + String(line.variant.id).replace("gid://shopify/ProductVariant/", ""),
            customAttributes: line.bonusProduct ? [
                {key: "bonus_id", value: line.bonusProduct.aboSku + "_" + line.bonusProduct.variantSku}
            ] : [],
        }));
        console.log("onBeforePayment, cart:", cart);
        const input = {
            allowPartialAddresses: false,
            lineItems: lineItems,
            email: cart.email,
            buyerIdentity: {
                countryCode: cart.shippingAddress.countryCode || cart.buyerIdentity?.countryCode
            },
        };
        if (cart.requiresShipping) {
            input.shippingAddress = {
                address1: cart.shippingAddress.streetAddress1,
                address2: cart.shippingAddress.streetAddress2,
                city: cart.shippingAddress.city,
                company: cart.shippingAddress.companyName,
                country: cart.shippingAddress.countryCode,
                firstName: cart.shippingAddress.firstName,
                lastName: cart.shippingAddress.lastName,
                province: cart.shippingAddress.countryArea,
                zip: cart.shippingAddress.postalCode
            };
        }
        console.log("checkoutCreate, input:", input);
        let paymentCheckoutToken = await checkoutCreate({channel, input});
        let paymentCheckoutData = await checkoutByToken(paymentCheckoutToken);
        console.log("paymentCheckoutData", paymentCheckoutData);
        if (paymentCheckoutData.requiresShipping) {
            paymentCheckoutData.shippingMethods.forEach(rate => {
                if (rate.name === cart.shippingMethod.name) {
                    paymentCheckoutData.shippingMethod = {
                        price: {
                            amount: rate.price.amount
                        },
                        id: rate.id,
                        name: rate.name
                    };
                }
            });
        }

        if (cart.discountCodes.length) {
            for (let i = 0; cart.discountCodes.length > i; i++) {
                try {
                    await discountCodeUpdateCheckout({
                        checkoutToken: paymentCheckoutToken,
                        discountCode: cart.discountCodes[i].code
                    });
                } catch (e) {
                    console.log("error in discountCodeUpdateCheckout");
                    console.log(e);
                }
            }
        }

        const checkoutData = await createDraftOrder({
            checkoutToken: paymentCheckoutToken,
            checkout: paymentCheckoutData,
            webhookUri: buyContext.webhookUri,
            billingAddress: isBillingAddressDeviating ? {
                ...billingAddress,
                email: addressFormData.email
            } : paymentCheckoutData.shippingAddress,
            selectedPaymentGatewayId: selectedPaymentGatewayId,
        });
        setCheckout({
            ...(checkout || {}),
            ...checkoutData
        });
        setCheckoutToken(paymentCheckoutToken);
        setLoadingDraftOrder(false);
        setDisplayState("payment");
    };

    const getCartById = async () => {
        try {
            console.log("getCartById", cartId);
            if (cartId) {
                let data = await cartById(cartId, cart?.totalQuantity);
                console.log("getCartById, first res", data);
                if (data?.lines?.length && (data.lines.length < data.totalQuantity)) {
                    data = await cartById(cartId, data.totalQuantity);
                    console.log("getCartById, second res", data);
                }
                const availablePaymentGateways = data?.availablePaymentGateways || buyContext.availablePaymentGateways || [];
                console.log("getCartById, selectedPaymentGatewayId", selectedPaymentGatewayId);
                if (selectedPaymentGatewayId) {
                    availablePaymentGateways.forEach(gateway => {
                        if (gateway.id === selectedPaymentGatewayId && gateway?.isDisabled?.(data)) {
                            console.log("getCartById, setting the gateway to null");
                            setSelectedPaymentGatewayId(null);
                        }
                    });
                }
                setCart(data);
            } else {
                setCart(null);
            }
        } catch (e) {
            console.log("catch getCartById");
            console.log(e);
        }
    };

    const getCheckoutByToken = async () => {
        try {
            if (checkoutToken) {
                const data = await checkoutByToken(checkoutToken);
                setCheckout({
                    ...(checkout || {}),
                    ...data
                });
            } else {
                setCheckout(null);
            }
        } catch (e) {
            console.log("error in getCheckoutByToken");
            console.log(e)
        }
    };

    const isAddressDataValid = (addressData) => {
        const {firstName, lastName, streetAddress1, city, country, postalCode} = addressData;
        return firstName && lastName && streetAddress1 && city && country && postalCode;
    }

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

    const reset = () => {
        setSelectedPaymentGatewayId(null);
        setCartId(null);
        setCheckoutToken(null);
        setDisplayState("widget");
    };

    useEffect(() => {
        getCheckoutByToken();
    }, [checkoutToken]);

    useEffect(() => {
        console.log("USE EFFECT WITH CART ID DEPENDENCY");
        getCartById();
    }, [cartId]);

    useEffect(() => {
        if (displayState === "widget") {
            const html = document.querySelector("html");
            if (isCartOpen) {
                html.style["overflow"] = "hidden";
                html.style["padding-right"] = "0px";
            } else {
                html.style["overflow"] = null;
                html.style["padding-right"] = null;
            }
        }
    }, [isCartOpen, displayState]);

    useEffect(() => {
        console.log("useEffect, addressFormDataDebounced");
        let {email, firstName, lastName, streetAddress1, city, country, postalCode, phone, company, state} = addressFormDataDebounced;

        // if (isAddressDataValid(addressFormDataDebounced)) {
            let addressInput = {firstName, lastName, city, country, postalCode, streetAddress1, email};

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
                setCartAddress(addressInput);
            }
        // }
    }, [addressFormDataDebounced]);

    return (
        <CheckoutContext.Provider value={{
            checkout,
            cart,
            createCart,
            createCheckout,
            addItemToCart,
            removeItemFromCart,
            updateCartItems,
            setCartAddress,
            setCartDeliveryMethod,
            onBeforePayment,
            getProductList,
            getProductBySku,
            getProductById,
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
            billingAddress,
            billingAddressDebounced,
            setBillingAddress,
            isBillingAddressDeviating,
            setBillingAddressDeviating,
            loadingDraftOrder,
            removeCartId,
            removeCheckoutToken,
            applyDiscountCode,
            reset
        }}>
            {children}
        </CheckoutContext.Provider>
    );
};

CheckoutContext.CheckoutContextProvider = CheckoutContextProvider;
export default CheckoutContext;
