import React, { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import useCartStore from "../stores/cartStore";

type ButtonLabels = {
    default?: string;
    disabled?: string;
};
export type BuyButtonProps = {
    variantId: string;
    attributes?: Array<Attribute>;
    disabled: boolean;
    showCountSelection: boolean;
    maxCountSelection?: number;
    buttonLabels?: ButtonLabels;
    classNameButton?: string;
    classNameContainer?: string;
    classNameCountSelection?: string;
    onProductAdded?: (createdProductLine?: CartLineCreateInput) => void;
};
const BuyButton = ({
    variantId,
    attributes,
    disabled,
    showCountSelection,
    maxCountSelection,
    buttonLabels,
    classNameButton,
    classNameContainer,
    classNameCountSelection,
    onProductAdded,
}: BuyButtonProps) => {
    const cartId = useCartStore(useShallow((store) => store.cart?.id));
    const linesCount = useCartStore(useShallow((store) => store.cart?.lines?.length || 1));
    const createCart = useCartStore(useShallow((state) => state.createCart));
    const createCartLine = useCartStore(useShallow((store) => store.createCartLine));

    const [quantity, setQuantity] = useState(1);

    const defaultButtonText = buttonLabels?.default || "In den Warenkorb";
    const disabledButtonText = buttonLabels?.disabled || "Nicht verfügbar";

    const onClick = async () => {
        const lineInput: CartLineCreateInput = {
            merchandiseId: variantId,
            quantity: quantity,
        };
        if (attributes) {
            lineInput.attributes = attributes;
        }

        if (!cartId) {
            await createCart({ lines: [lineInput] });
        } else {
            await createCartLine({
                cartId: cartId,
                lines: [lineInput],
                linesCount: linesCount,
            });
        }

        if (onProductAdded) {
            onProductAdded(lineInput);
        }
    };

    const onChangeQuantity = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const updatedQuantity = parseInt(e.target.value);
        if (isNaN(updatedQuantity)) {
            return;
        }
        if (updatedQuantity !== quantity) {
            setQuantity(quantity);
        }
    }

    return (
        <div className={classNameContainer || ""}>
            {showCountSelection && (
                <select className={classNameCountSelection || ""} onChange={onChangeQuantity} defaultValue={quantity}>
                    {new Array(maxCountSelection || 20).fill(undefined).map((v, i) => <option value={i + 1} key={`count-${i}`}>{i + 1}</option>)}
                </select>
            )}
            <button className={classNameButton || ""} type="button" onClick={onClick}>
                {disabled ? disabledButtonText : defaultButtonText}
            </button>
        </div>
    );
};

export default BuyButton;
