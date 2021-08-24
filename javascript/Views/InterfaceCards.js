import {GOOGLE_MAP_API_KEY} from "../config.js";

class InterfaceCards {

    /**
     *
     * @param restaurants
     * @param container
     */
    constructor( restaurants, container ) {
        this.restaurants = restaurants
        this.controlsElt = {
            infosRestaurant: container
        }
    }

    displayCards() {
        this.controlsElt.infosRestaurant.empty()
        for (let i = 0; i < this.restaurants.length; i++) {
            this.controlsElt.infosRestaurant.append( this.createCard(this.restaurants[i]));
        }
    }

    /**
     *
     * @param {Object} restaurant
     * @returns {*|jQuery}
     */
    createCard(restaurant) {
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

        const restaurantCardRightRate = $("<div class='info-card-restaurant-rate'>Note : 4.2</div>")

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