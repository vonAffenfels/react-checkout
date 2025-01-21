//shopify
import SHOPIFY_PRODUCT_BY_SKU from "../queries/productBySku";

type FetchProductPayload = {
    sku: string;
    onlyMatchingVariant: boolean;
    productCursor?: string | undefined;
    variantCursor?: string | undefined;
    isAbo: boolean;
};
type FetchVariantPayload = {
    productCursor?: string | undefined;
    variantCursor?: string | undefined;
};
type VariantResult = {
    id: string;
    sku: string;
};
type ProductResult = {
    id: string;
    variants: {
        nodes: Array<VariantResult>;
    };
};

const useProductBySku = (uri: string, apiKey: string) => {
    const doFetch = async ({
        sku,
        onlyMatchingVariant,
        productCursor,
        variantCursor,
        isAbo,
    }: FetchProductPayload): Promise<ProductResult | null> => {
        let tagQuery = `tag:${sku}`;
        if (!isAbo) {
            tagQuery += " tag_not:Subscription";
        }
        let fetchData = async ({ productCursor, variantCursor }: FetchVariantPayload) => {
            const { data } = await fetch(uri, {
                method: "POST",
                headers: {
                    "X-Shopify-Storefront-Access-Token": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: SHOPIFY_PRODUCT_BY_SKU,
                    variables: {
                        query: tagQuery,
                        variantLimit: 3,
                        variantCursor: variantCursor,
                        productCursor: productCursor,
                    },
                }),
            }).then((res) => res.json());
            return data;
        };
        let data = await fetchData({ variantCursor, productCursor });
        let endCursor = data.products.nodes?.[0]?.variants?.pageInfo?.endCursor;
        let hasNextPage = data.products.nodes?.[0]?.variants?.pageInfo?.hasNextPage;

        if (onlyMatchingVariant) {
            let foundNode = null;
            if (data?.products?.nodes?.length) {
                data.products.nodes?.[0]?.variants?.nodes?.forEach((node: ProductVariant) => {
                    if (String(node.sku).toLowerCase() === String(sku).toLowerCase()) {
                        foundNode = {
                            ...data.products.nodes[0],
                            variants: {
                                nodes: [node],
                            },
                        };
                    }
                });
            }

            if (foundNode) {
                return foundNode;
            } else if (hasNextPage) {
                return doFetch({ sku, onlyMatchingVariant, variantCursor: endCursor, isAbo });
            } else if (data.products?.pageInfo?.hasNextPage) {
                return doFetch({ sku, onlyMatchingVariant, productCursor: data.products.pageInfo.endCursor, isAbo });
            } else {
                return null;
            }
        } else {
            let productNode = { ...data?.products?.nodes?.[0] };
            let variantNodes = [...(productNode?.variants?.nodes || [])];

            const fetchVariants = async ({ variantCursor, productCursor }: FetchVariantPayload) => {
                data = await fetchData({ variantCursor, productCursor });
                ({ endCursor, hasNextPage } = data.products.nodes?.[0]?.variants?.pageInfo);
                variantNodes = variantNodes.concat(data.products.nodes[0].variants.nodes);
            };

            while (hasNextPage) {
                await fetchVariants({ variantCursor: endCursor });
            }
            while (data.products?.pageInfo?.hasNextPage) {
                data = await fetchVariants({ productCursor: data.products.pageInfo.endCursor });
            }

            return {
                ...productNode,
                variants: {
                    nodes: variantNodes,
                },
            };
        }
    };
    return doFetch;
};

export default useProductBySku;
