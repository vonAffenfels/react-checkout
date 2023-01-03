import React, {createContext, useState, useContext} from "react";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    HttpLink,
    ApolloLink,
} from "@apollo/client";
import {onError} from "@apollo/client/link/error";
import BuyContext from "./BuyContext";

export const ApolloContext = createContext({});

export const ApolloContextProvider = ({children, uri}) => {
    const {storefrontApiKey} = useContext(BuyContext);

    const errorLink = onError((errorResponse) => {
        const {graphQLErrors, networkError} = errorResponse;
        console.log("graphQL errorResponse", errorResponse);
    });
    const httpLink = new HttpLink({
        uri: uri,
        headers: {
            "X-Shopify-Storefront-Access-Token": storefrontApiKey || ""
        }
    });

    const client = new ApolloClient({
        cache: new InMemoryCache(),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: "no-cache",
                errorPolicy: "ignore",
            },
            query: {
                fetchPolicy: "no-cache",
                errorPolicy: "all",
            }
        },
        link: ApolloLink.from([errorLink, httpLink]),
    });

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
};

ApolloContext.ApolloContextProvider = ApolloContextProvider;
export default ApolloContext;
