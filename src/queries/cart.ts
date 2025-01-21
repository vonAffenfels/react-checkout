import CartDetailsFragment from "../fragments/cartDetailsFragment";

export default `
    ${CartDetailsFragment}
    query Cart($cartId:ID!, $country: CountryCode, $linesCount: Int!) @inContext(country: $country) {
        cart(id: $cartId) {
            id
            ...CartDetailsFragment
        }
    }
`;
