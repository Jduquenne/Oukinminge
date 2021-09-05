import {RestaurantRepository} from "../Repository/RestaurantRepository.js";
import {InterfaceApp} from "../Views/InterfaceApp.js";

class AppController {
    constructor() {
        this.restaurants = [];
        this.interfaceApp = null
    }

    async getRestaurants() {
        const restaurantRepository = new RestaurantRepository()
        return await restaurantRepository.findAllRestaurants("./javascript/data/restaurant.json");
        // const range = {
        //     min: 2,
        //     max: 3,
        // }
        // return await restaurantRepository.findRestaurantsByRange("./javascript/data/restaurant.json", range);
    }

    async initApp() {
        this.restaurants = await this.getRestaurants()
        // console.log(this.restaurants)
        this.interfaceApp = new InterfaceApp(this.restaurants);
        this.interfaceApp.displayApp();
    }
}

export {AppController}