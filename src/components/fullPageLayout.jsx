import React, {Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";

const FullPageLayout = ({show, onClose, children}) => (
    <Transition.Root show={show} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
            <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-50">
                <div className="flex min-h-full items-center justify-center">
                    {children}
                </div>
            </div>
        </Dialog>
    </Transition.Root>
);

export default FullPageLayout;
