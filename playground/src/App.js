import './App.css';
import ReactCheckout from "react-ez-checkout";
import DebugConfigSaleor from "./debug-config-saleor";
import DebugConfigShopify from "./debug-config-shopify";

function App() {
    const search = window?.location?.search || "";
    const config = search.indexOf("saleor") !== -1 ? DebugConfigSaleor :
        search.indexOf("shopify") !== -1 ? DebugConfigShopify : {};

    return (
        <ReactCheckout
            {...config}
        />
    );
}

export default App;
