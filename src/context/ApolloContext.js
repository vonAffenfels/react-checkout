import React, {createContext, useState} from "react";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    HttpLink,
    ApolloLink,
    from
} from "@apollo/client";

export const ApolloContext = createContext({});

export const ApolloContextProvider = ({children, uri}) => {
    const [requestInterceptor, setRequestInterceptor] = useState(null);
    const [responseInterceptor, setResponseInterceptor] = useState(null);

    const httpLink = new HttpLink({uri: uri});
    const middleware = new ApolloLink((operation, forward) => {
        console.log("requestInterceptor", requestInterceptor);
        requestInterceptor?.();
        return forward(operation);
    });
    const responseModifier = new ApolloLink((operation, forward) => {
        console.log("responseInterceptor", responseInterceptor);
        responseInterceptor?.();
        return forward(operation);
    });
    const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: from([middleware, httpLink, responseModifier])
    });
    client.setRequestInterceptor = setRequestInterceptor;
    client.requestInterceptor = requestInterceptor;
    client.setResponseInterceptor = setResponseInterceptor;
    client.responseInterceptor = responseInterceptor;

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
};

ApolloContext.ApolloContextProvider = ApolloContextProvider;
export default ApolloContext;
