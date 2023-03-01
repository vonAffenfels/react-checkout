import React, {useContext, useState} from "react";

import CheckoutContext from "../context/CheckoutContext";
import Price from "./atoms/price.jsx";
import {CheckMarkIcon, PlusIcon, MinusIcon} from "./atoms/icons.jsx";
import {Spin} from "./atoms/animate.jsx";
import BuyContext from "../context/BuyContext";

const CheckoutLine = ({
    id,
    variant,
    quantity,
    customAttributes = [],
    totalPrice,
    bonusProduct,
    giftedIdentity,
}) => {
    console.log("customAttributes", customAttributes);
    const [isLoadingQuantity, setLoadingQuantity] = useState(false);
    const {isDebug} = useContext(BuyContext);
    const {removeItemFromCart, updateCartItems, isLoadingLineItemQuantity} = useContext(CheckoutContext);
    const overwriteImage = customAttributes.find(v => v.key === "overwrite_product_image_url");

    const onRemove = async () => {
        await removeItemFromCart(id);
    };

    const onChangeQuantity = async (e) => {
        const updatedQuantity = parseInt(e.target.value);
        setLoadingQuantity(true);
        await updateCartItems({
            lineId: id,
            variantId: variant.id,
            quantity: updatedQuantity,
            bonusProduct: bonusProduct,
        });
        setLoadingQuantity(false);
    }

    let variantTitle = "";
    if (String(variant?.name).toLowerCase() !== "default title") {
        variantTitle = variant?.name?.charAt(0).toUpperCase() + variant?.name?.substring(1);
    }

    return (
        <>
            <li className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                        src={overwriteImage?.value || variant?.product?.thumbnail?.url}
                        alt={variant?.product?.thumbnail?.alt}
                        className="h-full mx-auto object-cover object-center"
                    />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                    <div>
                        <div className="flex justify-between text-base font-medium text-color-900">
                            <h3>
                                <a href={variant?.product?.href}>{variant?.product?.name}</a>
                            </h3>
                        </div>
                        <p className="text-base font-bold text-color-900">
                            <Price price={totalPrice?.gross?.amount}/> {totalPrice?.gross?.currency}
                        </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="mt-1 text-sm text-color-900">{!bonusProduct ? variantTitle : ""}</p>
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
            </li>
            {bonusProduct && (
                <>
                    <div style={{border: "0", marginTop: "-.75rem"}} className="pl-10 absolute z-50 text-color-500">
                        <span className="inline bg-white pl-5 pr-5">
                            <CheckMarkIcon />
                            kostenfrei als Prämie
                        </span>
                    </div>
                    <div className="w-full border-top-0 border-bottom-1 absolute" />
                    <BonusLine
                        imageSrc={variant?.product?.thumbnail?.url}
                        giftedIdentity={giftedIdentity}
                        variantTitle={variantTitle}
                    />
                </>
            )}
        </>
    );
};

const BonusLine = ({
    imageSrc,
    variantTitle,
    giftedIdentity,
}) => {
    return (
        <li className="flex py-6" style={{border: "0"}}>
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                <img
                    src={imageSrc}
                    className="h-full mx-auto object-cover object-center"
                />
            </div>
            <div className="ml-4 flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between text-base font-medium text-color-900">
                        <h3>{variantTitle}</h3>
                    </div>
                    {giftedIdentity ? (
                        <p className="mt-1 text-sm text-color-500">{"Beschenkter: " + giftedIdentity.firstName + " " + giftedIdentity.lastName}</p>
                    ) : (
                        <p className="mt-1 text-sm text-color-500">Prämie</p>
                    )}
                </div>
            </div>
        </li>
    );
}

const CheckoutLineDetail = ({
    id,
    variant,
    quantity,
    customAttributes = [],
    totalPrice,
    bonusProduct,
    giftedIdentity,
}) => {
    const [isLoadingQuantity, setLoadingQuantity] = useState(false);
    const {isDebug} = useContext(BuyContext);
    const {removeItemFromCart, updateCartItems, isLoadingLineItemQuantity} = useContext(CheckoutContext);
    const overwriteImage = customAttributes.find(v => v.key === "overwrite_product_image_url");

    const onRemove = async () => {
        await removeItemFromCart(id);
    };

    const onChangeQuantity = async (e) => {
        const updatedQuantity = parseInt(e.target.value);
        setLoadingQuantity(true);
        await updateCartItems({
            lineId: id,
            variantId: variant.id,
            quantity: updatedQuantity,
            bonusProduct: bonusProduct,
        });
        setLoadingQuantity(false);
    }

    let variantTitle = "";
    if (String(variant.name).toLowerCase() !== "default title") {
        variantTitle = variant.name.charAt(0).toUpperCase() + variant.name.substring(1);
    }

    return (
        <>
            <li className="flex py-6 px-4 sm:px-6">
                <div className="flex-shrink-0">
                    <img
                        src={overwriteImage?.value || variant.product.thumbnail?.url}
                        alt={variant.product.thumbnail?.alt}
                        className="w-20 mx-auto rounded-md"
                    />
                </div>

                <div className="flex flex-1 flex-col">
                    <div className="ml-6 flex flex-1 items-end justify-between">
                        <div className="min-w-0">
                            <h4 className="text-sm">
                                <a href={variant.product.href} className="font-medium text-color-700 hover:text-color-800">
                                    {variant.product.name}
                                </a>
                            </h4>
                        </div>
                    </div>
                    <div className="ml-6 flex flex-1 items-end justify-between">
                        <p className="mt-1 text-sm font-bold text-color-900">
                            <Price price={totalPrice.gross.amount}/> {totalPrice.gross.currency}
                        </p>
                    </div>
                    <div className="ml-6 flex flex-1 items-end justify-between">
                        <p className="mt-1 text-sm text-color-500">{!bonusProduct ? variantTitle : ""}</p>
                        <div className="mt-1 text-sm text-color-900">
                            {isLoadingQuantity ? (
                                <div className="rounded-md border border-gray-300 ml-2 pr-4 pl-4 py-2">
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
            </li>
            {bonusProduct && (
                <>
                    <div style={{border: "0", marginTop: "-.75rem"}} className="pl-10 absolute z-50 text-color-500">
                        <span className="inline bg-white pl-5 pr-5">
                            <CheckMarkIcon />
                            kostenfrei als Prämie
                        </span>
                    </div>
                    <div className="w-full border-top-0 border-bottom-1 absolute" />
                    <BonusLineDetail
                        imageSrc={variant.product.thumbnail?.url}
                        giftedIdentity={giftedIdentity}
                        variantTitle={variantTitle}
                    />
                </>
            )}
        </>
    );
};

const BonusLineDetail = ({
    imageSrc,
    variantTitle,
    giftedIdentity
}) => {
    return (
        <li className="flex py-6 px-4 sm:px-6">
            <div className="flex-shrink-0">
                <img
                    src={imageSrc}
                    className="w-20 mx-auto rounded-md"
                />
            </div>

            <div className="ml-6 flex-1 flex flex-col">
                <div className="flex">
                    <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-color-700 hover:text-color-800">
                            {variantTitle}
                        </h4>
                        {giftedIdentity ? (
                            <>
                                <p className="mt-1 text-sm text-color-500">Beschenkter:</p>
                                <p className="mt-1 text-sm text-color-500">{giftedIdentity.firstName + " " + giftedIdentity.lastName}</p>
                                <p className="mt-1 text-sm text-color-500">{giftedIdentity.streetAddress + " " + giftedIdentity.houseNumber}</p>
                                <p className="mt-1 text-sm text-color-500">{giftedIdentity.city + " " + giftedIdentity.zip}</p>
                                <p className="mt-1 text-sm text-color-500">{giftedIdentity.country}</p>
                            </>
                        ) : (
                            <p className="mt-1 text-sm text-color-500">Prämie</p>
                        )}
                    </div>
                </div>

                <div className="flex-1 pt-2 flex items-end justify-between">
                    <p className="mt-1 text-sm font-medium text-color-900" />
                </div>
            </div>
        </li>
    )
};

const QuantityOptions = ({quantity, id}) => {
    const values = [0, quantity];

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

    return values.map(v => <option value={v} key={"checkout-line-option-" + id + v}>{v}</option>);
}

CheckoutLine.BonusLine = BonusLine;
CheckoutLine.Detail = CheckoutLineDetail;
CheckoutLine.BonusLineDetail = BonusLineDetail;

export default CheckoutLine;
