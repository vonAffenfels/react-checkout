import React from "react";

const CloseButton = ({onClick}: {onClick: ((e: React.MouseEvent<HTMLButtonElement>) => {}) | undefined}) => (
    <div className="bg-opacity-50 flex justify-center items-center absolute top-0 right-0">
        <div className="px-16 py-14 rounded-md text-center">
            <button
                className="bg-color-500 px-4 py-2 rounded-md text-md text-white"
                onClick={onClick}
            >
                X
            </button>
        </div>
    </div>
);

export default CloseButton;
