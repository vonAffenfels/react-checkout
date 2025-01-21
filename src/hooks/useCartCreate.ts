//shopify
import SHOPIFY_CART_CREATE from "../mutations/cartCreate";
import checkQuantityMissing from "../lib/checkQuantityMissing";

export type CreateCartParams = { lines: CartLineCreateInput[]; redirectToMultipass?: boolean };

const useCartCreate = (uri: string, apiKey: string) => {
    return async ({ lines, redirectToMultipass }: CreateCartParams) => {
        const updatedVariantId = lines?.[0]?.merchandiseId;
        const requestedQuantity = lines?.[0]?.quantity;
        const { data } = await fetch(uri, {
            method: "POST",
            headers: {
                "X-Shopify-Storefront-Access-Token": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: SHOPIFY_CART_CREATE,
                variables: {
                    input: {
                        lines: lines,
                    },
                    linesCount: lines.length,
                },
            }),
        }).then((res) => res.json());

        if (data?.cartCreate?.userErrors?.length) {
            data.cartCreate.userErrors.forEach((err: Error) => console.warn(err));
        }

        if (data?.cartCreate?.cart?.id) {
            checkQuantityMissing({
                lines: data.cartCreate.cart.lines.nodes,
                requestedQuantity,
                updatedVariantId,
            });

            return data.cartCreate.cart;
        }
    };
};

export default useCartCreate;
