function transformShopifyLineItems(lines) {
    return lines.map(line => {
        let retVal = {
            variantId: line.variant.id,
            quantity: line.quantity
        };
        if (line.customAttributes) {
            retVal.customAttributes = line.customAttributes;
        }
        return retVal;
    });
}

export default transformShopifyLineItems;
