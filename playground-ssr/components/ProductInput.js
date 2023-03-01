import React, {useContext, useState, useEffect} from "react";

import ReactCheckout from "react-ez-checkout/dist/index.cjs.js";

const ProductInput = ({}) => {
    const {addItemToCart} = useContext(ReactCheckout.API);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
    }, []);

    const [variantId, setVariantId] = useState("41314935570564");

    const onChange = (e) => {
        setVariantId(e.target.value);
    };

    const onClick = async () => {
        await addItemToCart(variantId, 1, [
            {
                "key": "bonus_id",
                "value": "KP0005680_YAC-2022-24A"
            },
            {
                "key": "starting_magazine_id",
                "value": "YAC-2023-04"
            },
            {
                "key": "overwrite_product_image_url",
                "value": "https://media.delius-klasing.de/dk-media/dpr_2,f_auto,c_pad,b_white,h_96,w_96/q_auto:eco/PIM/3/e/f/5/3ef5a527bba496eee6237eff71556a4406ba5afc_YAC_2023_04_webshop.jpg"
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
