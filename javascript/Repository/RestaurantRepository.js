import { Restaurant } from "../Models/Restaurant.js";

class RestaurantRepository {

    /**
     *
     * @param {string} url
     * @returns {Promise<*[]>}
     */
    async findAllRestaurants(url) {
        const restaurants = []

        const response = await fetch(url);
        const data = await response.json();

        data.forEach((restaurant) => {
            restaurants.push(new Restaurant(restaurant.name, restaurant.adress, restaurant.phone, restaurant.lat, restaurant.long, restaurant.image, restaurant.ratings))
        })
        return restaurants
    }

    async findRestaurantsByRange(url, range) {
        const restaurants = []

        const response = await fetch(url);
        const data = await response.json();

        data.forEach((restaurant) => {
            restaurants.push(new Restaurant(restaurant.name, restaurant.adress, restaurant.phone, restaurant.lat, restaurant.long, restaurant.image, restaurant.ratings))
        })

        return restaurants.filter(restaurant => { return restaurant.average > range.min && restaurant.average < range.max })
    }

}

export {RestaurantRepository}