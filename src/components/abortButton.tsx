import React from "react";
import {ArrowUturnLeft} from "./atoms/icons.js";

const AbortButton = ({onClick}: {onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void}) => (
    <div className="bg-opacity-50 flex justify-center items-center absolute top-0 left-0">
        <div className="px-16 py-14 rounded-md text-center">
            <button
                className="bg-color-500 px-4 py-2 rounded-md text-md text-white"
                onClick={onClick}
            >
                <ArrowUturnLeft />
            </button>
        </div>
    </div>
);

export default AbortButton;
