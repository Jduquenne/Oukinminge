import { GOOGLE_MAP_API_KEY } from "../config.js";

class InterfaceCards {

    /**
     *
     * @param {[Object]} restaurants
     * @param {*|jQuery} container
     * @param {Function} onCardClick
     */
    constructor( restaurants, container, onCardClick = null ) {
        this.restaurants = restaurants
        this.onCardClick = onCardClick
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

        restaurantCard.on("click", () => {
            this.onCardClick(restaurant)
        })

        const restaurantCardLeft = $("<div class='info-card-restaurant-left'></div>")
        const restaurantCardLeftImg = $(`<img src='${streetViewUrl}' alt='${restaurant.name}'/>`)
        restaurantCardLeft.append(restaurantCardLeftImg)

        const restaurantCardRight = $("<div class='info-card-restaurant-right'></div>")

        const restaurantCardRightMain = $("<div class='info-card-restaurant-main'></div>")
        const restaurantCardRightMainName = $(`<div class='info-card-restaurant-name'>${restaurant.name}</div>`)
        const restaurantCardRightMainAdress = $(`<div class='info-card-restaurant-adress'>${this.formatAdressConvert(restaurant.adress)}</div>`)
        restaurantCardRightMain.append(restaurantCardRightMainName, restaurantCardRightMainAdress)

        const restaurantCardRightRatingContainer = $("<div class='info-card-restaurant-rate-container'></div>")

        const restaurantCardRightRating = $(`<div class='info-card-restaurant-rate'>${restaurant.average}</div>`)

        const restaurantCardRightStarsContainer = $("<div class='info-card-restaurant-rate-stars-container'></div>")
        const restaurantCardRightStarsBack = $("<div class='info-card-restaurant-rate-stars-back'></div>")
        const restaurantCardRightStarsFront = $(`<div class='info-card-restaurant-rate-stars-front' style='width: ${restaurant.average * 20}%'></div>`)

        restaurantCardRightStarsContainer.append(restaurantCardRightStarsBack)
        restaurantCardRightStarsBack.append(restaurantCardRightStarsFront)

        for (let i = 0; i < 5; i++) {
            restaurantCardRightStarsBack.append($("<i class='fa fa-star' aria-hidden='true'></i>"))
            restaurantCardRightStarsFront.append($("<i class='fa fa-star' aria-hidden='true'></i>"))
        }

        restaurantCardRightRatingContainer.append(restaurantCardRightRating, restaurantCardRightStarsContainer)

        restaurantCardRight.append(restaurantCardRightMain, restaurantCardRightRatingContainer)

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