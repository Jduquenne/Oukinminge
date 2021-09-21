import { InterfaceMap } from "../Map/InterfaceMap.js";
import { InterfaceCards } from "../Cards/InterfaceCards.js";
import { InterfaceSearchbar } from "../Searchbar/InterfaceSearchbar.js";
import { InterfaceRestaurantInfos } from "../Modal/InterfaceRestaurantInfos.js";
import { InterfaceAddRestaurant } from "../Modal/InterfaceAddRestaurant.js";
import { InterfaceCustomSelect } from "../CustomSelect/InterfaceCustomSelect.js";
import { RestaurantRepository } from "../../Repository/RestaurantRepository.js";
import { Restaurant } from "../../Models/Restaurant.js";
import {InterfaceAddButtonRestaurant} from "../ButtonAddRestaurant/InterfaceAddButtonRestaurant.js";

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
            overlayContainer:  $('.overlay-container'),
            customRating:  $( ".selectRating" ),
            main: $( ".main" ),
        }

        this.interfaceMap = new InterfaceMap(
            this.defaultMapParams,
            (restaurant) => this.displayModalWithPanTo(restaurant),
            (position) => this.displayAddRestaurantForm(position)
        )
        this.interfaceCards = new InterfaceCards(this.controlElt.infosRestaurant, (restaurant) => this.displayModalWithPanTo(restaurant))
        this.interfaceSearchbar = new InterfaceSearchbar(this.interfaceMap.map, this.controlElt.searchbarInput)
        this.interfaceCustomSelect = new InterfaceCustomSelect(this.controlElt.customRating, (value)=>this.displayRestaurantsByRating(value))
        this.interfaceRestaurantInfos = new InterfaceRestaurantInfos(this.controlElt.overlayContainer, () => this.setMarkerAnimationNull())
        this.interfaceAddRestaurant = new InterfaceAddRestaurant(this.controlElt.overlayContainer, () => this.resetMarkerCreateAndAddRestaurantForm())
        this.interfaceAddButtonRestaurant = new InterfaceAddButtonRestaurant(
            this.controlElt.main,
            () => this.displayAddRestaurantInstructions(),
            () => this.resetMarkerCreateAndAddRestaurantForm(),
            () => this.resetAddRestaurantInstructions()
        )
    }

    async displayApp() {
        this.restaurants = await this.restaurantsRepository.findRestaurants()
        await this.interfaceMap.initMap(this.restaurants)
        this.interfaceCards.displayCards(this.restaurants)
        this.interfaceSearchbar.initSearchBoxAutocomplete()
        this.interfaceAddButtonRestaurant.displayAddButtonRestaurant()
    }

    displayModalWithPanTo (restaurant) {
        if (this.interfaceAddButtonRestaurant.btnState === 2) {
            this.interfaceMap.markers[this.interfaceMap.markers.length - 1].setMap(null);
        }
        this.interfaceMap.removeMapListener()
        this.interfaceAddButtonRestaurant.setButtonOpenInstruction()
        this.interfaceAddButtonRestaurant.handleAddRestaurantClick(this.interfaceAddButtonRestaurant.controlElt.buttonAddRestaurant)

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
        this.interfaceAddButtonRestaurant.handleAddRestaurantClick(this.interfaceAddButtonRestaurant.controlElt.buttonAddRestaurant)

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
        this.interfaceCards.removeActiveAllCards()
        this.interfaceAddRestaurant.setHeightForAddRestaurant()

        this.interfaceAddRestaurant.controlsElt.overlayContainer.empty()
        this.interfaceAddRestaurant.generateInstructions()
        this.interfaceAddRestaurant.showModal()
        this.interfaceMap.setMapListener()
        console.log('je suis sur les instructions')
        this.interfaceAddButtonRestaurant.setButtonHideInstruction()
        this.interfaceAddButtonRestaurant.handleAddRestaurantClick(this.interfaceAddButtonRestaurant.controlElt.buttonAddRestaurant)
    }

    displayAddRestaurantForm() {
        this.interfaceAddRestaurant.controlsElt.overlayContainer.empty()
        this.interfaceAddRestaurant.generateAddForm()
        this.interfaceAddRestaurant.showModal()
        console.log('je suis sur le formulaire')
        this.interfaceAddButtonRestaurant.setButtonHideAddRestaurantForm()
        this.interfaceAddButtonRestaurant.handleAddRestaurantClick(this.interfaceAddButtonRestaurant.controlElt.buttonAddRestaurant)
    }

    resetMarkerCreateAndAddRestaurantForm() {
        this.interfaceMap.markers[this.interfaceMap.markers.length - 1].setMap(null);
        this.interfaceAddRestaurant.controlsElt.overlayContainer.empty()
        this.interfaceAddRestaurant.hideModal()
        this.interfaceMap.removeMapListener()
        console.log('jannule lajout du restaurant')
        this.interfaceAddButtonRestaurant.setButtonOpenInstruction()
        this.interfaceAddButtonRestaurant.handleAddRestaurantClick(this.interfaceAddButtonRestaurant.controlElt.buttonAddRestaurant)
    }

    resetAddRestaurantInstructions() {
        this.interfaceAddRestaurant.controlsElt.overlayContainer.empty()
        this.interfaceAddRestaurant.hideModal()
        this.interfaceMap.removeMapListener()
        console.log('je cache les instructions')
        this.interfaceAddButtonRestaurant.setButtonOpenInstruction()
        this.interfaceAddButtonRestaurant.handleAddRestaurantClick(this.interfaceAddButtonRestaurant.controlElt.buttonAddRestaurant)
    }

    async displayNewRestaurant(position) {
        const newRestaurant = new Restaurant('Lambda', '123 rue de la gare, 59270 Bailleul', '0685742145', position.latLng.lat(), position.latLng.lng(), ['FastFood'], [
            {
                "stars":2,
                "commentator":"Jason",
                "comment":"Un excellent restaurant, j'y reviendrai ! Par contre il vaut mieux aimer la viande."
            },
            {
                "stars":5,
                "commentator":"Batman",
                "comment":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium asperiores aut consequuntur corporis\n    dolorum ducimus est inventore iste, laborum modi nesciunt obcaecati recusandae similique suscipit ut veniam\n    veritatis, voluptatibus.  A accusantium asperiores aut consequuntur corporis\n    dolorum ducimus est inventore iste, laborum modi nesciunt obcaecati recusandae similique suscipit ut veniam\n    veritatis, voluptatibus."
            },
            {
                "stars":2,
                "commentator":"Jason",
                "comment":"Un excellent restaurant, j'y reviendrai ! Par contre il vaut mieux aimer la viande."
            }
        ] )
        this.restaurantsRepository.addInMemoryRestaurant(newRestaurant)
        this.restaurants = await this.restaurantsRepository.findRestaurants()
        this.interfaceMap.displayMarkers(this.restaurants);
        this.interfaceCards.displayCards(this.restaurants);
        this.interfaceMap.setZoom(17)
        this.interfaceMap.setCenterTo(this.restaurants[0]);
    }

    setMarkerAnimationNull() {
        if (this.interfaceMap.markerSelected) {
            this.interfaceMap.markerSelected.setAnimation(null);
            this.interfaceMap.setZoom(17)
        }
    }
}

export { InterfaceApp }