const shippingRates = {
    Egypt: {
        Cairo: 5.99,
        Alex: 199.99,
        Giza: 9.99,
        default: 299.99
    },
    UAE: {
        AbuDhabi: 1999.99,
        Dubai: 2499.99,
        default: 2999.99
    },
    default: 0.00
};

function getShippingFee(country, state) {
    const countryRates = shippingRates[country];

    if (countryRates) {
        return countryRates[state] || countryRates.default || shippingRates.default;
    } else {
        return shippingRates.default;
    }
}

module.exports = { getShippingFee };
