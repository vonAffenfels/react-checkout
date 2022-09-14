//takes a saleor addressinput as parameter
function transformCheckout(address) {
    return {
        address1: address.streetAddress1,
        address2: address.streetAddress2,
        city: address.city,
        company: address.companyName,
        country: address.country,
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
        province: address.countryArea,
        zip: address.postalCode,
    }
}

export default transformCheckout;
