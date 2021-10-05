class Utils {
    typeToString(restaurant) {
        let typeOfRestaurantToString = ""
        for (let i = 0; i < restaurant.type.length; i++) {
            if (restaurant.type[i] === restaurant.type[restaurant.type.length - 1]) {
                typeOfRestaurantToString += restaurant.type[i]
            } else {
                typeOfRestaurantToString += restaurant.type[i] + ", "
            }
        }
        return typeOfRestaurantToString
    }

    /**
     *
     * @param {string} adress
     * @returns {string}
     */
    formatAdressConvert(adress) {
        adress = adress.replace(',', ',<br/>')
        return adress.charAt(0).toUpperCase() + adress.slice(1);
    }
    /**
     *
     * @param {string} string
     * @returns {string}
     */
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

export { Utils }