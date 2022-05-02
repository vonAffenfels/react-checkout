import React, {createContext, useState, useContext, useEffect} from "react";
import ApolloContext from "./ApolloContext";
import CheckoutContext from "./CheckoutContext";

export const CartContext = createContext({
    cartItems: []
});

export const CartContextProvider = ({children}) => {
    const {checkout, createCheckout} = useContext(CheckoutContext);
    const [cartItems, setCartItems] = useState([]);

    const addItemToCart = async (variantId) => {
        console.log("addItemToCart", variantId);
        if (!checkout) {
            await createCheckout(variantId);
        } else {
            //TODO addProductToCheckout
        }
    };

    useEffect(() => {
        //TODO setcartitems when updated checkout
    }, [checkout]);

    return (
        <CartContext.Provider value={{
            cartItems,
            setCartItems,
            addItemToCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};

CartContext.CartContextProvider = CartContextProvider;
export default CartContext;
