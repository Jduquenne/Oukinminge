import { InterfaceMap } from "./InterfaceMap.js";
import { InterfaceCards } from "./InterfaceCards.js";
import { InterfaceSearchbar } from "./InterfaceSearchbar.js";

class InterfaceApp {
    /**
     *
     * @param {Array} restaurants
     */
    constructor(restaurants) {
        this.restaurants = restaurants

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
            infosRestaurant: $('.infos-restaurant')
        }
        this.interfaceMap = new InterfaceMap(this.defaultMapParams, this.restaurants)
        this.interfaceCards = new InterfaceCards(this.restaurants, this.controlElt.infosRestaurant)
        this.interfaceSearchbar = new InterfaceSearchbar(this.interfaceMap.map, this.controlElt.searchbarInput)
    }

    displayApp() {
        this.interfaceMap.initMap()
        this.interfaceCards.displayCards()
        this.interfaceSearchbar.initSearchBoxAutocomplete()
    }
}

export { InterfaceApp }