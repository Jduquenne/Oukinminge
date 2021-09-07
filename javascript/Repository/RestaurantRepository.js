import { Restaurant } from "../Models/Restaurant.js";

const FILE_REPOSITORY_URL = "./javascript/data/restaurant.json";

class RestaurantRepository {

    constructor() {
        this.inMemoryRestaurant = [];
    }


    async findRestaurants(min=0,max=5) {
        const restaurants = []

        const response = await fetch(FILE_REPOSITORY_URL);
        let data = await response.json();

        // data = data.merge(this.inMemoryRestaurant)
        data.forEach((restaurant) => {
            restaurants.push(new Restaurant(restaurant.name, restaurant.adress, restaurant.phone, restaurant.lat, restaurant.long, restaurant.type, restaurant.image, restaurant.ratings))
        })

        return restaurants.filter(restaurant => { return restaurant.average >= min && restaurant.average <= max })
    }

    addInMemoryRestaurant(restaurant){
        this.inMemoryRestaurant.push(restaurant)
    }

}

export {RestaurantRepository}