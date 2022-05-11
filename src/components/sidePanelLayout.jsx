import React, {Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";

const SidePanelLayout = ({show, onClose, children}) => (
    <Transition.Root show={show} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
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

            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        {children}
                    </div>
                </div>
            </div>
        </Dialog>
    </Transition.Root>
);

export default SidePanelLayout;
