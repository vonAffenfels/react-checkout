import React, {useContext} from "react";
import BuyContext from "../context/BuyContext";

const FullPageFooter = () => {
    const {texts} = useContext(BuyContext);

    if (!texts.fullPageFooter) {
        return null;
    }

    return (
        <div
            className="mt-16 pt-4 border-t border-gray-200 w-full flex justify-center space-x-8 items-center text-color-500 text-sm"
        >
            {texts.fullPageFooter}
        </div>
    );
}

export default FullPageFooter;
