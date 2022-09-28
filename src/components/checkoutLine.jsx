import React, {useContext} from "react";
import {TrashIcon} from "@heroicons/react/solid";

import CheckoutContext from "../context/CheckoutContext";
import Price from "./atoms/price.jsx";

const CheckoutLine = ({
    id,
    variant,
    quantity,
    totalPrice
}) => {
    const {removeItemFromCheckout} = useContext(CheckoutContext);

    const onRemove = async () => {
        await removeItemFromCheckout(id);
    };

    return (
        <li className="flex py-6">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                    src={variant.product.thumbnail?.url}
                    alt={variant.product.thumbnail?.alt}
                    className="h-full object-cover object-center"
                />
            </div>

            <div className="ml-4 flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between text-base font-medium text-color-900">
                        <h3>
                            <a href={variant.product.href}> {variant.product.name} {variant.name} </a>
                        </h3>
                        <p className="ml-4"><Price price={totalPrice.gross.amount}/> {totalPrice.gross.currency}</p>
                    </div>
                    <p className="mt-1 text-sm text-color-500">...</p>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-color-500">Menge {quantity}</p>

                    <div className="flex">
                        <button
                            onClick={onRemove}
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            <span className="sr-only">Entfernen</span>
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
};

const CheckoutLineDetail = ({
    id,
    variant,
    quantity,
    totalPrice
}) => {
    const {removeItemFromCheckout} = useContext(CheckoutContext);

    const onRemove = async () => {
        await removeItemFromCheckout(id);
    };

    const onChangeQuantity = async () => {
        // TODO
        console.warn("TODO onChangeQuantity");
    }

    let variantTitle = variant.product.name;
    if (String(variant.name).toLowerCase() !== "default title") {
        variantTitle += " " + variant.name;
    }

    return (
        <li className="flex py-6 px-4 sm:px-6">
            <div className="flex-shrink-0">
                <img
                    src={variant.product.thumbnail?.url}
                    alt={variant.product.thumbnail?.alt}
                    className="w-20 rounded-md"
                />
            </div>

            <div className="ml-6 flex-1 flex flex-col">
                <div className="flex">
                    <div className="min-w-0 flex-1">
                        <h4 className="text-sm">
                            <a href={variant.product.href} className="font-medium text-color-700 hover:text-color-800">
                                {variantTitle}
                            </a>
                        </h4>
                        <p className="mt-1 text-sm text-color-500">...</p>
                        <p className="mt-1 text-sm text-color-500">...</p>
                    </div>

                    <div className="ml-4 flex-shrink-0 flow-root">
                        <button
                            type="button"
                            className="-m-2.5 bg-white p-2.5 flex items-center justify-center text-color-400 hover:text-color-500"
                            onClick={onRemove}
                        >
                            <span className="sr-only">Entfernen</span>
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 pt-2 flex items-end justify-between">
                    <p className="mt-1 text-sm font-medium text-color-900"><Price price={totalPrice.gross.amount}/> {totalPrice.gross.currency}</p>

                    <div className="ml-4">
                        <label htmlFor="quantity" className="sr-only">
                            Anzahl
                        </label>
                        <select
                            id="quantity"
                            name="quantity"
                            onChange={onChangeQuantity}
                            className="rounded-md border border-gray-300 text-base font-medium text-color-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                        </select>
                    </div>
                </div>
            </div>
        </li>
    );
};

CheckoutLine.Detail = CheckoutLineDetail;

export default CheckoutLine;
