import React from "react";
import "./styles/styles.scss";

import ApolloContext, {ApolloContextProvider} from "./context/ApolloContext";
import CheckoutContext, {CheckoutContextProvider} from "./context/CheckoutContext";
import BuyContext, {BuyContextProvider} from "./context/BuyContext";
import useLocalStorage from "./hooks/useLocalStorage";
import CONST from "./lib/const";

import Cart from "./cart.jsx";
import CheckoutLine from "./components/checkoutLine.jsx";
Cart.CheckoutLine = CheckoutLine;

import StripePayment from "./components/payments/stripePayment.jsx";
import StandaloneStripePayment from "./components/payments/standaloneStripePayment.jsx";

Cart.ApolloContext = ApolloContext;
Cart.CheckoutContext = CheckoutContext;
Cart.BuyContext = BuyContext;
Cart.useLocalStorage = useLocalStorage;
Cart.CHECKOUT_KEY = CONST.CHECKOUT_KEY;
Cart.CART_KEY = CONST.CART_KEY;

const ReactCheckout = ({...props}) => <BuyContextProvider {...props} />;
ReactCheckout.API = CheckoutContext;
ReactCheckout.BuyContext = BuyContext;
ReactCheckout.StripePayment = StripePayment;
ReactCheckout.StandaloneStripePayment = StandaloneStripePayment;

export default ReactCheckout;
