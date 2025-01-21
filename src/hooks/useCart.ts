//shopify
import SHOPIFY_CART from "../queries/cart";

const useCart = (uri: string, apiKey: string) => {
    return async (cartId: string, linesCount: number) => {
        const {data} = await fetch(uri, {
            method: "POST",
            headers: {
                "X-Shopify-Storefront-Access-Token": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: SHOPIFY_CART,
                variables: {cartId, linesCount: (linesCount || 0) + 1}
            }),
        }).then(res => res.json());

        return data.cart;
    };
}

export default useCart;
