import {RestaurantRepository} from "../Repository/RestaurantRepository.js";
import {InterfaceApp} from "../Views/App/InterfaceApp.js";

class AppController {
    constructor() {
        this.interfaceApp = null;
        this.restaurantsRepository = new RestaurantRepository();
    }
    async initApp() {
        this.interfaceApp = new InterfaceApp(this.restaurantsRepository);
        await this.interfaceApp.displayApp();
    }
}

export {AppController}