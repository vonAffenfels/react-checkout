import React, {Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";

const FullPageLayout = ({show, onClose = () => {}, children}) => (
    <Transition.Root show={show} as={Fragment}>
        <Dialog as="div" onClose={onClose}>
            <div className="fixed inset-0 z-insane">
                <div className="absolute inset-0 bg-white bg-slate-50">
                    <div className="fixed inset-y-0 right-0 flex max-w-full bg-gray-50 overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </Dialog>
    </Transition.Root>
);

export default FullPageLayout;
