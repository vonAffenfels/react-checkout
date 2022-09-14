import React, {useContext, useState, useEffect} from "react";

import ReactCheckout from "react-ez-checkout";

const ProductInput = ({}) => {
    const {addItemToCheckout} = useContext(ReactCheckout.API);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
    }, []);

    // const [variantId, setVariantId] = useState("UHJvZHVjdFZhcmlhbnQ6MQ==");
    const [variantId, setVariantId] = useState("43203376447741");

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
        <main>
            <input type="text" value={variantId} onChange={onChange} />
            <input type="button" onClick={onClick} value="Produkt in Warenkorb legen" />
        </main>
    )
};

export default ProductInput;
