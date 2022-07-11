import React, {Fragment, useEffect} from "react";
import {Dialog, Transition} from "@headlessui/react";

const SidePanelLayout = ({show, onClose, children}) => {

    return (
        <Transition
            show={show}
            as={"div"}
            beforeLeave={() => console.log("beforeLeave")}
            afterLeave={() => console.log("afterLeave")}
        >
            <Dialog className="relative z-10" onClose={onClose} open={show}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-500"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-500"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                >
                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                {children}
                            </div>
                        </div>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}

export default SidePanelLayout;
