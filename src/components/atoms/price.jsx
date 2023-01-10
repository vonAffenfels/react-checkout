import React from "react";

const Price = ({price}) => {
    if (!price && price !== 0) {
        return <>{"--"}</>;
    }

    price = parseFloat(price).toFixed(2);
    price = String(price).replace(",", ".").split(".");
    if (price.length === 1) {
        price.push("00");
    } else if ((price.length === 2) && (price[1].length === 1)) {
        price[1] = price[1] + "0";
    }

    return <>{price.join(".")}</>;
};

export default Price;
