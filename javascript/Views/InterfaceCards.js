import {GOOGLE_MAP_API_KEY} from "../config.js";

class InterfaceCards {

    /**
     *
     * @param {Array} restaurantsInfos
     */
    constructor( restaurantsInfos ) {
        this.restaurantsInfos = restaurantsInfos
        this.controlsElt = {
            infosRestaurant: $('.infos-restaurant')
        }
    }

    displayCards() {
        this.controlsElt.infosRestaurant.empty()
        for (let i = 0; i < this.restaurantsInfos.length; i++) {
            this.controlsElt.infosRestaurant.append( this.generateOneCard(this.restaurantsInfos[i]));
        }
    }

    /**
     *
     * @param {Object} restaurant
     * @returns {*|jQuery}
     */
    generateOneCard(restaurant) {
        const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?location=${restaurant.lat},${restaurant.long}&size=250x250&key=${GOOGLE_MAP_API_KEY}`

        const restaurantCard = $("<div class='info-card-restaurant'></div>")

        const restaurantCardLeft = $("<div class='info-card-restaurant-left'></div>")
        const restaurantCardLeftImg = $(`<img src='${streetViewUrl}' alt='${restaurant.name}'/>`)
        restaurantCardLeft.append(restaurantCardLeftImg)

        const restaurantCardRight = $("<div class='info-card-restaurant-right'></div>")

        const restaurantCardRightMain = $("<div class='info-card-restaurant-main'></div>")
        const restaurantCardRightMainName = $(`<div class='info-card-restaurant-name'>${restaurant.name}</div>`)
        const restaurantCardRightMainAdress = $(`<div class='info-card-restaurant-adress'>${this.formatAdressConvert(restaurant.adress)}</div>`)
        restaurantCardRightMain.append(restaurantCardRightMainName, restaurantCardRightMainAdress)

        const restaurantCardRightRate = $("<div class='info-card-restaurant-rate'>*****</div>")

        restaurantCardRight.append(restaurantCardRightMain, restaurantCardRightRate)

        return restaurantCard.append(restaurantCardLeft, restaurantCardRight)
    }

    /**
     *
     * @param {string} adress
     * @returns {string}
     */
    formatAdressConvert(adress) {
        adress = adress.replace(',', ',<br/>')
        return adress
    }
}

export { InterfaceCards }