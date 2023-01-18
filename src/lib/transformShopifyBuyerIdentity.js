function transformBuyerIdentity(address, email) {
    const updatedAddress = {
        countryCode: address.country,
        deliveryAddressPreferences: {
            deliveryAddress: {
                address1: address.streetAddress1,
                address2: address.streetAddress2,
                city: address.city,
                company: address.companyName,
                country: address.country,
                firstName: address.firstName,
                lastName: address.lastName,
                province: address.countryArea,
                zip: address.postalCode,
            }
        },
    };

    if (email) {
        updatedAddress.email = email;
    }
    if (address.streetAddress2) {
        updatedAddress.deliveryAddressPreferences[0].deliveryAddress.address2 = address.streetAddress2;
    }
    if (address.province) {
        updatedAddress.deliveryAddressPreferences[0].deliveryAddress.province = address.province;
    }

    return updatedAddress;
}

export default transformBuyerIdentity;
