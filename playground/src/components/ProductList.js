import React, {useContext, useState, useEffect} from "react";

import ReactCheckout from "react-ez-checkout";

const ProductList = () => {
    const {getProductList, addItemToCart, getProductBySku} = useContext(ReactCheckout.API);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const list = await getProductList?.();
        const product = await getProductBySku?.({sku: "DK-10356", onlyMatchingVariant: true, isAbo: false});
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
