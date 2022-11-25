import React from "react";

//saleor

//shopify
import SHOPIFY_PRODUCT_BY_SKU from "../queries/shopify/productBySku";

const useProductBySku = (shop, client) => {
    if (!shop || !client) {
        return {};
    }

    if (shop === "saleor") {
        return async () => {
            console.warn("saleor: productBySku is not defined");
            return null;
        };
    } else if (shop === "shopify") {
        const doFetch = async ({sku, onlyMatchingVariant, variantCursor, isAbo}) => {
            let tagQuery = `tag:${sku}`;
            if (!isAbo) {
                tagQuery += " tag_not:Subscription";
            }
            let fetchData = async (variantCursor) => {
                let {data} = await client.query({
                    query: SHOPIFY_PRODUCT_BY_SKU,
                    variables: {
                        query: tagQuery,
                        variantLimit: 3,
                        variantCursor: variantCursor,
                    }
                });
                return data;
            };
            let data = await fetchData(variantCursor);
            let endCursor = data.products.nodes?.[0]?.variants?.pageInfo?.endCursor;
            let hasNextPage = data.products.nodes?.[0]?.variants?.pageInfo?.hasNextPage;

            if (onlyMatchingVariant) {
                let foundNode = null;
                if (data?.products?.nodes?.length) {
                    data.products.nodes?.[0]?.variants?.nodes?.forEach(node => {
                        if (String(node.sku).toLowerCase() === String(sku).toLowerCase()) {
                            foundNode = {
                                ...data.products.nodes[0],
                                variants: {
                                    nodes: [node]
                                }
                            };
                        }
                    });
                }

                if (foundNode) {
                    return foundNode;
                } else if (hasNextPage) {
                    return doFetch({sku, onlyMatchingVariant, variantCursor: endCursor, isAbo});
                } else {
                    return null;
                }
            } else {
                let productNode = {...data?.products?.nodes?.[0]};
                let variantNodes = [...(productNode?.variants?.nodes || [])];

                while (hasNextPage) {
                    data = await fetchData(endCursor);
                    ({endCursor, hasNextPage} = data.products.nodes?.[0]?.variants?.pageInfo);
                    variantNodes = variantNodes.concat(data.products.nodes[0].variants.nodes);
                }

                return {
                    ...productNode,
                    variants: {
                        nodes: variantNodes
                    }
                };
            }
        };
        return doFetch;
    }
}

export default useProductBySku;
