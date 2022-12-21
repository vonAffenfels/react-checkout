function transformShopifyLineItems(lines) {
    return lines.map(line => {
        let retVal = {
            variantId: line.variant.id,
            quantity: line.quantity
        };
        if (line.bonusProduct) {
            retVal.customAttributes = [{
                key: "bonus_id",
                value: line.bonusProduct.aboSku + "_" + line.bonusProduct.variantSku,
            }];
        }
        return retVal;
    });
}

export default transformShopifyLineItems;
