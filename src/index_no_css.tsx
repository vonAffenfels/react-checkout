import React from "react";
import "./styles/styles.scss";

import CONST from "./lib/const";

import useAddProductLine from "./hooks/useAddProductLine";
import useCart from "./hooks/useCart";
import useCartCreate from "./hooks/useCartCreate";
import useDebounce from "./hooks/useDebounce";
import useFinishedCart from "./hooks/useFinishedCart";
import useLocalStorage from "./hooks/useLocalStorage";
import useMultiLogin from "./hooks/useMultiLogin";
import useProductById from "./hooks/useProductById";
import useProductBySku from "./hooks/useProductBySku";
import useUpdateProductLine from "./hooks/useUpdateCartLine";

import Cart from "./cart.js";
import CheckoutLine from "./components/checkoutLine.js";

export default {
    Cart,
    CheckoutLine,
    CART_KEY: CONST.CART_KEY,
    hooks: {
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
    },
};
