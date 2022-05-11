import React, {Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";

const FullPageLayout = ({show, onClose, children}) => (
    <Transition.Root show={show} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={onClose}>
            <div className="absolute inset-0 overflow-hidden bg-white bg-slate-50">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                    {children}
                </div>
            </div>
        </Dialog>
    </Transition.Root>
);

export default FullPageLayout;
