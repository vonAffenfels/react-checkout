"use client";

import React, {useContext, useState, useEffect} from "react";
// import {create} from "zustand";
// import {useShallow} from "zustand/react/shallow";

import ReactCheckout from "react-ez-checkout/dist/index.cjs.js";

const ProductInput = ({}) => {
    console.log("create", create);
    console.log("useShallow", useShallow);
    console.log("ReactCheckout", ReactCheckout);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
    }, []);

    const [variantId, setVariantId] = useState("54887811055991");

    const onChange = (e) => {
        setVariantId(e.target.value);
    };

    const onClick = async () => {
        console.log("addItemToCart", variantId);
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
