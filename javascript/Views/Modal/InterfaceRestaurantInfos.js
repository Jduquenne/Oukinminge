import {GOOGLE_MAP_API_KEY} from "../../config.js";
import {StringConvert} from "../../Utils/stringConvert.js";

class InterfaceRestaurantInfos {
    /**
     *
     * @param {*|jQuery} container
     * @param {function} onClickClose
     * @param {function} onClickAddRating
     */
    constructor(container, onClickClose, onClickAddRating) {
        this.controlsElt = {
            overlayContainer: container,
            closeModal: $('.overlay-restaurant-close'),
            infoCardRestaurant: $('.info-card-restaurant')
        }
        this.isOpen = false
        this.onClickClose = onClickClose
        this.onClickAddRating = onClickAddRating
    }

    setOpen() {
        this.isOpen = true
    }

    setClose() {
        this.isOpen = false
    }

    setHeightForRestaurantInfos() {
        this.controlsElt.overlayContainer.css({height: '250px'})
    }

    showModal() {
        if (!this.isOpen) {
            this.setHeightForRestaurantInfos()
            this.controlsElt.overlayContainer.css({top: '75px'})
            this.setOpen()
        }
    }

    hideModal() {
        if (this.isOpen) {
            this.controlsElt.overlayContainer.css({top: '-200px'})
            this.controlsElt.overlayContainer.empty()
            $('.info-card-restaurant').removeClass('active')
            this.setClose()
        }
    }

    /**
     *
     * @param {Restaurant} restaurant
     */
    updateRestaurantInfos(restaurant) {
        this.controlsElt.overlayContainer.empty()
        this.generateInfosRestaurant(restaurant)
    }

    /**
     *
     * @param {Restaurant} restaurant
     */
    generateModal(restaurant) {
        if (restaurant) {
            this.controlsElt.overlayContainer.empty()
            this.generateInfosRestaurant(restaurant)
        }
    }

    /**
     *
     * @param {Restaurant} restaurant
     */
    generateInfosRestaurant(restaurant) {
        const overlayRestaurantInfos = $("<div class='overlay-restaurant-infos'></div>")
        const overlayImgContainer = $("<div class='overlay-restaurant-img-container'></div>")
        if (restaurant.image) {
            const overlayImg = $(`<img src='${restaurant.image}' alt='${restaurant.name}'/>`)
            overlayImgContainer.append(overlayImg)
        } else {
            const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?location=${restaurant.lat},${restaurant.long}&size=250x250&key=${GOOGLE_MAP_API_KEY}`
            const overlayImg = $(`<img src='${streetViewUrl}' alt='${restaurant.name}'/>`)
            overlayImgContainer.append(overlayImg)
        }

        const overlayInfosContainer = $("<div class='overlay-restaurant-infos-container'></div>")
        const overlayInfosName = $(`<div class='overlay-restaurant-infos-name' title="${restaurant.name}">${StringConvert.prototype.substringString(StringConvert.prototype.capitalizeFirstLetter(restaurant.name), 35)}</div>`)


        const overlayInfosCoordContainer = $("<div class='overlay-restaurant-infos-coord-container'></div>")
        const overlayInfosCoord = $("<div class='overlay-restaurant-infos-coord'></div>")

        const overlayInfosCoordAdress = $(`<div class="overlay-restaurant-infos-coord-adress" title="${restaurant.adress}">${StringConvert.prototype.substringString(StringConvert.prototype.capitalizeFirstLetter(StringConvert.prototype.formatAdressConvert(restaurant.adress)), 50)}</div>`)
        if (restaurant.phone) {
            const overlayInfosCoordPhone = $(`<div class="overlay-restaurant-infos-coord-phone">${restaurant.phone}</div>`)
            overlayInfosCoord.append(overlayInfosCoordAdress, overlayInfosCoordPhone)
        } else {
            const overlayInfosCoordPhone = $(`<div class="overlay-restaurant-infos-coord-phone">Non renseign??</div>`)
            overlayInfosCoord.append(overlayInfosCoordAdress, overlayInfosCoordPhone)
        }

        overlayInfosCoordContainer.append(overlayInfosCoord)

        const overlayInfosRatingContainer = $("<div class='overlay-restaurant-infos-ratings-container'></div>")

        if (restaurant.ratings.length !== 0) {
            const overlayInfosRating = $(`<div class='overlay-restaurant-infos-average'>${restaurant.average}</div>`)

            const overlayInfosStarsContainer = $("<div class='overlay-restaurant-infos-stars-container'></div>")
            const overlayInfosStarsBack = $("<div class='overlay-restaurant-infos-stars-back'></div>")
            const overlayInfosStarsFront = $(`<div class='overlay-restaurant-infos-stars-front' style='width: ${restaurant.average * 20}%'></div>`)
            overlayInfosStarsContainer.append(overlayInfosStarsBack)
            overlayInfosStarsBack.append(overlayInfosStarsFront)
            for (let i = 0; i < 5; i++) {
                overlayInfosStarsBack.append($("<i class='fa fa-star' aria-hidden='true'></i>"))
                overlayInfosStarsFront.append($("<i class='fa fa-star' aria-hidden='true'></i>"))
            }
            const overlayInfosCommentLength = $(`<div class='overlay-restaurant-infos-comment'>${restaurant.ratings.length} avis</div>`)
            overlayInfosRatingContainer.append(overlayInfosRating, overlayInfosStarsContainer, overlayInfosCommentLength)
        } else {
            const overlayInfosCommentLength = $(`<div class='overlay-restaurant-infos-comment'>0 avis</div>`)
            overlayInfosRatingContainer.append(overlayInfosCommentLength)
        }

        const overlayInfosCommentAddRating = $(`<div class='overlay-restaurant-infos-comment-add-rating'>Donner son avis</div>`)
        overlayInfosCommentAddRating.on('click', this.onClickAddRating)

        const overlayInfosType = $(`<div class="overlay-restaurant-infos-type">${StringConvert.prototype.typeToString(restaurant)}</div>`)

        overlayInfosContainer.append(overlayInfosName, overlayInfosCoordContainer, overlayInfosRatingContainer, overlayInfosCommentAddRating, overlayInfosType)

        const overlayCloseModal = $('<div class="overlay-restaurant-close">X</div>')
        overlayCloseModal.on('click', () => {
            this.hideModal()
            this.onClickClose(restaurant)
        })
        if (restaurant.ratings) {
            overlayRestaurantInfos.append(overlayImgContainer, overlayInfosContainer, overlayCloseModal, this.generateComments(restaurant.ratings))
        } else {
            overlayRestaurantInfos.append(overlayImgContainer, overlayInfosContainer, overlayCloseModal, $("<div class='overlay-restaurant-comments-container'></div>"))
        }

        this.controlsElt.overlayContainer.append(overlayRestaurantInfos)
    }

    /**
     *
     * @param {Comment[]} ratings
     * @returns {*|Window.jQuery|HTMLElement}
     */
    generateComments(ratings) {
        const overlayCommentsContainer = $("<div class='overlay-restaurant-comments-container'></div>")

        const overlayCommentsTitle = $("<div class='overlay-restaurant-comments-title'>Commentaires</div>")
        overlayCommentsContainer.append(overlayCommentsTitle)
        // TODO A voir pour g??rer les milliers de commentaires d'un restaurant
        for (let i = 0; i < ratings.length; i++) {
            overlayCommentsContainer.append(this.generateOneComment(ratings[i]))
        }
        return overlayCommentsContainer
    }

    /**
     *
     * @param {Comment} rating
     * @returns {*|jQuery}
     */
    generateOneComment(rating) {
        if (rating) {
            const overlayComment = $("<div class='overlay-restaurant-comments'></div>")

            const overlayCommentTop = $("<div class='overlay-restaurant-comments-top'></div>")

            const overlayCommentTopName = $(`<div class='overlay-restaurant-comments-top-name'>${rating.commentator}</div>`)
            const overlayCommentTopRating = $(`<div class='overlay-restaurant-comments-top-rating'>${rating.stars} <i class='fa fa-star' aria-hidden='true'></i></div>`)

            overlayCommentTop.append(overlayCommentTopName, overlayCommentTopRating)

            const overlayCommentContent = $(`<div class='overlay-restaurant-comments-content' title="${rating.comment}">${rating.comment}</div>`)

            return overlayComment.append(overlayCommentTop, overlayCommentContent)
        }
    }
}

export {InterfaceRestaurantInfos}