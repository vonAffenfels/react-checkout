import '../styles/globals.css'
import ReactCheckout from "react-ez-checkout/dist/index.cjs.js";
import DebugConfigShopify from "../debug-config-shopify";

function MyApp({Component, pageProps}) {
    return <ReactCheckout {...DebugConfigShopify}><Component {...pageProps} /></ReactCheckout>
}

export default MyApp
