import React, {useContext, useState, useEffect} from "react";

import ReactCheckout from "react-ez-checkout";

const ProductInput = ({}) => {
    const {addItemToCart} = useContext(ReactCheckout.API);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
    }, []);

    const [variantId, setVariantId] = useState("41229846839428");

    const onChange = (e) => {
        setVariantId(e.target.value);
    };

    const onClick = async () => {
        await addItemToCart(variantId, 1, [{key: "bonus_id", value: "KP0000023_A000000524"}]);
    };

    if (!ready) {
        return null;
    }

    return (
        <main style={{marginTop: "25px", marginLeft: "25px", color: "blue"}}>
            <input type="text" value={variantId} onChange={onChange} />
            <input type="button" onClick={onClick} value="Produkt in Warenkorb legen" />
        </main>
    )
};

export default ProductInput;
