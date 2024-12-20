import CheckoutDetailsFragment from "../../fragments/shopify/checkoutDetailsFragment";

export default `
    ${CheckoutDetailsFragment}
    query Checkout($checkoutToken:ID!, $country: CountryCode) @inContext(country: $country) {
        node(id:$checkoutToken) {
            id
            ... on Checkout {
                ...CheckoutDetailsFragment
            }
        }
    }
`;
