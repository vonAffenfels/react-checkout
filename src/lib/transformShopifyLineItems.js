//takes a saleor lines as parameter
function transformShopifyLineItems(lines) {
    return lines.map(line => {
        return {
            variantId: line.variant.id,
            quantity: line.quantity
        }
    });
}

export default transformShopifyLineItems;
