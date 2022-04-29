import {createContext} from "react";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache
} from "@apollo/client";

export const ApolloContext = createContext({});

export const ApolloContextProvider = ({children, uri}) => {
    const client = new ApolloClient({
        uri: uri,
        cache: new InMemoryCache()
    });

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
};

ApolloContext.ApolloContextProvider = ApolloContextProvider;
export default ApolloContext;
