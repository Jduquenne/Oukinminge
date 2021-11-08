import {RestaurantRepository} from "../Repository/RestaurantRepository.js";
import {RestaurantPlacesRepository} from "../Repository/RestaurantPlacesRepository.js";
import {InterfaceApp} from "../Views/App/InterfaceApp.js";


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

export {AppController}