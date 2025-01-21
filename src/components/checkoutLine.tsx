import React, {useState} from "react";

import Price from "./atoms/price";
import {Spin} from "./atoms/animate";
import useCartStore from "../stores/cartStore";
// import {useShallow} from "zustand/react/shallow";
import * as shallow from "zustand/react/shallow";
console.log("shallow", shallow);

type CheckoutLineProps = CartLine;
const CheckoutLine = ({
    id,
    merchandise,
    quantity,
    attributes = [],
    cost,
    discountAllocations,
    displayMessage = "",
}: CheckoutLineProps) => {
    const discountCodes = useCartStore(shallow.useShallow((store) => (store.cart?.discountCodes || []).map(v => v.code).join(", ")));
    const updateCartLines = useCartStore(shallow.useShallow((store) => store.updateCartLines));
    const cartId = useCartStore(shallow.useShallow((store) => store.cart?.id));
    const linesCount = useCartStore(shallow.useShallow((store) => store.cart?.lines?.length || 1));

    const [isLoadingQuantity, setLoadingQuantity] = useState(false);
    const overwriteImage = attributes.find(v => v.key === "overwrite_product_image_url");

    const onChangeQuantity = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!cartId) {
            return;
        }

        const updatedQuantity = parseInt(e.target.value);
        setLoadingQuantity(true);
        await updateCartLines({
            cartId: cartId,
            lines: [{
                attributes,
                id: id,
                merchandiseId: merchandise.id,
                quantity: updatedQuantity,
            }],
            linesCount,
        });
        setLoadingQuantity(false);
    }

    let variantTitle = "";
    if (String(merchandise?.title).toLowerCase() !== "default title") {
        variantTitle = merchandise?.title?.charAt(0).toUpperCase() + merchandise?.title?.substring(1);
    }

    return (
        <>
            <li className="flex flex-col py-6">
                <div className="flex flex-row">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                            src={overwriteImage?.value || merchandise?.image?.url}
                            alt={merchandise?.image?.altText}
                            className="h-full mx-auto object-cover object-center"
                        />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                        <div>
                            <div className="flex justify-between text-base font-medium text-color-900">
                                <h3>{merchandise.product.title}</h3>
                            </div>
                            {discountAllocations.discountedAmount.amount > 0 ? (
                                <>
                                    <p>
                                        <span className="text-sm line-through text-color-900">
                                            <Price price={cost.totalAmount.amount}/> {cost.totalAmount.currencyCode}
                                        </span>
                                        <span className="text-base font-bold text-color-900">
                                            {' '}<Price price={cost.totalAmount.amount - discountAllocations.discountedAmount.amount}/> {cost.totalAmount.currencyCode}
                                        </span>
                                    </p>
                                    <p className="text-sm text-color-500">
                                        {discountCodes}
                                        {' '}(-<Price price={discountAllocations.discountedAmount.amount}/> {discountAllocations.discountedAmount.currencyCode})
                                    </p>
                                </>
                            ) : (
                                <p className="text-base font-bold text-color-900">
                                    <Price price={cost.totalAmount.amount}/> {cost.totalAmount.currencyCode}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                            <p className="mt-1 text-sm text-color-900">{variantTitle}</p>
                                <div className="mt-1 text-sm text-color-900">
                                {isLoadingQuantity ? (
                                    <div className="rounded-md border border-gray-300 ml-2 pl-2 pr-2 py-2">
                                        <Spin h={6} w={6} />
                                    </div>
                                ) : (
                                    <select
                                        id="quantity"
                                        name="quantity"
                                        onChange={onChangeQuantity}
                                        value={quantity}
                                        disabled={isLoadingQuantity}
                                        className="rounded-md border border-gray-300 text-base font-medium text-color-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <QuantityOptions quantity={quantity} id={id} />
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-1 text-sm text-red-500 text-end">{displayMessage}</p>
            </li>
        </>
    );
};

const QuantityOptions = ({quantity, id}: {quantity: number, id: string | number}) => {
    const values = [quantity];

    if (quantity !== 0) {
        values.push(0);
    }

    let count = 0;
    while (values.length < 8) {
        let newLowerVal = quantity - 1 - count;
        let newUpperVal = quantity + 1 + count;
        if (newLowerVal > 0) {
            values.push(newLowerVal);
        }
        values.push(newUpperVal);
        count++;
    }
    values.sort((a, b) => {
        if (a > b) {
            return 1;
        } else {
            return -1;
        }
    });

    return (
        <>
            {values.map(v => <option value={v} key={"checkout-line-option-" + id + v}>{v}</option>)}
        </>
    );
}

export default CheckoutLine;
