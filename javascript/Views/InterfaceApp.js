import { InterfaceMap } from "./InterfaceMap.js";
import { InterfaceCards } from "./InterfaceCards.js";

class InterfaceApp {
    /**
     *
     * @param {Array} restaurantsInfos
     */
    constructor(restaurantsInfos) {
        this.restaurantsInfos = restaurantsInfos

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

        this.interfaceMap = new InterfaceMap(this.defaultMapParams, this.restaurantsInfos)
        this.interfaceCards = new InterfaceCards(this.restaurantsInfos)
    }

    displayApp() {
        this.interfaceMap.initMap()
        this.interfaceCards.displayCards()
    }
}

export { InterfaceApp }