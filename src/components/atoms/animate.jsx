import React, {Fragment} from "react";
import {RadioGroup} from "@headlessui/react";

const Spin = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-bg-color-600" xmlns="http://www.w3.org/2000/svg" fill="none"
         viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
    </svg>
);

const Item = () => (
    <li className="flex py-6 animate-pulse">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
            <img className="h-full w-full object-cover object-center rounded-md bg-gray-300"/>
        </div>

        <div className="ml-4 flex flex-1 flex-col">
            <div>
                <div className="flex justify-between text-base font-medium text-color-900 rounded-md bg-gray-300 px-2">
                    <h3><a>...</a></h3>
                    <p className="ml-4">...</p>
                </div>
                <p className="mt-1 text-sm text-color-500 rounded-md bg-gray-300 px-2">...</p>
            </div>
            <div className="flex flex-1 items-end justify-between text-sm">
                <p className="text-color-500 rounded-md bg-gray-300 px-2">...</p>
            </div>
        </div>
    </li>
);

const LoadingOption = () => (
    <RadioGroup.Option
        disabled={true}
        className="relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none animate-pulse"
    >
        <span className="flex-1 flex">
            <span className="flex flex-col">
                <RadioGroup.Label as="span" className="block text-sm font-medium text-color-900 rounded-md bg-gray-300 px-2">
                    ...
                </RadioGroup.Label>
                <RadioGroup.Description
                    as="span"
                    className="mt-1 flex items-center text-sm text-color-500 rounded-md bg-gray-300 px-2"
                >
                    ...
                </RadioGroup.Description>
                <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-color-900 rounded-md bg-gray-300 px-2">
                    ...
                </RadioGroup.Description>
            </span>
        </span>
        <span
            className="absolute -inset-px rounded-lg pointer-events-none"
            aria-hidden="true"
        />
    </RadioGroup.Option>
);

const ButtonBlue = ({text}) => (
    <button
        disabled
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
    >
        <svg role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
            />
            <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
            />
        </svg>
        {text || "Loading..."}
    </button>
);

const Button = ({text}) => (
    <button
        disabled
        type="button"
        className="py-2.5 px-5 mr-2 text-sm font-medium text-color-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-50 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-color-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
    >
        <svg role="status" className="inline w-4 h-4 mr-2 text-color-200 animate-spin dark:text-color-600"
             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"/>
            <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#1C64F2"/>
        </svg>
        {text || "Loading..."}
    </button>
);

export {
    Spin,
    Item,
    LoadingOption,
    ButtonBlue,
    Button,
};
