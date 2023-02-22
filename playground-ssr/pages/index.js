import React, {useContext} from "react";
import Head from 'next/head'

import ReactCheckout from "react-ez-checkout/dist/index.cjs.js";

import ProductInput from "../components/ProductInput";
import ProductList from "../components/ProductList";

export default function Home() {
    const shopContext = useContext(ReactCheckout.API);

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
