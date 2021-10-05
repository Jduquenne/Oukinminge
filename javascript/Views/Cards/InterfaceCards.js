import { GOOGLE_MAP_API_KEY } from "../../config.js";
import {Utils} from "../../Utils/Utils.js";

class InterfaceCards {

    /**
     *
     * @param {*|jQuery} container
     * @param {Function} onCardClick
     * @param {Function} onCardHover
     */
    constructor( container, onCardClick = null, onCardHover = null ) {
        this.onCardClick = onCardClick
        this.onCardHover = onCardHover
        this.controlsElt = {
            infosRestaurant: container
        }
    }

    displayCards(restaurants) {
        this.controlsElt.infosRestaurant.empty()
        for (let i = 0; i < restaurants.length; i++) {
            this.controlsElt.infosRestaurant.append( this.createCard(restaurants[i]));
        }
    }

    setSelectedCard(restaurant) {
        $(restaurant.card).addClass('active').siblings('.info-card-restaurant').removeClass('active')
    }

    removeActiveAllCards() {
        $('.info-card-restaurant').removeClass('active')
    }

    /**
     *
     * @param {Object} restaurant
     * @returns {*|jQuery}
     */
    createCard(restaurant) {
        const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?location=${restaurant.lat},${restaurant.long}&size=250x250&key=${GOOGLE_MAP_API_KEY}`

        const restaurantCard = $(`<div class='info-card-restaurant'></div>`)

        restaurantCard.on("click", () => {
            this.onCardClick(restaurant)
        })

        const restaurantCardLeft = $("<div class='info-card-restaurant-left'></div>")
        const restaurantCardLeftImg = $(`<img src='${streetViewUrl}' alt='${restaurant.name}'/>`)
        restaurantCardLeft.append(restaurantCardLeftImg)

        const restaurantCardRight = $("<div class='info-card-restaurant-right'></div>")

        const restaurantCardRightMain = $("<div class='info-card-restaurant-main'></div>")
        const restaurantCardRightMainName = $(`<div class='info-card-restaurant-name'>${Utils.prototype.capitalizeFirstLetter(restaurant.name)}</div>`)
        const restaurantCardRightMainAdress = $(`<div class='info-card-restaurant-adress'>${Utils.prototype.formatAdressConvert(restaurant.adress)}</div>`)
        restaurantCardRightMain.append(restaurantCardRightMainName, restaurantCardRightMainAdress)

        if (restaurant.ratings.length !== 0) {
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
        } else {
            const restaurantCardRightRatingContainer = $("<div class='info-card-restaurant-rate-container'></div>")

            const restaurantCardRightRating = $(`<div class='info-card-restaurant-rate'>Pas encore noté</div>`)

            restaurantCardRightRatingContainer.append(restaurantCardRightRating)

            restaurantCardRight.append(restaurantCardRightMain, restaurantCardRightRatingContainer)
        }
        restaurantCard.append(restaurantCardLeft, restaurantCardRight)
        return restaurant.card = restaurantCard
    }
}

export { InterfaceCards }