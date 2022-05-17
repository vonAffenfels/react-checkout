import React, {Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";

const FullPageLayout = ({show, onClose, children}) => (
    <Transition.Root show={show} as={Fragment}>
        <Dialog as="div" className="fixed inset-0" onClose={onClose}>
            <div className="absolute inset-0 bg-white bg-slate-50">
                <div className="fixed inset-y-0 right-0 flex max-w-full bg-gray-50">
                    {children}
                </div>
            </div>
        </Dialog>
    </Transition.Root>
);

export default FullPageLayout;
