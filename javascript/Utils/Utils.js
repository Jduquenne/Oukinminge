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

    substringString(string, maxLength) {
        return string.slice(0, maxLength) + (string.length > maxLength ? "..." : "")
    }

    generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    async getPlaceIdWithLocation(location) {
        return new Promise((resolve, reject) => {
            let geocoder = new google.maps.Geocoder()

            const lat = location.latLng.lat();
            const long = location.latLng.lng();
            const latLng = {lat: lat, lng: long};

            geocoder.geocode({'location': latLng}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        resolve(results[1].place_id)
                        return results[1].place_id
                    } else {
                        reject('No results found')
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
        })
    }
}

export { Utils }