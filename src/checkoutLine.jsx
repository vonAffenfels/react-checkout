import React, {useContext} from "react";

import CheckoutContext from "./context/CheckoutContext";

const CheckoutLine = ({
    id,
    variant,
    quantity,
    totalPrice
}) => {
    console.log({
        id,
        variant,
        quantity,
        totalPrice
    });
    const {removeItemFromCheckout} = useContext(CheckoutContext);

    const onRemove = async () => {
        // TODO
        console.warn("implement onRemove");
        await removeItemFromCheckout(id);
    };

    return (
        <li key={variant.id} className="flex py-6">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                    src={variant.product.thumbnail?.url}
                    alt={variant.product.thumbnail?.alt}
                    className="h-full w-full object-cover object-center"
                />
            </div>

            <div className="ml-4 flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                            <a href={variant.product.href}> {variant.product.name} {variant.name} </a>
                        </h3>
                        <p className="ml-4">{totalPrice.gross.amount} {totalPrice.gross.currency}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{variant.product.color}</p>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-gray-500">Qty {quantity}</p>

                    <div className="flex">
                        <button
                            onClick={onRemove}
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default CheckoutLine;
