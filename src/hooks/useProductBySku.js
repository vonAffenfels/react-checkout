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
        return async ({sku, onlyMatchingVariant}) => {
            console.log("useProductBySku, query:", `tag:"${sku}"`);
            let fetchData = async (variantCursor) => {
                let {data} = await client.query({
                    query: SHOPIFY_PRODUCT_BY_SKU,
                    variables: {
                        query: `tag:${sku}`,
                        variantLimit: 3,
                        variantCursor: variantCursor,
                    }
                });
                return data;
            };
            let data = await fetchData();
            let endCursor = data.products.nodes?.[0]?.variants?.pageInfo?.endCursor;
            let hasNextPage = data.products.nodes?.[0]?.variants?.pageInfo?.hasNextPage;

            if (onlyMatchingVariant) {
                let foundNode;
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

                console.log("useProductBySku, onlyMatchingVariant:", onlyMatchingVariant, "foundNode:", foundNode);
                if (foundNode) {
                    return foundNode;
                } else if (hasNextPage) {
                    return fetchData(endCursor);
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
    }
}

export default useProductBySku;