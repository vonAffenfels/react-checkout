import React from "react";

const CheckoutLine = ({
    variant: {
        product,
        name,
        id
    },
    quantity,
    totalPrice
}) => {

    const onRemove = () => {
        // TODO
        console.warn("implement onRemove");
    };

    return (
        <li key={id} className="flex py-6">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-full w-full object-cover object-center"
                />
            </div>

            <div className="ml-4 flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                            <a href={product.href}> {product.name} {name} </a>
                        </h3>
                        <p className="ml-4">{totalPrice.gross.amount} {totalPrice.gross.currency}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{product.color}</p>
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
