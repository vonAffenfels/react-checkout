import React, {useState, useEffect, useContext} from "react";
import {SpeakerphoneIcon, XIcon} from "@heroicons/react/outline";
import BuyContext from "../context/BuyContext";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

let timeoutHandle = null;

export default function Banner() {
    const {bannerMessage: {msg, isError}, setBannerMessage} = useContext(BuyContext);

    const hide = () => {
        setBannerMessage({msg: "", isError: false});
    };

    useEffect(() => {
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
        }
        timeoutHandle = setTimeout(() => {
            hide();
            timeoutHandle = null;
        }, 7000);
    }, [msg]);

    if (!msg) {
        return null;
    }

    return (
        <div id="react-ez-checkout-banner" className="fixed top-10 inset-x-0 pb-2 sm:pb-5 z-insane">
            <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className={
                    classNames(
                        isError ? "bg-red-600" : "bg-color-600",
                        "p-2 rounded-lg shadow-lg sm:p-3"
                    )
                }>
                    <div className="flex items-center justify-between flex-wrap">
                        <div className="w-0 flex-1 flex items-center">
                            <span className={
                                classNames(
                                    isError ? "bg-red-800" : "bg-color-800",
                                    "flex p-2 rounded-lg"
                                )
                            }>
                                <SpeakerphoneIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                            </span>
                            <p className="ml-3 font-medium text-white truncate">
                                <span className="md:hidden">{msg}</span>
                                <span className="hidden md:inline">{msg}</span>
                            </p>
                        </div>
                        <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
                            <button
                                type="button"
                                className="-mr-1 flex p-2 rounded-md hover:bg-color-500 focus:outline-none focus:ring-2 focus:ring-white"
                            >
                                <span className="sr-only">Schließen</span>
                                <XIcon className="h-6 w-6" onClick={hide} aria-hidden="true"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
