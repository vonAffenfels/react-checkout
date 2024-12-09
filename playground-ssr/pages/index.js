import React from "react";
import Head from 'next/head'

import ProductInput from "../components/ProductInput";

export default function Home() {
    return (
        <div>
            <Head>
                <title>Playground-SSR</title>
            </Head>

            <main>
                <div>
                    <ProductInput/>
                </div>
            </main>
        </div>
    )
}
