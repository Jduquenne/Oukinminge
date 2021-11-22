import { GOOGLE_MAP_API_KEY } from "../../config.js";
import {StringConvert} from "../../Utils/stringConvert.js";

class InterfaceCards {

    /**
     *
     * @param { *|jQuery } container
     * @param { Function } onCardClick
     */
    constructor( container, onCardClick = null ) {
        this.onCardClick = onCardClick
        this.controlsElt = {
            infosRestaurant: container
        }
    }

    /**
     *
     * @param {Restaurant[]} restaurants
     * @returns {Promise<void>}
     */
    async displayCards(restaurants) {
        this.controlsElt.infosRestaurant.empty()
        if (restaurants.length !== 0) {
            for (let i = 0; i < restaurants.length; i++) {
                this.controlsElt.infosRestaurant.append( this.createCard(restaurants[i]));
            }
        } else {
            this.controlsElt.infosRestaurant.append( this.createNoRestaurantFound )
        }
    }

    /**
     *
     * @param {Restaurant} restaurant
     */
    setSelectedCard(restaurant) {
        $(restaurant.card).addClass('active').siblings('.info-card-restaurant').removeClass('active')
    }

    removeActiveAllCards() {
        $('.info-card-restaurant').removeClass('active')
    }


    /**
     *
     * @param {Restaurant} restaurant
     * @returns {*|jQuery}
     */
    createCard(restaurant) {
        restaurant.cardImage = `https://maps.googleapis.com/maps/api/streetview?location=${restaurant.lat},${restaurant.long}&size=250x250&key=${GOOGLE_MAP_API_KEY}`

        const restaurantCard = $(`<div class='info-card-restaurant'></div>`)

        restaurantCard.on("click", () => {
            this.onCardClick(restaurant)
        })

        const restaurantCardLeft = $("<div class='info-card-restaurant-left'></div>")
        const restaurantCardLeftImg = $(`<img src='${restaurant.cardImage}' alt='${restaurant.name}'/>`)
        restaurantCardLeft.append(restaurantCardLeftImg)

        const restaurantCardRight = $("<div class='info-card-restaurant-right'></div>")

        const restaurantCardRightMain = $("<div class='info-card-restaurant-main'></div>")
        const restaurantCardRightMainName = $(`<div class='info-card-restaurant-name'>${StringConvert.prototype.substringString(StringConvert.prototype.capitalizeFirstLetter(restaurant.name), 19)}</div>`)
        const restaurantCardRightMainAdress = $(`<div class='info-card-restaurant-adress'>${StringConvert.prototype.substringString(StringConvert.prototype.capitalizeFirstLetter(restaurant.adress), 50)}</div>`)
        restaurantCardRightMain.append(restaurantCardRightMainName, restaurantCardRightMainAdress)

        if (restaurant.ratings.length !== 0 || restaurant.average !== null) {
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

    createNoRestaurantFound() {
        const cardEmptyRestaurant = $(`<div class='info-card-restaurant-empty'></div>`)
        const cardEmptyRestaurantText = $(`<div class='info-card-restaurant-empty-text'>Aucun résultat ...</div>`)
        return cardEmptyRestaurant.append(cardEmptyRestaurantText)
    }
}

export { InterfaceCards }