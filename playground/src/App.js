import logo from './logo.svg';
import './App.css';
import ReactCheckout from "react-ez-checkout";
import DebugConfig from "./debug-config";

function App() {
    return (
        <ReactCheckout
            {...DebugConfig}
        />
    );
}

export default App;
