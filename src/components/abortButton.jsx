import React from "react";
import {ArrowUturnLeft} from "./atoms/icons.jsx";

const AbortButton = ({onClick}) => (
    <div className="bg-opacity-50 flex justify-center items-center absolute top-0 left-0">
        <div className="px-16 py-14 rounded-md text-center">
            <button
                className="bg-color-500 px-4 py-2 rounded-md text-md text-white"
                onClick={onClick || null}
            >
                <ArrowUturnLeft />
            </button>
        </div>
    </div>
);

export default AbortButton;
