import React, {useState, useEffect} from "react";
import {SpeakerphoneIcon, XIcon} from "@heroicons/react/outline";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Banner({msg, isError}) {
    const [show, setShow] = useState(true);

    const hide = () => setShow(false);

    if (!show) {
        return null;
    }

    return (
        <div className="fixed top-10 inset-x-0 pb-2 sm:pb-5">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
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
                        <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                            <a className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50">
                                Details
                            </a>
                        </div>
                        <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
                            <button
                                type="button"
                                className="-mr-1 flex p-2 rounded-md hover:bg-color-500 focus:outline-none focus:ring-2 focus:ring-white"
                            >
                                <span className="sr-only">Schließen</span>
                                <XIcon className="h-6 w-6 text-white" onClick={hide} aria-hidden="true"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
