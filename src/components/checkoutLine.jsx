import React, {useContext, useState} from "react";
import {TrashIcon} from "@heroicons/react/solid";

import CheckoutContext from "../context/CheckoutContext";
import Price from "./atoms/price.jsx";
import {CheckMarkIcon, PlusIcon, MinusIcon} from "./atoms/icons.jsx";
import {Spin} from "./atoms/animate.jsx";

const CheckoutLine = ({
    id,
    variant,
    quantity,
    totalPrice,
    bonusProduct,
    giftedIdentity,
}) => {
    const [isLoadingQuantity, setLoadingQuantity] = useState(false);
    const {removeItemFromCart, updateCartItems, isLoadingLineItemQuantity} = useContext(CheckoutContext);

    const onRemove = async () => {
        await removeItemFromCart(id);
    };

    const onAdd = async () => {
        if (isLoadingLineItemQuantity) {
            return;
        }

        setLoadingQuantity(true);
        const updatedQuantity = quantity + 1;
        await updateCartItems({
            lineId: id,
            variantId: variant.id,
            quantity: updatedQuantity,
            bonusProduct: bonusProduct,
        });
        setLoadingQuantity(false);
    };

    const onSubtract = async () => {
        if (isLoadingLineItemQuantity) {
            return;
        }

        const updatedQuantity = quantity - 1;
        if (!quantity) {
            return onRemove();
        }
        setLoadingQuantity(true);
        await updateCartItems({
            lineId: id,
            variantId: variant.id,
            quantity: updatedQuantity,
            bonusProduct: bonusProduct,
        });
        setLoadingQuantity(false);
    };

    let variantTitle = "";
    if (String(variant?.name).toLowerCase() !== "default title") {
        variantTitle = variant?.name?.charAt(0).toUpperCase() + variant?.name?.substring(1);
    }

    return (
        <>
            <li className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                        src={variant?.product?.thumbnail?.url}
                        alt={variant?.product?.thumbnail?.alt}
                        className="h-full object-cover object-center"
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
                    <div className="flex flex-1 items-end justify-between">
                        <p className="mt-1 text-sm text-color-500" />
                        <p className="mt-1 text-sm text-color-500 mr-8 text-xs">Menge:</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="mt-1 text-sm text-color-900">{!bonusProduct ? variantTitle : ""}</p>
                        <div className="mt-1 text-sm text-color-900 grid grid-cols-3">
                            <span className="col-span-1" onClick={onSubtract}><MinusIcon /></span>
                            <span className="col-span-1 text-center">
                                {isLoadingQuantity ? (
                                    <Spin w={2} h={2} style={{margin: ".25rem"}} />
                                ) : quantity}
                            </span>
                            <span className="col-span-1" onClick={onAdd}><PlusIcon /></span>
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
                    <BonusLine {...bonusProduct} giftedIdentity={giftedIdentity} variantTitle={variantTitle} />
                </>
            )}
        </>
    );
};

const BonusLine = ({aboSku, variantSku, product, variantTitle, giftedIdentity}) => {
    return (
        <li className="flex py-6" style={{border: "0"}}>
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                    src={product?.thumbnail?.url}
                    alt={product?.thumbnail?.alt}
                    className="h-full object-cover object-center"
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
    totalPrice,
    bonusProduct,
    giftedIdentity,
}) => {
    const [isLoadingQuantity, setLoadingQuantity] = useState(false);
    const {removeItemFromCart, updateCartItems, isLoadingLineItemQuantity} = useContext(CheckoutContext);

    const onRemove = async () => {
        await removeItemFromCart(id);
    };

    const onAdd = async () => {
        if (isLoadingLineItemQuantity) {
            return;
        }

        setLoadingQuantity(true);
        const updatedQuantity = quantity + 1;
        await updateCartItems({
            lineId: id,
            variantId: variant.id,
            quantity: updatedQuantity,
            bonusProduct: bonusProduct,
        });
        setLoadingQuantity(false);
    };

    const onSubtract = async () => {
        if (isLoadingLineItemQuantity) {
            return;
        }

        const updatedQuantity = quantity - 1;
        if (!quantity) {
            return onRemove();
        }
        setLoadingQuantity(true);
        await updateCartItems({
            lineId: id,
            variantId: variant.id,
            quantity: updatedQuantity,
            bonusProduct: bonusProduct,
        });
        setLoadingQuantity(false);
    };

    let variantTitle = "";
    if (String(variant.name).toLowerCase() !== "default title") {
        variantTitle = variant.name.charAt(0).toUpperCase() + variant.name.substring(1);
    }

    return (
        <>
            <li className="flex py-6 px-4 sm:px-6">
                <div className="flex-shrink-0">
                    <img
                        src={variant.product.thumbnail?.url}
                        alt={variant.product.thumbnail?.alt}
                        className="w-20 rounded-md"
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
                        <p className="mt-1 text-sm text-color-500" />
                        <p className="mt-1 text-sm text-color-500 mr-8 text-xs">Menge:</p>
                    </div>

                    <div className="ml-6 flex flex-1 items-end justify-between">
                        <p className="mt-1 text-sm text-color-500">{!bonusProduct ? variantTitle : ""}</p>
                        <div className="mt-1 text-sm text-color-900 grid grid-cols-3">
                            <span className="col-span-1" onClick={onSubtract}><MinusIcon /></span>
                            <span className="col-span-1 text-center">
                                {isLoadingQuantity ? (
                                    <Spin w={2} h={2} style={{margin: ".25rem"}} />
                                ) : quantity}
                            </span>
                            <span className="col-span-1" onClick={onAdd}><PlusIcon /></span>
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
                    <BonusLineDetail {...bonusProduct} giftedIdentity={giftedIdentity} variantTitle={variantTitle} />
                </>
            )}
        </>
    );
};

const BonusLineDetail = ({aboSku, variantSku, product, variantTitle, giftedIdentity}) => {
    return (
        <li className="flex py-6 px-4 sm:px-6">
            <div className="flex-shrink-0">
                <img
                    src={product?.thumbnail?.url}
                    alt={product?.thumbnail?.alt}
                    className="w-20 rounded-md"
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

CheckoutLine.BonusLine = BonusLine;
CheckoutLine.Detail = CheckoutLineDetail;
CheckoutLine.BonusLineDetail = BonusLineDetail;

export default CheckoutLine;
