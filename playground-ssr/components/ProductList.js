import React, {useContext, useState, useEffect} from "react";

import ReactCheckout from "react-ez-checkout/dist/index.cjs.js";

const ProductList = () => {
    const {getProductList, addItemToCart, getProductBySku, getProductById} = useContext(ReactCheckout.API);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const list = await getProductList?.();
        const product = await getProductBySku?.({sku: "2001194", onlyMatchingVariant: true, isAbo: false});
        const product2 = await getProductBySku?.({sku: "KP0006061", onlyMatchingVariant: true, isAbo: true});
        console.log("product", product);
        console.log("product2", product2);
        const productById = await getProductById?.({id: "gid://shopify/Product/7037652172932"});
        console.log("productById", productById);
        setProducts(list || []);
    };

    const onClick = async (id) => {
        await addItemToCart(id);
    };

    return products.map((product, i) => {
        return (
            <div key={product.id} id={product.id}>
                <div>{product.title}</div>
                {product.variants.nodes.map((variant, j) => {
                    return (
                        <div key={variant.id} id={variant.id}>
                            <div>{variant.title} ({variant.sku}) - {variant.price.amount}€</div>
                            <input type="button" onClick={onClick.bind(this, variant.id)} value="Produkt in Warenkorb legen" />
                        </div>
                    )
                })}
            </div>
        )
    })
};

export default ProductList;
