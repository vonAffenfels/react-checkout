import './App.css';
import ReactCheckout from "react-ez-checkout";
import DebugConfigSaleor from "./debug-config-saleor";
import DebugConfigShopify from "./debug-config-shopify";

import ProductInput from "./components/ProductInput";
import ProductList from "./components/ProductList";

function App() {
    const search = window?.location?.search || "";
    const config = search.indexOf("saleor") !== -1 ? DebugConfigSaleor :
        search.indexOf("shopify") !== -1 ? DebugConfigShopify : {};

    return (
        <ReactCheckout
            {...config}
        >
            <ProductList />
        </ReactCheckout>
    );
}

export default App;
