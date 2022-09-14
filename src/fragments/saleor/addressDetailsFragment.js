import {gql} from "@apollo/client";

export default gql`
    fragment AddressDetailsFragment on Address {
        id
        phone
        firstName
        lastName
        streetAddress1
        streetAddress2
        city
        postalCode
        isDefaultBillingAddress
        isDefaultShippingAddress
        companyName
        countryArea
        country {
            code
            country
        }
    }
`;
