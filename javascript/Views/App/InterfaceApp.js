import { InterfaceMap } from "../Map/InterfaceMap.js";
import { InterfaceCards } from "../Cards/InterfaceCards.js";
import { InterfaceSearchbar } from "../Searchbar/InterfaceSearchbar.js";
import { InterfaceRestaurantInfos } from "../Modal/InterfaceRestaurantInfos.js";
import { InterfaceAddRestaurant } from "../Modal/InterfaceAddRestaurant.js";
import { InterfaceCustomSelect } from "../CustomSelect/InterfaceCustomSelect.js";
import { RestaurantRepository } from "../../Repository/RestaurantRepository.js";
import { Restaurant } from "../../Models/Restaurant.js";
import {InterfaceAddButtonRestaurant} from "../ButtonAddRestaurant/InterfaceAddButtonRestaurant.js";
import {InterfaceAddComment} from "../Modal/InterfaceAddComment.js";
import {Utils} from "../../Utils/Utils.js";

class InterfaceApp {
    /**
     *
     * @param {RestaurantRepository} restaurantsRepository
     */
    constructor( restaurantsRepository) {
        this.restaurantsRepository = restaurantsRepository;
        this.restaurants = []

        this.defaultMapParams = {
            container: document.querySelector('#map'),
            // Bailleul position
            position: new window.google.maps.LatLng(50.739089888666605, 2.7346596096724562),
            zoom: 16,
            mapId: 'cce82df13239a86c',
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        }

        this.controlElt = {
            searchbarInput: document.getElementById('input-search'),
            infosRestaurant: $('.infos-restaurant'),
            addComment: $('.overlay-add-comment-container'),
            overlayContainer:  $('.overlay-container'),
            customRating:  $( ".selectRating" ),
            main: $( ".main" ),
        }
        this.restaurantSelected = null
        this.locationSave = null

        this.interfaceMap = new InterfaceMap(
            this.defaultMapParams,
            (restaurant) => this.displayModalWithPanTo(restaurant),
            (position) => this.displayAddRestaurantForm(position)
        )
        this.interfaceCards = new InterfaceCards(this.controlElt.infosRestaurant, (restaurant) => this.displayModalWithPanTo(restaurant))
        this.interfaceSearchbar = new InterfaceSearchbar(this.interfaceMap.map, this.controlElt.searchbarInput)
        this.interfaceCustomSelect = new InterfaceCustomSelect(this.controlElt.customRating, (value)=>this.displayRestaurantsByRating(value))
        this.interfaceRestaurantInfos = new InterfaceRestaurantInfos(this.controlElt.overlayContainer, () => this.setMarkerAnimationNull(), () => this.displayAddCommentForm())
        this.interfaceAddRestaurant = new InterfaceAddRestaurant(
            this.controlElt.overlayContainer,
            () => this.resetMarkerCreateAndAddRestaurantForm(),
            () => this.addRestaurant()
        )
        this.interfaceAddButtonRestaurant = new InterfaceAddButtonRestaurant(
            this.controlElt.main,
            () => this.displayAddRestaurantInstructions(),
            () => this.resetMarkerCreateAndAddRestaurantForm(),
            () => this.resetAddRestaurantInstructions()
        )
        this.interfaceAddComment = new InterfaceAddComment(
            this.controlElt.addComment,
            () => this.addCommentForRestaurant(this.restaurantSelected)
        )
    }

    async displayApp() {
        this.restaurants = await this.restaurantsRepository.findRestaurants()
        await this.interfaceMap.initMap(this.restaurants)
        this.interfaceCards.displayCards(this.restaurants)
        this.interfaceSearchbar.initSearchBoxAutocomplete()
        this.interfaceAddButtonRestaurant.displayAddButtonRestaurant()
        this.interfaceAddComment.generateAddCommentForm()
    }

    displayModalWithPanTo (restaurant) {
        this.restaurantSelected = restaurant
        console.log(this.restaurantSelected)
        if (this.interfaceAddComment.isOpen) {
            this.interfaceAddComment.resetModal()
        }
        if (this.interfaceAddButtonRestaurant.btnState === 2) {
            this.interfaceMap.markers[this.interfaceMap.markers.length - 1].setMap(null);
        }
        this.interfaceMap.removeMapListener()
        this.interfaceAddButtonRestaurant.setButtonOpenInstruction()

        this.interfaceRestaurantInfos.setHeightForRestaurantInfos()
        this.interfaceRestaurantInfos.generateModal(restaurant)
        this.interfaceRestaurantInfos.showModal()
        if (this.interfaceMap.markerSelected) {
            this.interfaceMap.markerSelected.setAnimation(null);
        }
        this.interfaceMap.markerSelected = restaurant.marker;
        restaurant.marker.setAnimation(google.maps.Animation.BOUNCE);

        this.interfaceCards.setSelectedCard(restaurant)

        this.interfaceMap.setCenterTo(restaurant);
        this.interfaceMap.setZoom(18)
    }

    async displayRestaurantsByRating(value) {
        if (this.interfaceAddButtonRestaurant.btnState === 2) {
            this.interfaceMap.markers[this.interfaceMap.markers.length - 1].setMap(null);
        }
        this.interfaceMap.removeMapListener()
        this.interfaceAddButtonRestaurant.setButtonOpenInstruction()

        if (this.interfaceAddRestaurant.isOpen === true) {
            this.interfaceAddRestaurant.hideModal()
        } else if (this.interfaceRestaurantInfos.isOpen === true){
            this.interfaceRestaurantInfos.hideModal()
        }
        this.restaurants = await this.restaurantsRepository.findRestaurants(value,this.interfaceCustomSelect.maxRating);
        this.interfaceMap.displayMarkers(this.restaurants);
        this.interfaceCards.displayCards(this.restaurants);
        this.interfaceMap.setZoom(17)
        this.interfaceMap.setCenterTo(this.restaurants[0]);
    }

    displayAddRestaurantInstructions() {
        this.setMarkerAnimationNull()
        this.interfaceRestaurantInfos.setClose()
        this.interfaceCards.removeActiveAllCards()
        this.interfaceAddRestaurant.setHeightForAddRestaurant()

        this.interfaceAddRestaurant.controlsElt.overlayContainer.empty()
        this.interfaceAddRestaurant.generateInstructions()
        this.interfaceAddRestaurant.showModal()
        this.interfaceMap.setMapListener()

        this.interfaceAddButtonRestaurant.setButtonHideInstruction()
    }

    displayAddRestaurantForm(position) {
        console.log(this.restaurantSelected)
        this.locationSave = position
        this.interfaceAddRestaurant.controlsElt.overlayContainer.empty()
        this.interfaceAddRestaurant.generateAddForm()
        this.interfaceAddRestaurant.showModal()

        this.interfaceAddButtonRestaurant.setButtonHideAddRestaurantForm()
    }

    displayAddCommentForm() {
        console.log(this.restaurantSelected)
        this.interfaceAddComment.controlsElt.overlayCommentContainer.empty()
        this.interfaceAddComment.generateAddCommentForm()
        this.interfaceAddComment.showModal()
    }

    resetMarkerCreateAndAddRestaurantForm() {
        console.log(this.restaurantSelected)
        this.locationSave = null
        this.interfaceMap.markers[this.interfaceMap.markers.length - 1].setMap(null);
        this.interfaceAddRestaurant.controlsElt.overlayContainer.empty()
        this.interfaceAddRestaurant.hideModal()
        this.interfaceMap.removeMapListener()

        this.interfaceAddButtonRestaurant.setButtonOpenInstruction()
    }

    resetAddRestaurantInstructions() {
        console.log(this.restaurantSelected)
        this.restaurantSelected = null
        this.interfaceAddRestaurant.controlsElt.overlayContainer.empty()
        this.interfaceAddRestaurant.hideModal()
        this.interfaceMap.removeMapListener()

        this.interfaceAddButtonRestaurant.setButtonOpenInstruction()
    }

    async addRestaurant() {
        const newRestaurant = new Restaurant(
            $('#restaurantName').val(),
            `${$('#restaurantStreet').val()},
             ${$('#restaurantZipCode').val()} ${Utils.prototype.capitalizeFirstLetter($('#restaurantTown').val())}`,
            $('#restaurantPhone').val(),
            this.locationSave.latLng.lat(),
            this.locationSave.latLng.lng(),
            ['Restaurant'],
            []
        )
        this.restaurantsRepository.addInMemoryRestaurant(newRestaurant)
        this.restaurants = await this.restaurantsRepository.findRestaurants()

        this.interfaceAddRestaurant.hideModal()
        this.interfaceAddButtonRestaurant.setButtonOpenInstruction()

        this.interfaceMap.displayMarkers(this.restaurants);
        this.interfaceCards.displayCards(this.restaurants);
        this.interfaceMap.setZoom(17)
        this.interfaceMap.setCenterTo(this.restaurants[0]);
    }

    async addCommentForRestaurant(restaurant) {
        const comment = {
            comment: Utils.prototype.capitalizeFirstLetter($('#commentTextArea').val()),
            commentator: Utils.prototype.capitalizeFirstLetter($('#commentator').val()),
            stars: parseInt($('#commentRating option:selected').val())
        }
        restaurant.ratings.unshift(comment)

        restaurant.average = restaurant.getAverageRating(restaurant.ratings)
        this.interfaceCards.displayCards(this.restaurants)
        this.interfaceRestaurantInfos.updateRestaurantInfos(restaurant)
        this.interfaceCards.setSelectedCard(restaurant)
        this.interfaceAddComment.hideModal()
    }

    setMarkerAnimationNull() {
        if (this.interfaceMap.markerSelected) {
            this.restaurantSelected = null
            console.log(this.restaurantSelected)
            this.interfaceMap.markerSelected.setAnimation(null);
            this.interfaceMap.setZoom(17)
            this.interfaceAddComment.resetModal()
        }
    }
}

export { InterfaceApp }