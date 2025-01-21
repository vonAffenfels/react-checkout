//shopify
import SHOPIFY_CART_ADD_PRODUCT_LINE from "../mutations/cartAddProductLine";
import checkQuantityMissing from "../lib/checkQuantityMissing";

export type CreateCartLineParams = {
    cartId: string;
    lines: Array<CartLineCreateInput>;
    linesCount: number;
};

const useAddProductLine = (uri: string, apiKey: string) => {
    return async ({cartId, lines, linesCount}: CreateCartLineParams) => {
        const updatedVariantId = lines?.[0]?.merchandiseId;
        const requestedQuantity = lines?.[0]?.quantity;
        const {data} = await fetch(uri, {
            method: "POST",
            headers: {
                "X-Shopify-Storefront-Access-Token": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: SHOPIFY_CART_ADD_PRODUCT_LINE,
                variables: {
                    cartId,
                    lines: lines,
                    linesCount: (linesCount || 0) + 1
                }
            }),
        }).then((res: any) => res.json());

        if (data?.cartLinesAdd?.userErrors?.length) {
            data.cartLinesAdd.userErrors.forEach((err: Error) => console.warn(err));
        }

        if (data?.cartLinesAdd?.cart) {
            checkQuantityMissing({
                lines: data.cartLinesAdd.cart.lines.nodes,
                requestedQuantity,
                updatedVariantId,
            });

            // return transformCart(data.cartLinesAdd.cart);
            return data.cartLinesAdd.cart;
        }
    };
}

export default useAddProductLine;
