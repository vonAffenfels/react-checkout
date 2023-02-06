import React, {useContext} from "react";
import Head from 'next/head'

import ReactCheckout from "react-ez-checkout/dist/index.cjs.js";

import ProductInput from "../components/ProductInput";
import ProductList from "../components/ProductList";

export default function Home() {
    const shopContext = useContext(ReactCheckout.API);

    if (!shopContext?.addressBook?.length) {
        shopContext?.setAddressBook?.([
            {
                type: "shipping",
                id: "1",
                firstName: "Julian",
                lastName: "Lindner",
                streetAddress1: "Hasenbergstr.",
                houseNumber: "86",
                city: "Stuttgart",
                postalCode: "70174",
                country: "DE"
            },
            {
                type: "shipping",
                id: "2",
                firstName: "Julian",
                lastName: "Lindner",
                streetAddress1: "Hasenbergstr.",
                houseNumber: "86",
                city: "Stuttgart",
                postalCode: "70174",
                country: "DE"
            },
            {
                type: "billing",
                id: "3",
                firstName: "Julian",
                lastName: "Lindner",
                streetAddress1: "Hasenbergstr.",
                houseNumber: "86",
                city: "Stuttgart",
                postalCode: "70174",
                country: "DE"
            }
        ])
    }

    return (
        <div>
            <Head>
                <title>Playground-SSR</title>
            </Head>

            <main>
                <div>
                    <ProductList/>
                    <ProductInput/>
                </div>
            </main>
        </div>
    )
}
