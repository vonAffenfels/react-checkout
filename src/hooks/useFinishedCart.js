import React from "react";

const useFinishedCart = (cartUri) => {
    return async ({cartToken}) => {
        if (!cartToken || !cartUri) {
            return null;
        }

        const cleanToken = cartToken.split("-").pop();
        const {order} = await fetch(cartUri + "?cartToken=" + cleanToken, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "f23c4204c880f1a99598a8c980fe021d6a40dba25330511b72692478965831c8"
            },
        }).then(res => res.json());

        return order;
    };
}

export default useFinishedCart;
