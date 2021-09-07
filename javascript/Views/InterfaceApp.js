import { InterfaceMap } from "./InterfaceMap.js";
import { InterfaceCards } from "./InterfaceCards.js";
import { InterfaceSearchbar } from "./InterfaceSearchbar.js";
import { InterfaceModal } from "./InterfaceModal.js";
import {InterfaceCustomSelect} from "./InterfaceCustomSelect.js";
import {RestaurantRepository} from "../Repository/RestaurantRepository.js";

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
            overlayRestaurant:  $('.overlay-restaurant-container'),
            customRating:  $( ".selectRating" ),
        }
        this.interfaceModal = new InterfaceModal(this.controlElt.overlayRestaurant, () => this.setMarkerAnimationNull())
        this.interfaceMap = new InterfaceMap(this.defaultMapParams,  (restaurant) => this.displayModalWithPanTo(restaurant))
        this.interfaceCards = new InterfaceCards(this.controlElt.infosRestaurant, (restaurant) => this.displayModalWithPanTo(restaurant))
        this.interfaceSearchbar = new InterfaceSearchbar(this.interfaceMap.map, this.controlElt.searchbarInput)
        this.interfaceCustomSelect = new InterfaceCustomSelect(this.controlElt.customRating, (value)=>this.displayRestaurantsByRating(value))
    }

    async displayApp() {
        this.restaurants = await this.restaurantsRepository.findRestaurants()
        await this.interfaceMap.initMap(this.restaurants)
        this.interfaceCards.displayCards(this.restaurants)
        this.interfaceSearchbar.initSearchBoxAutocomplete()
        this.interfaceCustomSelect.displayCustomSelect()
    }

    displayModalWithPanTo (restaurant) {
        this.interfaceModal.generateModal(restaurant)
        this.interfaceModal.showModal()
        if (this.interfaceMap.markerSelected) {
            this.interfaceMap.markerSelected.setAnimation(null);
        }
        this.interfaceMap.markerSelected = restaurant.marker;
        restaurant.marker.setAnimation(google.maps.Animation.BOUNCE);

        this.interfaceCards.setSelectedCard(restaurant)

        this.interfaceMap.setCenterTo(restaurant);
        this.interfaceMap.setZoom(18)
    }

    setMarkerAnimationNull() {
        if (this.interfaceMap.markerSelected) {
            this.interfaceMap.markerSelected.setAnimation(null);
            this.interfaceMap.setZoom(17)
        }
    }

    async displayRestaurantsByRating(value) {
        this.interfaceModal.hideModal()
        this.restaurants = await this.restaurantsRepository.findRestaurants(value,this.interfaceCustomSelect.maxRating);
        this.interfaceMap.displayMarkers(this.restaurants);
        this.interfaceCards.displayCards(this.restaurants);
        this.interfaceMap.setZoom(17)
        this.interfaceMap.setCenterTo(this.restaurants[0]);
    }

}

export { InterfaceApp }