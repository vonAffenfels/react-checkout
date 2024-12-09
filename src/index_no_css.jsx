import React from "react";
import "./styles/styles.scss";

import CheckoutContext, {CheckoutContextProvider} from "./context/CheckoutContext";
import BuyContext, {BuyContextProvider} from "./context/BuyContext";
import useLocalStorage from "./hooks/useLocalStorage";
import CONST from "./lib/const";

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

export default ReactCheckout;
