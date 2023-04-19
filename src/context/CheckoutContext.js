import React, {createContext, useState, useEffect, useContext, useRef} from "react";
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
import useFinishedCart from "../hooks/useFinishedCart";
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

//order
import useDraftOrder from "../hooks/useDraftOrder";
import useOrder from "../hooks/useOrder";

//login
import useMultiLogin from "../hooks/useMultiLogin";

import BuyContext from "./BuyContext";
import CONST from "../lib/const";

export const CheckoutContext = createContext({});

export const CheckoutContextProvider = ({children, channel, eftId}) => {
    const buyContext = useContext(BuyContext);
    const client = useApolloClient();
    const channelName = typeof channel === "function" ? channel() : channel;
    const eftIdString = typeof eftId === "function" ? eftId() : eftId;
    const executedRef = useRef(false);

    //helpers
    const getProductBySku = useProductBySku(buyContext.shop, client);
    const getProductById = useProductById(buyContext.shop, client);
    const getProductList = useProductList(buyContext.shop, client);

    //cart
    const cartById = useCart(buyContext.shop, client);
    const finishedCartById = useFinishedCart(buyContext.shop, buyContext.cartUri);
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

    //login
    const [nextDisplayState, setNextDisplayState, removeNextDisplayState] = useLocalStorage(CONST.NEXT_DISPLAY_STATE_KEY);
    const multiLogin = useMultiLogin(buyContext.shop, buyContext.multipassUri);

    //order
    const createDraftOrder = useCreateDraftOrder(buyContext.shop, client, buyContext.webhookUri);
    const draftOrderById = useDraftOrder(buyContext.shop, client, buyContext.webhookUri);
    const orderById = useOrder(buyContext.shop, client);

    const [checkoutToken, setCheckoutToken, removeCheckoutToken] = useLocalStorage(CONST.CHECKOUT_KEY);
    const [checkout, setCheckout] = useState(null);

    const [cartId, setCartId, removeCartId] = useLocalStorage(CONST.CART_KEY);
    const [cart, setCart] = useState(null);

    const [displayState, setDisplayState] = useState("widget");
    const [isCartOpen, setCartOpen] = useState(false);
    const [isLoadingLineItems, setLoadingLineItems] = useState(false);
    const [isLoadingLineItemQuantity, setLoadingLineItemQuantity] = useState(false);
    const [isLoadingShippingMethods, setLoadingShippingMethods] = useState(false);
    const [isSettingShippingMethod, setSettingShippingMethod] = useState(false);
    const defaultPaymentGateway = (buyContext?.availablePaymentGateways || []).find(provider => {
        const isDisabled = typeof provider.isDisabled === "function" ? provider.isDisabled(cart) : false;
        const isHidden = typeof provider.isHidden === "function" ? provider.isHidden(cart) : false;
        return provider.isDefault && !isDisabled && !isHidden;
    });
    const [selectedPaymentGatewayId, setSelectedPaymentGatewayId] = useState(defaultPaymentGateway?.id);
    const [loadingDraftOrder, setLoadingDraftOrder] = useState(false);

    const [email, setEmail] = useState("");
    const [hideEmailInput, setHideEmailInput] = useState(false);
    const [addressBook, setAddressBook] = useState([]);
    const [selectedShippingAddressId, setSelectedShippingAddressId] = useState("");
    const [selectedBillingAddressId, setSelectedBillingAddressId] = useState("");

    const [addressFormData, setAddressFormData] = useState({
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

    const isShopifyCheckout = buyContext.multipassUri && (globalThis?.window?.location?.search?.indexOf?.("legacy-checkout") === -1);

    const createCart = async ({lines, openCheckoutPage}) => {
        setLoadingLineItems(true);
        try {
            const redirectToMultipass = openCheckoutPage && isShopifyCheckout;
            const {id, webUrl} = await cartCreate({channel, lines, redirectToMultipass});
            setCartId(id);
            if (redirectToMultipass) {
                const {token, url} = await multipass({webUrl, overwriteToken: id});
                window.location.href = url;
            }
        } catch (e) {
            console.log("error in createCart");
            console.log(e);
        }
        setLoadingLineItems(false);
    };

    const createCheckout = async ({lines, openCheckoutPage}) => {
        try {
            const redirectToMultipass = openCheckoutPage && isShopifyCheckout;
            const {checkoutToken, webUrl} = await checkoutCreate({channel, lineItems: lines});
            setCheckoutToken(checkoutToken);
            if (redirectToMultipass) {
                const {token, url} = await multipass({webUrl, overwriteToken: checkoutToken});
                window.location.href = url;
            }
        } catch (e) {
            console.log("error in createCheckout");
            console.log(e);
        }
    };

    const addItemToCart = async ({product, variantId, quantity = 1, attributes, openCheckoutPage = false}) => {
        if (openCheckoutPage && !isShopifyCheckout) {
            setDisplayState("cartFullPage");
        }
        if (!isCartOpen && !openCheckoutPage) {
            setCartOpen(true);
        }

        const lines = [];
        if (product) {
            const line = {
                quantity: quantity,
                merchandiseId: product.variants?.nodes?.[0]?.id,
            };
            if (product.sellingPlanGroups?.nodes?.[0]?.sellingPlans?.nodes?.[0]?.id) {
                line.sellingPlanId = product.sellingPlanGroups.nodes[0].sellingPlans.nodes[0].id;
            }
            lines.push(line);
        } else {
            lines.push({
                quantity: quantity,
                merchandiseId: "gid://shopify/ProductVariant/" + String(variantId).replace("gid://shopify/ProductVariant/", ""),
            });
        }

        if (attributes?.length) {
            lines[0].attributes = attributes;
        }

        if (!cart) {
            return createCart({lines, openCheckoutPage});
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
            if (openCheckoutPage && isShopifyCheckout) {
                const {token, url} = await multipass({});
                console.log("token", token);
                console.log("url", url);
                //window.open(url);
                window.location.href = url;
            }
        } catch (e) {
            console.log("error in addProductLine", e);
            await getCartById();
        }
        setLoadingLineItems(false);
    };

    const addItemToCheckout = async ({product, variantId, quantity = 1, attributes, openCheckoutPage = false}) => {
        if (openCheckoutPage && !isShopifyCheckout) {
            setDisplayState("cartFullPage");
        }
        if (!isCartOpen && !openCheckoutPage) {
            setCartOpen(true);
        }

        const lines = [];
        if (product) {
            const line = {
                quantity: quantity,
                merchandiseId: product.variants?.nodes?.[0]?.id,
            };
            if (product.sellingPlanGroups?.nodes?.[0]?.sellingPlans?.nodes?.[0]?.id) {
                line.sellingPlanId = product.sellingPlanGroups.nodes[0].sellingPlans.nodes[0].id;
            }
            lines.push(line);
        } else {
            lines.push({
                quantity: quantity,
                merchandiseId: "gid://shopify/ProductVariant/" + String(variantId).replace("gid://shopify/ProductVariant/", ""),
            });
        }

        if (attributes?.length) {
            lines[0].attributes = attributes;
        }

        if (!checkout) {
            return createCheckout({lines, openCheckoutPage});
        }

        setLoadingLineItems(true);
        try {
            const checkoutData = await addProductLineCheckout({
                checkoutToken,
                lines: lines,
                totalQuantity: cart.totalQuantity,
            });
            setCheckout({
                ...(checkout || {}),
                ...checkoutData
            });
            if (openCheckoutPage && isShopifyCheckout) {
                const {token, url} = await multipass({});
                window.location.href = url;
            }
        } catch (e) {
            await getCheckoutByToken();
        }
        setLoadingLineItems(false);
    };

    const updateCartItems = async ({lineId, variantId, quantity, attributes, bonusProduct}) => {
        if (!isCartOpen) {
            setCartOpen(true);
        }

        const lines = [
            {
                id: lineId,
                quantity: quantity,
                merchandiseId: "gid://shopify/ProductVariant/" + String(variantId).replace("gid://shopify/ProductVariant/", ""),
                // sellingPlanId: null
            }
        ];
        if (attributes?.length) {
            lines[0].attributes = attributes;
        } else if (bonusProduct) {
            lines[0].attributes = [{key: "bonus_id", value: bonusProduct.aboSku + "_" + bonusProduct.variantSku}];
        }

        if (!cart) {
            return createCart(lines);
        }

        setLoadingLineItemQuantity(true);
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
            await getCartById();
        }
        setLoadingLineItemQuantity(false);
    }

    const updateCheckoutItems = async ({lineId, variantId, quantity, attributes, bonusProduct}) => {

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
            await getCartById();
        }
    };

    const removeItemFromCheckout = async (lineId) => {

    };

    const setCartAddress = async (address) => {
        if (buyContext.cartType === "checkout") {
            return setCheckoutAddress(address);
        }

        if (!cart || !address?.country) {
            return;
        }

        setLoadingShippingMethods(true);
        try {
            console.log("setCartAddress", address)
            const shippingAddressCart = await shippingAddressUpdate({
                checkoutToken,
                cartId,
                address,
                email,
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
        }
        setLoadingShippingMethods(false);
    };

    const setCheckoutAddress = async (address) => {

    };

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
            await getCartById();
        }
        setSettingShippingMethod(false);
    };

    const setCheckoutDeliveryMethod = async (deliveryMethodId) => {

    };

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
            await getCartById();
            console.log(e);
        }
    }

    const onBeforePayment = async () => {
        console.log("onBeforePayment", cart);
        if (!cart || !cart?.lines?.length) {
            return;
        }

        setLoadingDraftOrder(true);
        const lineItems = cart.lines.map(line => ({
            quantity: line.quantity || 1,
            variantId: "gid://shopify/ProductVariant/" + String(line.variant.id).replace("gid://shopify/ProductVariant/", ""),
            attributes: line.attributes,
        }));
        console.log("lineItems", lineItems);
        const input = {
            allowPartialAddresses: false,
            lineItems: lineItems,
            email: cart.email,
            buyerIdentity: {
                countryCode: cart.shippingAddress.countryCode || cart.buyerIdentity?.countryCode
            },
        };
        console.log("input", input);

        const foundAddress = getCurrentAddress([cart.shippingAddress, addressFormData, billingAddress]);
        console.log("foundAddress", foundAddress, "selectedShippingAddressId", selectedShippingAddressId);
        input.shippingAddress = {
            address1: foundAddress.streetAddress1,
            address2: foundAddress.streetAddress2,
            city: foundAddress.city,
            company: foundAddress.companyName,
            country: foundAddress.countryCode || foundAddress.country,
            firstName: foundAddress.firstName,
            lastName: foundAddress.lastName,
            province: foundAddress.countryArea,
            zip: foundAddress.postalCode
        };

        let paymentCheckoutToken = await checkoutCreate({channel, input});
        let paymentCheckoutData = await checkoutByToken(paymentCheckoutToken);
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

        const draftOrderInput = {
            checkoutToken: paymentCheckoutToken,
            checkout: paymentCheckoutData,
            webhookUri: buyContext.webhookUri,
            billingAddress: isBillingAddressDeviating ? {
                ...billingAddress,
                email: addressFormData.email
            } : paymentCheckoutData.shippingAddress,
            selectedPaymentGatewayId: selectedPaymentGatewayId,
            attributes: [
                {
                    key: "channel",
                    value: channelName
                }
            ]
        };
        if (selectedShippingAddressId) {
            draftOrderInput.attributes.push({
                key: "shipping_address_id",
                value: selectedShippingAddressId,
            });
        }
        if (selectedBillingAddressId) {
            draftOrderInput.attributes.push({
                key: "billing_address_id",
                value: selectedBillingAddressId,
            });
        }
        console.log("draftOrderInput.attributes", draftOrderInput.attributes);

        const checkoutData = await createDraftOrder(draftOrderInput);
        setCheckout({
            ...(checkout || {}),
            ...checkoutData
        });
        document.cookie = CONST.DRAFT_ORDER_ID_COOKIE_NAME + "=" + checkoutData?.draftOrder?.id + ";max-age-in-seconds=" + 60*60*24*7 + ";path=/;SameSite=strict";
        setCheckoutToken(paymentCheckoutToken);

        setLoadingDraftOrder(false);
        setDisplayState("payment");
    };

    const getCurrentAddress = (addresses = []) => {
        console.log("getCurrentAddress", addresses);
        for (let i = 0; i < addresses.length; i++) {
            const isValid = isValidAddress(addresses[i]);
            if (isValid) {
                return addresses[i];
            }
        }
    }

    const isValidAddress = (address) => {
        const {
            firstName,
            lastName,
            streetAddress1,
            city,
            country,
            postalCode,
        } = address;
        return firstName && lastName && streetAddress1 && city && country && postalCode;
    };

    const getCartById = async () => {
        try {
            if (cartId) {
                let data = await cartById(cartId, cart?.totalQuantity);
                if (data?.lines?.length && (data.lines.length < data.totalQuantity)) {
                    data = await cartById(cartId, data.totalQuantity);
                }
                const availablePaymentGateways = data?.availablePaymentGateways || buyContext.availablePaymentGateways || [];
                if (selectedPaymentGatewayId) {
                    availablePaymentGateways.forEach(gateway => {
                        if (gateway.id === selectedPaymentGatewayId && gateway?.isDisabled?.(data)) {
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

    const onSelectAddressBookEntry = async (addressId) => {
        console.log("onSelectAddressBookEntry", addressId);
        if (addressBook?.length) {
            const updateAddress = addressBook.find(address => address.id === addressId);
            if (updateAddress) {
                console.log("updateAddress", updateAddress);
                await setCartAddress({
                    company: updateAddress.company,
                    firstName: updateAddress.firstName,
                    lastName: updateAddress.lastName,
                    streetAddress1: updateAddress.streetAddress1 + " " + updateAddress.houseNumber,
                    city: updateAddress.city,
                    country: updateAddress.country,
                    postalCode: updateAddress.postalCode,
                });
                setAddressFormData({
                    company: updateAddress.company,
                    firstName: updateAddress.firstName,
                    lastName: updateAddress.lastName,
                    streetAddress1: updateAddress.streetAddress1 + " " + updateAddress.houseNumber,
                    city: updateAddress.city,
                    country: updateAddress.country,
                    postalCode: updateAddress.postalCode,
                });
                console.log("onSelectAddressBookEntry, after, now set to:", addressId);
                setSelectedShippingAddressId(addressId);
            }
        }
    };

    const onSelectBillingAddressBookEntry = (addressId) => {
        if (addressBook?.length) {
            const updateAddress = addressBook.find(address => address.id === addressId);
            if (updateAddress) {
                setBillingAddress({
                    company: updateAddress.company,
                    firstName: updateAddress.firstName,
                    lastName: updateAddress.lastName,
                    streetAddress1: updateAddress.streetAddress1 + " " + updateAddress.houseNumber,
                    city: updateAddress.city,
                    country: updateAddress.country,
                    postalCode: updateAddress.postalCode,
                });
                setSelectedBillingAddressId(addressId);
            }
        }
    };

    const reset = () => {
        setSelectedPaymentGatewayId(null);
        setCartId(null);
        setCheckoutToken(null);
        setDisplayState("widget");
    };

    useEffect(() => {
        if (email !== cart?.email) {
            setCartAddress(cart?.shippingAddress);
        }

        if (email && nextDisplayState) {
            setDisplayState(nextDisplayState);
            removeNextDisplayState();
        }

    }, [email]);

    useEffect(() => {
        getCheckoutByToken();
    }, [checkoutToken]);

    useEffect(() => {
        if (cartId) {
            finishedCartById({cartToken: cartId}).then(cart => {
                console.log("finishedCart", cart);
                if (!cart) {
                    getCartById();
                } else {
                    removeCartId();
                }
            });
        }
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
        let {firstName, lastName, streetAddress1, city, country, postalCode, phone, company, state} = addressFormDataDebounced;

        let addressInput = {firstName, lastName, city, country, postalCode, streetAddress1, email};

        if (phone) {
            addressInput.phone = phone;
        }
        if (company) {
            addressInput.company = company;
        }
        if (state) {
            addressInput.countryArea = state;
        }

        setCartAddress(addressInput);
    }, [addressFormDataDebounced, email]);

    const multipass = async ({webUrl, overwriteEmail, overwriteToken}) => {
        const params = new URLSearchParams({
            eftid: eftIdString,
            channel: channelName,
            cart: (overwriteToken || cart.token).replace("gid://shopify/Cart/", "").trim(),
        });
        const returnUrl = String(webUrl || cart.webUrl) + "?" + params.toString();
        const cartEmail = overwriteEmail || email;

        if (!cartEmail) {
            return {
                url: returnUrl
            }
        }

        return await multiLogin({body: {email: cartEmail, return_to: returnUrl}});
    };

    return (
        <CheckoutContext.Provider value={{
            checkout,
            cart,
            checkoutByToken,
            createCart,
            createCheckout,
            addItemToCart: buyContext.cartType === "checkout" ? addItemToCheckout : addItemToCart,
            removeItemFromCart: buyContext.cartType === "checkout" ? removeItemFromCheckout : removeItemFromCart,
            updateCartItems: buyContext.cartType === "checkout" ? updateCheckoutItems : updateCartItems,
            setCartAddress: buyContext.cartType === "checkout" ? setCheckoutAddress : setCartAddress,
            setCartDeliveryMethod: buyContext.cartType === "checkout" ? setCheckoutDeliveryMethod : setCartDeliveryMethod,
            onBeforePayment,
            getProductList,
            getProductBySku,
            getProductById,
            displayState,
            setDisplayState,
            isCartOpen,
            setCartOpen,
            isLoadingLineItems,
            isLoadingLineItemQuantity,
            isLoadingShippingMethods,
            isSettingShippingMethod,
            addressFormData,
            setAddressFormData,
            email,
            setEmail,
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
            reset,
            hideEmailInput,
            setHideEmailInput,
            addressBook,
            setAddressBook,
            onSelectAddressBookEntry,
            onSelectBillingAddressBookEntry,
            selectedShippingAddressId,
            setSelectedShippingAddressId,
            selectedBillingAddressId,
            setSelectedBillingAddressId,
            nextDisplayState,
            setNextDisplayState,
            removeNextDisplayState,
            draftOrderById,
            orderById,
            multipass,
        }}>
            {children}
        </CheckoutContext.Provider>
    );
};

CheckoutContext.CheckoutContextProvider = CheckoutContextProvider;
export default CheckoutContext;
