import React from "react";

const Price = ({price}: {price: string | number | undefined}) => {
    if (!price && price !== 0) {
        return <>{"--"}</>;
    }

    price = parseFloat(String(price)).toFixed(2);
    const priceParts = String(price).replace(",", ".").split(".");
    if (priceParts.length === 1) {
        priceParts.push("00");
    } else if ((priceParts.length === 2) && (priceParts[1].length === 1)) {
        priceParts[1] = price[1] + "0";
    }

    return <>{priceParts.join(",")}</>;
};

export default Price;
