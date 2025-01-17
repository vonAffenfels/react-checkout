import React from "react";
import "./styles/styles.scss";

import CheckoutContext from "./context/CheckoutContext";
import BuyContext, {BuyContextProvider} from "./context/BuyContext";
import CONST from "./lib/const";

import useAddProductLine from "./hooks/useAddProductLine.js";
import useCart from "./hooks/useCart.js";
import useCartCreate from "./hooks/useCartCreate.js";
import useDebounce from "./hooks/useDebounce.js";
import useFinishedCart from "./hooks/useFinishedCart.js";
import useLocalStorage from "./hooks/useLocalStorage.js";
import useMultiLogin from "./hooks/useMultiLogin.js";
import useProductById from "./hooks/useProductById.js";
import useProductBySku from "./hooks/useProductBySku.js";
import useUpdateProductLine from "./hooks/useUpdateProductLine.js";

import Cart from "./cart.jsx";
import CheckoutLine from "./components/checkoutLine.jsx";
Cart.CheckoutLine = CheckoutLine;
Cart.CheckoutContext = CheckoutContext;
Cart.BuyContext = BuyContext;
Cart.useLocalStorage = useLocalStorage;
Cart.CHECKOUT_KEY = CONST.CHECKOUT_KEY;
Cart.CART_KEY = CONST.CART_KEY;

const ReactCheckout = ({...props}) => <BuyContextProvider {...props} />;
ReactCheckout.API = CheckoutContext;
ReactCheckout.BuyContext = BuyContext;
ReactCheckout.hooks = {
    useAddProductLine,
    useCart,
    useCartCreate,
    useDebounce,
    useFinishedCart,
    useLocalStorage,
    useMultiLogin,
    useProductById,
    useProductBySku,
    useUpdateProductLine,
};

export default ReactCheckout;
