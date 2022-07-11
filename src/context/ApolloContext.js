import React, {createContext, useState} from "react";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    HttpLink,
    ApolloLink,
    concat
} from "@apollo/client";

export const ApolloContext = createContext({});

export const ApolloContextProvider = ({children, uri}) => {
    const [requestInterceptors, setRequestInterceptors] = useState([]);
    const [responseInterceptors, setResponseInterceptors] = useState([]);

    const httpLink = new HttpLink({uri: uri});
    const middleware = new ApolloLink((operation, forward) => {
        console.log("requestInterceptors", requestInterceptors);
        return forward(operation);
    });
    const responseModifier = new ApolloLink((operation, forward) => {
        console.log("responseInterceptors", responseInterceptors);
        return forward(operation);
    });
    const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: concat(middleware, httpLink, responseModifier)
    });
    client.setRequestInterceptors = setRequestInterceptors;
    client.setResponseInterceptors = setResponseInterceptors;

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
};

ApolloContext.ApolloContextProvider = ApolloContextProvider;
export default ApolloContext;
