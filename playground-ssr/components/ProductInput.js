import React, {useContext, useState, useEffect} from "react";

import ReactCheckout from "react-ez-checkout/dist/index.cjs.js";

const ProductInput = ({}) => {
    const {addItemToCart} = useContext(ReactCheckout.API);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
    }, []);

    const [variantId, setVariantId] = useState("41314935734404");

    const onChange = (e) => {
        setVariantId(e.target.value);
    };

    const onClick = async () => {
        await addItemToCart(variantId, 1, [
            {
                "key": "bonus_id",
                "value": "KP0005680_1022230"
            },
            {
                "key": "starting_magazine_id",
                "value": "YAC-2023-05"
            }
        ], false);
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
