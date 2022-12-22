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
import useShippingAddressUpdate from "../hooks/useShippingAddressUpdate";
import useBillingAddressUpdate from "../hooks/useBillingAddressUpdate";
import useEmailUpdate from "../hooks/useEmailUpdate";
import useDeliveryMethodUpdate from "../hooks/useDeliveryMethodUpdate";
import useCheckout from "../hooks/useCheckout";
import useCreateDraftOrder from "../hooks/useCreateDraftOrder";

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
    const shippingAddressUpdate = useShippingAddressUpdate(buyContext.shop, client, "cart");
    const billingAddressUpdate = useBillingAddressUpdate(buyContext.shop, client, "cart");
    const deliveryMethodUpdate = useDeliveryMethodUpdate(buyContext.shop, client, "cart");

    //checkout
    const checkoutByToken = useCheckout(buyContext.shop, client);
    const checkoutCreate = useCheckoutCreate(buyContext.shop, client);
    const addProductLineCheckout = useAddProductLine(buyContext.shop, client, "checkout");
    const deleteProductLineCheckout = useDeleteProductLine(buyContext.shop, client, "checkout");
    const shippingAddressUpdateCheckout = useShippingAddressUpdate(buyContext.shop, client, "checkout");
    const billingAddressUpdateCheckout = useBillingAddressUpdate(buyContext.shop, client, "checkout");
    const emailUpdateCheckout = useEmailUpdate(buyContext.shop, client, "checkout");
    const deliveryMethodUpdateCheckout = useDeliveryMethodUpdate(buyContext.shop, client, "checkout");

    //order
    const createDraftOrder = useCreateDraftOrder(buyContext.shop, client);

    const [checkoutToken, setCheckoutToken] = useLocalStorage(CONST.CHECKOUT_KEY);
    const [checkout, setCheckout] = useState(null);

    const [cartId, setCartId] = useLocalStorage(CONST.CART_KEY);
    const [cart, setCart] = useState(null);

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

    const createCart = async (variantId) => {
        setLoadingLineItems(true);
        const createdCartId = await cartCreate({channel, variantId});
        setLoadingLineItems(false);
        setCartId(createdCartId);
    };

    const createCheckout = async ({variants}) => {
        if (!Array.isArray(variants)) {
            variants = [variants];
        }

        const lineItems = variants.map(variant => ({
            quantity: variant.quantity || 1,
            variantId: "gid://shopify/ProductVariant/" + String(variant.id).replace("gid://shopify/ProductVariant/", "")
        }));
        const checkoutToken = await checkoutCreate({channel, lineItems});
        setCheckoutToken(checkoutToken);
    };

    const addItemToCart = async (variantId, quantity = 1, attributes) => {
        if (!isCartOpen) {
            setCartOpen(true);
        }

        if (!cart) {
            return createCart(variantId);
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
            console.log("error in addItemToCart", e);
            getCartById();
        }
        setLoadingLineItems(false);
    };

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
        if (!cart) {
            return;
        }

        setLoadingShippingMethods(true);
        try {
            //TODO billing and shipping different
            const [shippingAddressCart, billingAddressCheckout] = await Promise.all([
                shippingAddressUpdate({checkoutToken, cartId, address, totalQuantity: cart.totalQuantity}),
                billingAddressUpdate({checkoutToken, cartId, address, totalQuantity: cart.totalQuantity})
            ]);
            setCart({
                ...(cart || {}),
                ...(shippingAddressCart || {}),
            });
        } catch (e) {
            console.log("catch setCartAddress");
            console.log(e);
            getCartById();
        }
        setLoadingShippingMethods(false);
    }

    const setCartDeliveryMethod = async (deliveryMethodId) => {
        if (!cart) {
            return;
        }

        setSettingShippingMethod(true);
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
        setSettingShippingMethod(false);
    }

    const onBeforePayment = async () => {
        console.log("onBeforePayment", cart);
        if (!cart || !cart?.lines?.length) {
            return;
        }

        setLoadingDraftOrder(true);
        let paymentCheckoutToken = checkout?.token;
        let paymentCheckoutData = JSON.parse(JSON.stringify(checkout));

        if (!paymentCheckoutToken) {
            //TODO before creating the draftOrder, now create the checkout or maybe on server api?
            //TODO if on server side, you have to send all the data...
            const lineItems = cart.lines.map(line => ({
                quantity: line.quantity || 1,
                variantId: "gid://shopify/ProductVariant/" + String(line.variant.id).replace("gid://shopify/ProductVariant/", ""),
                customAttributes: line.bonusProduct ? [
                    {key: "bonus_id", value: line.bonusProduct.aboSku + "_" + line.bonusProduct.variantSku}
                ] : [],
            }));
            const input = {
                allowPartialAddresses: false,
                lineItems: lineItems,
                email: cart.email,
                buyerIdentity: {
                    countryCode: cart.shippingAddress.countryCode
                },
                shippingAddress: {
                    address1: cart.shippingAddress.streetAddress1,
                    address2: cart.shippingAddress.streetAddress2,
                    city: cart.shippingAddress.city,
                    company: cart.shippingAddress.companyName,
                    country: cart.shippingAddress.countryCode,
                    firstName: cart.shippingAddress.firstName,
                    lastName: cart.shippingAddress.lastName,
                    province: cart.shippingAddress.countryArea,
                    zip: cart.shippingAddress.postalCode
                },
            };
            console.log("checkoutCreate, input:", input);
            paymentCheckoutToken = await checkoutCreate({channel, input});
            paymentCheckoutData = await checkoutByToken(paymentCheckoutToken);
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
        }

        const checkoutData = await createDraftOrder({
            checkoutToken: paymentCheckoutToken,
            checkout: paymentCheckoutData,
            webhookUri: buyContext.webhookUri
        });
        setCheckout({
            ...(checkout || {}),
            ...checkoutData
        });
        setCheckoutToken(paymentCheckoutToken);
        setLoadingDraftOrder(false);
    };

    const getCartById = async () => {
        if (cartId) {
            let data = await cartById(cartId, cart?.totalQuantity);
            if (data.lines?.length && (data.lines.length < data.totalQuantity)) {
                data = await cartById(cartId, data.totalQuantity);
            }
            setCart(data);
        } else {
            setCart(null);
        }
    };

    const getCheckoutByToken = async () => {
        if (checkoutToken) {
            const data = await checkoutByToken(checkoutToken);
            setCheckout({
                ...(checkout || {}),
                ...data
            });
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
        if (checkoutToken && checkout) {
            getCheckoutByToken();
        }
    }, [checkoutToken]);

    useEffect(() => {
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
        let {email, firstName, lastName, streetAddress1, city, country, postalCode, phone, company, state} = addressFormDataDebounced;

        if (firstName && lastName && streetAddress1 && city && country && postalCode) {
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
        }
    }, [addressFormDataDebounced]);

    return (
        <CheckoutContext.Provider value={{
            checkout,
            cart,
            createCart,
            createCheckout,
            addItemToCart,
            removeItemFromCart,
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
            loadingDraftOrder,
            setLoadingDraftOrder,
        }}>
            {children}
        </CheckoutContext.Provider>
    );
};

CheckoutContext.CheckoutContextProvider = CheckoutContextProvider;
export default CheckoutContext;
