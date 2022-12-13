import Head from 'next/head'
import Image from 'next/image'

import ReactCheckout from "react-ez-checkout";

import ProductInput from "../components/ProductInput";
import ProductList from "../components/ProductList";

export default function Home() {
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
