import React from "react";

const PaymentMethodOption = ({paymentMethod, onChange}) => {

    return (
        <div key={paymentMethod.id} className="flex items-center">
            <input
                id={paymentMethod.id}
                name="payment-type"
                type="radio"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                onChange={onChange}
            />

            <label htmlFor={paymentMethod.id} className="ml-3 block text-sm font-medium text-gray-700">
                {paymentMethod.title}
            </label>
        </div>
    );
};

export default PaymentMethodOption;
