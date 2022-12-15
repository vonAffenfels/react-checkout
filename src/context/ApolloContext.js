import React, {createContext, useState, useContext} from "react";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    HttpLink,
    // ApolloLink,
    from
} from "@apollo/client";
import BuyContext from "./BuyContext";

export const ApolloContext = createContext({});

export const ApolloContextProvider = ({children, uri}) => {
    const {storefrontApiKey} = useContext(BuyContext);

    const httpLink = new HttpLink({uri: uri});

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
        // link: from([httpLink]),
        uri: uri,
        headers: {
            "X-Shopify-Storefront-Access-Token": storefrontApiKey || ""
        }
    });

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
};

ApolloContext.ApolloContextProvider = ApolloContextProvider;
export default ApolloContext;
