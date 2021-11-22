import { InterfaceMap } from "../Map/InterfaceMap.js";
import { InterfaceCards } from "../Cards/InterfaceCards.js";
import { InterfaceSearchbar } from "../Searchbar/InterfaceSearchbar.js";
import { InterfaceRestaurantInfos } from "../Modal/InterfaceRestaurantInfos.js";
import { InterfaceAddRestaurant } from "../Modal/InterfaceAddRestaurant.js";
import { ALL_RESTAURANTS, InterfaceCustomSelect } from "../CustomSelect/InterfaceCustomSelect.js";
import { RestaurantRepository } from "../../Repository/RestaurantRepository.js";
import { Restaurant } from "../../Models/Restaurant.js";
import { Comment } from "../../Models/Comment.js";
import { InterfaceAddButtonRestaurant } from "../ButtonAddRestaurant/InterfaceAddButtonRestaurant.js";
import { InterfaceAddComment } from "../Modal/InterfaceAddComment.js";
import { StringConvert } from "../../Utils/stringConvert.js";

// Chaques interfaces de l'application sont manipulées ici
class InterfaceApp {
    /**
     *
     * @param {RestaurantRepository|RestaurantPlacesRepository} restaurantsRepository
     * Besoin du Repository en paramètre
     */
    constructor( restaurantsRepository) {
        this.restaurantsRepository = restaurantsRepository;
        this.restaurants = []
        this.restaurantsFilter = []
        this.restaurantSelected = null
        this.locationSave = null

        // Position par défaut si la localisation n'est pas activée
        this.defaultMapParams = {
            container: document.querySelector('#map'),
            center: new window.google.maps.LatLng( 48.864716, 2.349014),
            zoom: 16,
            mapId: 'cce82df13239a86c',
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        }

        // DOM principaux de l'application
        this.controlElt = {
            searchbarInput: document.getElementById('input-search'),
            infosRestaurant: $('.infos-restaurant'),
            addComment: $('.overlay-add-comment-container'),
            overlayContainer:  $('.overlay-container'),
            customRating:  $( ".selectRating" ),
            main: $( ".main" ),
        }

        // Interface de la carte Google map
        this.interfaceMap = new InterfaceMap(
            this.defaultMapParams,
            (restaurant) => this.displayRestaurantInfosWithPanTo(restaurant),
            (position) => this.displayAddRestaurantForm(position)
        )

        // Interface d'une card ( Une card représente un restaurant )
        this.interfaceCards = new InterfaceCards(this.controlElt.infosRestaurant, (restaurant) => this.displayRestaurantInfosWithPanTo(restaurant))

        // Interface de la Searchbar du Header de l'application
        this.interfaceSearchbar = new InterfaceSearchbar(this.interfaceMap.map, this.controlElt.searchbarInput)

        // Interface du filtre avis
        this.interfaceCustomSelect = new InterfaceCustomSelect(this.controlElt.customRating, (value)=>this.displayRestaurantsByRating(value))

        // Interface de la modal d'information d'un restaurant
        this.interfaceRestaurantInfos = new InterfaceRestaurantInfos(this.controlElt.overlayContainer, () => this.setMarkerAnimationNull(), () => this.displayAddCommentForm())

        // Interface de la modal d'ajout de restaurant
        this.interfaceAddRestaurant = new InterfaceAddRestaurant(
            this.controlElt.overlayContainer,
            () => this.resetMarkerCreateAndAddRestaurantForm(),
            () => this.addRestaurant()
        )

        // Interface du bouton d'ajout de restaurant
        this.interfaceAddButtonRestaurant = new InterfaceAddButtonRestaurant(
            this.controlElt.main,
            () => this.displayAddRestaurantInstructions(),
            () => this.resetMarkerCreateAndAddRestaurantForm(),
            () => this.resetAddRestaurantInstructions()
        )

        // Interface de l'ajout de commentaire sur un restaurant
        this.interfaceAddComment = new InterfaceAddComment(
            this.controlElt.addComment,
            () => this.addCommentForRestaurant(this.restaurantSelected)
        )
    }

    // Fonction principale qui génére les restaurants
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

    // Recherche dans le Repository les restaurants, si un filtre est activé ou pas
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

    // Recherche des restaurants si on se déplace sur la carte
    onIdleMapEventChangeRestaurant() {
        this.interfaceMap.map.addListener('idle', () => {
            if (!this.restaurantSelected) {
                if (this.interfaceAddRestaurant.isOpen === false) {
                    let timer = null
                    clearTimeout(timer)
                    timer = setTimeout(async () => {
                        if (this.interfaceRestaurantInfos.isOpen) {
                            this.interfaceRestaurantInfos.hideModal()
                        }
                        if (this.interfaceMap.map.getZoom() < 15) {
                            this.restaurantsRepository.nearbySearchRadius = 1000
                        } else {
                            this.restaurantsRepository.nearbySearchRadius = 500
                        }
                        await this.findRestaurantOnMapCenter()
                    }, 500)
                }
            }
        })
    }

    // Affiche le modal d'information du restaurant selectionné
    async displayRestaurantInfosWithPanTo(restaurant) {
        this.restaurantSelected = restaurant

        if (restaurant.fullInfoLoaded !== true) {
            await restaurant.loadFullInfo(this.interfaceMap.map, restaurant)
        }
        this.interfaceAddComment.resetModal()

        if (this.interfaceAddButtonRestaurant.btnState === 2) {
            this.interfaceMap.markers[this.interfaceMap.markers.length - 1].setMap(null);
        }
        if (this.interfaceAddRestaurant.isOpen) {
            this.interfaceAddRestaurant.setClose()
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

    // Affiche les restaurants filtrés
    /**
     *
     * @param value
     * @returns {Promise<void>}
     */
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
        this.interfaceMap.setZoom(17)
        this.interfaceMap.setCenterTo(this.restaurants[0]);
    }

    // Affiche le modal d'instruction d'ajout de restaurant
    displayAddRestaurantInstructions() {
        this.setMarkerAnimationNull()
        this.interfaceRestaurantInfos.setClose()
        this.interfaceCards.removeActiveAllCards()
        this.interfaceAddRestaurant.setHeightForAddRestaurant()

        this.interfaceAddRestaurant.controlsElt.overlayContainer.empty()
        this.interfaceAddRestaurant.generateInstructions()
        this.interfaceAddRestaurant.showModal()
        console.log(this.interfaceAddRestaurant.isOpen)
        this.interfaceMap.setMapListener()

        this.interfaceAddButtonRestaurant.setButtonHideInstruction()
    }

    // Affiche le modal de formulaire d'ajout de restaurant
    /**
     *
     * @param {Object} position
     */
    displayAddRestaurantForm(position) {
        this.locationSave = position
        this.interfaceAddRestaurant.controlsElt.overlayContainer.empty()
        this.interfaceAddRestaurant.generateAddForm()
        this.interfaceAddRestaurant.showModal()

        this.interfaceAddButtonRestaurant.setButtonHideAddRestaurantForm()
    }

    // Affiche le modal d'ajout de commentaire sur un restaurant
    displayAddCommentForm() {
        this.interfaceAddComment.controlsElt.overlayCommentContainer.empty()
        this.interfaceAddComment.generateAddCommentForm()
        this.interfaceAddComment.showModal()
    }

    // Ferme le modal d'ajout de restaurant et supprime le marker crée par l'utilisateur
    resetMarkerCreateAndAddRestaurantForm() {
        this.locationSave = null
        this.interfaceMap.markers[this.interfaceMap.markers.length - 1].setMap(null);
        this.interfaceAddRestaurant.controlsElt.overlayContainer.empty()
        this.interfaceAddRestaurant.hideModal()
        this.interfaceMap.removeMapListener()

        this.interfaceAddButtonRestaurant.setButtonOpenInstruction()
    }

    // Ferme le modal d'instruction d'ajout de restaurant
    resetAddRestaurantInstructions() {
        console.log(this.restaurantSelected)
        this.restaurantSelected = null
        this.interfaceAddRestaurant.controlsElt.overlayContainer.empty()
        this.interfaceAddRestaurant.hideModal()
        this.interfaceMap.removeMapListener()

        this.interfaceAddButtonRestaurant.setButtonOpenInstruction()
    }

    // Créer un restaurant
    async addRestaurant() {
        const newRestaurant = new Restaurant(
            await StringConvert.prototype.getPlaceIdWithLocation(this.locationSave),
            $('#restaurantName').val(),
            `${$('#restaurantStreet').val()}, ${$('#restaurantZipCode').val()} ${StringConvert.prototype.capitalizeFirstLetter($('#restaurantTown').val())}`,
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

    // Créer un commentaire sur un restaurant
    /**
     *
     * @param {Restaurant} restaurant
     * @returns {Promise<void>}
     */
    async addCommentForRestaurant(restaurant) {
        const comment = new Comment(
            StringConvert.prototype.generateUniqueId(),
            StringConvert.prototype.capitalizeFirstLetter($('#commentTextArea').val()),
            StringConvert.prototype.capitalizeFirstLetter($('#commentator').val()),
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

    // Retire l'animation d'un marker lorsqu'il n'est plus selectionné
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