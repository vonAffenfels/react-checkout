import {createContext} from "react";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache
} from "@apollo/client";

export const ApolloContext = createContext({});

export const ApolloContextProvider = ({children, uri}) => {
    if (!uri) {
        throw new Error("no uri provided in ApolloContext");
    }

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
