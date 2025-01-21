const checkQuantityMissing = ({
    lines = [],
    updatedVariantId,
    requestedQuantity,
}: {
    lines: Array<CartLine>,
    updatedVariantId: string,
    requestedQuantity: number,
}) => {
    lines.forEach(line => {
        if (line.merchandise.id === updatedVariantId) {
            if (line.quantity < requestedQuantity) {
                console.warn("we are out of", updatedVariantId);
                line.displayMessage = `Nur noch ${line.quantity} verfügbar`;
            }
        }
    });
};

export default checkQuantityMissing;
