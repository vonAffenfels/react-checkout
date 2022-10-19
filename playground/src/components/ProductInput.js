import React, {useContext, useState, useEffect} from "react";

import ReactCheckout from "react-ez-checkout";

const ProductInput = ({}) => {
    const {addItemToCheckout} = useContext(ReactCheckout.API);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
    }, []);

    const [variantId, setVariantId] = useState("43494647693565"); //KP0003826

    const onChange = (e) => {
        setVariantId(e.target.value);
    };

    const onClick = async () => {
        await addItemToCheckout(variantId);
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
