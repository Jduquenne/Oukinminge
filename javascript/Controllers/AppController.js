// Repository local (JSON)
// import {RestaurantRepository} from "../Repository/RestaurantRepository.js";

// Repository Api
import {RestaurantPlacesRepository} from "../Repository/RestaurantPlacesRepository.js";
import {InterfaceApp} from "../Views/App/InterfaceApp.js";

// Controller principal qui va chercher le repository de son choix
// Génération de l'interface avec les informations du Repository
class AppController {
    constructor() {
        this.interfaceApp = null;
        // this.restaurantsRepository = new RestaurantRepository()
        this.restaurantsRepository = new RestaurantPlacesRepository()
    }
    async initApp() {
        this.interfaceApp = new InterfaceApp(this.restaurantsRepository);
        await this.interfaceApp.displayApp();
    }
}

export { AppController }