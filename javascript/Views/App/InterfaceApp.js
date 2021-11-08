import { InterfaceMap } from "../Map/InterfaceMap.js";
import { InterfaceCards } from "../Cards/InterfaceCards.js";
import { InterfaceSearchbar } from "../Searchbar/InterfaceSearchbar.js";
import { InterfaceRestaurantInfos } from "../Modal/InterfaceRestaurantInfos.js";
import { InterfaceAddRestaurant } from "../Modal/InterfaceAddRestaurant.js";
import { ALL_RESTAURANTS, InterfaceCustomSelect} from "../CustomSelect/InterfaceCustomSelect.js";
import { RestaurantRepository } from "../../Repository/RestaurantRepository.js";
import { Restaurant } from "../../Models/Restaurant.js";
import {Comment} from "../../Models/Comment.js";
import {InterfaceAddButtonRestaurant} from "../ButtonAddRestaurant/InterfaceAddButtonRestaurant.js";
import {InterfaceAddComment} from "../Modal/InterfaceAddComment.js";
import {Utils} from "../../Utils/Utils.js";


class InterfaceApp {
    /**
     *
     * @param {RestaurantRepository|RestaurantPlacesRepository} restaurantsRepository
     */
    constructor( restaurantsRepository) {
        this.restaurantsRepository = restaurantsRepository;
        this.restaurants = []
        this.restaurantsFilter = []
        this.restaurantSelected = null
        this.locationSave = null

        this.defaultMapParams = {
            container: document.querySelector('#map'),
            center: new window.google.maps.LatLng( 48.864716, 2.349014),
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


        this.interfaceMap = new InterfaceMap(
            this.defaultMapParams,
            (restaurant) => this.displayRestaurantInfosWithPanTo(restaurant),
            (position) => this.displayAddRestaurantForm(position)
        )
        this.interfaceCards = new InterfaceCards(this.controlElt.infosRestaurant, (restaurant) => this.displayRestaurantInfosWithPanTo(restaurant))
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
        if (navigator.geolocation) {
            this.interfaceMap.getCurrentPosition().then(async (position) => {
                this.interfaceMap.map.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
                await this.findRestaurantOnMapCenter()
                this.interfaceAddButtonRestaurant.displayAddButtonRestaurant()
                await this.onIdleMapEventChangeRestaurant()
            },
            async () => {
                await this.findRestaurantOnMapCenter()
                this.interfaceAddButtonRestaurant.displayAddButtonRestaurant()
                await this.onIdleMapEventChangeRestaurant()
            })
        }
        this.interfaceSearchbar.initSearchBoxAutocomplete()
    }

    async findRestaurantOnMapCenter() {
        if (this.interfaceCustomSelect.value !== 'hide') {
            // this.restaurants = await this.restaurantsRepository.findRestaurants()
            this.restaurants = await this.restaurantsRepository.findRestaurants(this.interfaceMap.map, this.interfaceMap.map.getCenter())
            this.restaurants = await this.restaurantsRepository.getRestaurantsByAverage(this.restaurants, this.interfaceCustomSelect.value, this.interfaceCustomSelect.maxRating)
            await this.interfaceMap.initMap(this.restaurants)
            await this.interfaceCards.displayCards(this.restaurants)
        } else {
            // this.restaurants = await this.restaurantsRepository.findRestaurants()
            this.restaurants = await this.restaurantsRepository.findRestaurants(this.interfaceMap.map, this.interfaceMap.map.getCenter())
            this.restaurants = await this.restaurantsRepository.getRestaurants(this.restaurants)
            await this.interfaceMap.initMap(this.restaurants)
            await this.interfaceCards.displayCards(this.restaurants)
        }

    }

    onIdleMapEventChangeRestaurant() {
        this.interfaceMap.map.addListener('idle', () => {
            if (!this.restaurantSelected) {
                let timer = null
                clearTimeout(timer)
                timer = setTimeout(async () => {
                    if (this.interfaceRestaurantInfos.isOpen) {
                        this.interfaceRestaurantInfos.hideModal()
                    }
                    if (this.interfaceAddRestaurant.isOpen || this.interfaceAddComment.isOpen) {
                        this.interfaceAddRestaurant.hideModal()
                        this.interfaceAddComment.resetModal()
                    }
                    if (this.interfaceMap.map.getZoom() < 15) {
                        this.restaurantsRepository.nearbySearchRadius = 1000
                    } else {
                        this.restaurantsRepository.nearbySearchRadius = 500
                    }
                    await this.findRestaurantOnMapCenter()
                }, 500)
            }
        })
    }

    async displayRestaurantInfosWithPanTo(restaurant) {
        this.restaurantSelected = restaurant

        if (restaurant.fullInfoLoaded !== true) {
            await restaurant.loadFullInfo(this.interfaceMap.map, restaurant)
        }
        this.interfaceAddComment.resetModal()

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
        this.interfaceAddComment.resetModal()

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

        if (value === ALL_RESTAURANTS) {
            this.restaurantsFilter = await this.restaurantsRepository.getRestaurants(this.restaurants)
        } else {
            this.restaurantsFilter = await this.restaurantsRepository.getRestaurantsByAverage(this.restaurants,value,this.interfaceCustomSelect.maxRating)
        }
        this.interfaceMap.displayMarkers(this.restaurantsFilter);
        await this.interfaceCards.displayCards(this.restaurantsFilter);
        // this.interfaceMap.setZoom(17)
        // this.interfaceMap.setCenterTo(this.restaurants[0]);
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
        this.locationSave = position
        this.interfaceAddRestaurant.controlsElt.overlayContainer.empty()
        this.interfaceAddRestaurant.generateAddForm()
        this.interfaceAddRestaurant.showModal()

        this.interfaceAddButtonRestaurant.setButtonHideAddRestaurantForm()
    }

    displayAddCommentForm() {
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
            await Utils.prototype.getPlaceIdWithLocation(this.locationSave),
            $('#restaurantName').val(),
            `${$('#restaurantStreet').val()}, ${$('#restaurantZipCode').val()} ${Utils.prototype.capitalizeFirstLetter($('#restaurantTown').val())}`,
            $('#restaurantPhone').val(),
            this.locationSave.latLng.lat(),
            this.locationSave.latLng.lng(),
            ['Restaurant'],
            [],
            null
        )
        this.restaurantsRepository.addInMemoryRestaurant(newRestaurant)
        this.restaurants = await this.restaurantsRepository.getRestaurants(this.restaurants)

        this.interfaceAddRestaurant.hideModal()
        this.interfaceAddButtonRestaurant.setButtonOpenInstruction()

        this.interfaceMap.displayMarkers(this.restaurants);
        await this.interfaceCards.displayCards(this.restaurants);
        // this.interfaceMap.setZoom(17)
        // this.interfaceMap.setCenterTo(this.restaurants[0]);
    }

    async addCommentForRestaurant(restaurant) {
        const comment = new Comment(
            Utils.prototype.generateUniqueId(),
            Utils.prototype.capitalizeFirstLetter($('#commentTextArea').val()),
            Utils.prototype.capitalizeFirstLetter($('#commentator').val()),
            parseInt($('#commentRating option:selected').val()),
            restaurant.id
        )
        restaurant.ratings.unshift(comment)
        this.restaurantsRepository.addInMemoryRestaurant(restaurant)

        restaurant.average = restaurant.getAverageRating(restaurant.ratings)
        await this.interfaceCards.displayCards(this.restaurants)
        this.interfaceRestaurantInfos.updateRestaurantInfos(restaurant)
        this.interfaceCards.setSelectedCard(restaurant)
        this.interfaceAddComment.resetModal()
    }

    setMarkerAnimationNull() {
        if (this.interfaceMap.markerSelected) {
            this.restaurantSelected = null
            this.interfaceMap.markerSelected.setAnimation(null);
            this.interfaceMap.setZoom(17)
            this.interfaceAddComment.resetModal()
        }
    }
}

export { InterfaceApp }