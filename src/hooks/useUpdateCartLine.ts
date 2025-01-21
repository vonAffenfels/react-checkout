//shopify
import SHOPIFY_CART_LINE_UPDATE from "../mutations/cartLinesUpdate";
import checkQuantityMissing from "../lib/checkQuantityMissing";

export type UpdateCartLineParams = {
    cartId: string;
    lines: Array<CartLineUpdateInput>;
    linesCount: number;
};

const useUpdateCartLine = (uri: string, apiKey: string) => {
    return async ({ cartId, lines, linesCount }: UpdateCartLineParams) => {
        const updatedVariantId = lines?.[0]?.merchandiseId;
        const requestedQuantity = lines?.[0]?.quantity;
        const { data } = await fetch(uri, {
            method: "POST",
            headers: {
                "X-Shopify-Storefront-Access-Token": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: SHOPIFY_CART_LINE_UPDATE,
                variables: {
                    cartId,
                    lines: lines,
                    linesCount: (linesCount || 0) + 1,
                },
            }),
        }).then((res) => res.json());

        if (data?.cartLinesUpdate?.userErrors?.length) {
            data.cartLinesUpdate.userErrors.forEach((err: Error) => console.warn(err));
        }

        if (data?.cartLinesUpdate?.cart) {
            checkQuantityMissing({
                lines: data.cartLinesUpdate.cart.lines.nodes,
                requestedQuantity,
                updatedVariantId,
            });

            return data.cartLinesUpdate.cart;
        }
    };
};

export default useUpdateCartLine;
