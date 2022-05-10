import React, {Fragment, useContext} from "react";
import CheckoutContext from "./context/CheckoutContext";

const CartFullPage = ({props}) => {
    const {
        checkout,
        setDisplayState
    } = useContext(CheckoutContext);

    return (
        <Fragment>
            <div className="bg-opacity-50 flex justify-center items-center absolute top-0 right-0">
                <div className="bg-white px-16 py-14 rounded-md text-center">
                    <button
                        className="bg-indigo-500 px-4 py-2 rounded-md text-md text-white"
                        onClick={() => setDisplayState("widget")}
                    >
                        X
                    </button>
                </div>
            </div>
        </Fragment>
    );
}

export default CartFullPage;
