function transformShopifyLineItems(lines) {
    return lines.map(line => {
        let retVal = {
            variantId: line.variant.id,
            quantity: line.quantity
        };
        if (line.attributes) {
            retVal.attributes = line.attributes;
        }
        return retVal;
    });
}

export default transformShopifyLineItems;
