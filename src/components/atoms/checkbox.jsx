import React, {useState} from "react";

const Checkbox = ({label, id, onChange, checked}) => {
    return (
        <div className="relative flex items-start mb-10">
            <div className="flex h-5 items-center">
                <input
                    id={id}
                    name={id}
                    type="checkbox"
                    checked={checked}
                    className="h-4 w-4 rounded border-gray-500 text-color-600 focus:ring-indigo-500"
                    onChange={e => onChange(e.target.checked)}
                />
            </div>
            <div className="ml-3 text-sm">
                <label htmlFor={id} className="font-medium text-color-700">
                    {label}
                </label>
                <span id="candidates-description" className="text-color-500">
                    <span className="sr-only">{label}</span>
                </span>
            </div>
        </div>
    )
};

export {
    Checkbox
};
