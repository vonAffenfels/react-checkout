import React from "react";

export type MultipassPayload = {
    email: string;
    return_to: string;
};

const useMultiLogin = (multipassUri: string) => {
    return async ({ body }: { body: MultipassPayload }) => {
        const { token, url } = await doMultiLogin(multipassUri, JSON.stringify(body));

        return { token, url };
    };
};

async function doMultiLogin(multipassUri: string, body: string) {
    return fetch(multipassUri, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: body,
    }).then((res) => res.json());
}

export default useMultiLogin;
