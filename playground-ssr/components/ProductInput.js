import React, {useContext, useState, useEffect} from "react";

import ReactCheckout from "react-ez-checkout/dist/index.cjs.js";

const ProductInput = ({}) => {
    const {addItemToCart} = useContext(ReactCheckout.API);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
    }, []);

    const [variantId, setVariantId] = useState("41300575387780");

    const onChange = (e) => {
        setVariantId(e.target.value);
    };

    const onClick = async () => {
        await addItemToCart({
            variantId: "41300575387780",
            quantity: 1,
            attributes: [{key: "starting_magazine_id", value: "83"}],
            openCheckoutPage: false,
        });
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
