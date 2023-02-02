import React, {useContext, useState, useEffect} from "react";

import ReactCheckout from "react-ez-checkout/dist/index.cjs.js";

const ProductInput = ({}) => {
    const {addItemToCart} = useContext(ReactCheckout.API);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
    }, []);

    const [variantId, setVariantId] = useState("41207459545220");

    const onChange = (e) => {
        setVariantId(e.target.value);
    };

    const onClick = async () => {
        await addItemToCart(variantId, 1, [
            {
                "key": "bonus_id",
                "value": "KP0000092_1022230"
            },
            {
                "key": "starting_magazine_id",
                "value": "BOO-2023-02"
            },
            {
                "key": "gift_subscription_recipient_address",
                "value": "{\"salutation\":\"mr\",\"firstName\":\"Julian\",\"lastName\":\"Lindner\",\"streetAddress\":\"test\",\"houseNumber\":\"1234\",\"zip\":\"70176\",\"city\":\"Stuttgart\",\"country\":\"Germany\"}"
            }
        ]);
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
