import { Restaurant } from "../Models/Restaurant.js";
import { Comment } from "../Models/Comment.js";
import { Utils } from "../Utils/Utils.js";

const FILE_REPOSITORY_URL = "./javascript/data/restaurant.json";

class RestaurantRepository {

    constructor() {
        this.inMemoryRestaurant = []
    }

    async findRestaurants() {
        const restaurants = []
        const response = await fetch(FILE_REPOSITORY_URL);
        let data = await response.json();
        let ratings = []
        for (let i = 0; i < data.length; i++) {
            ratings = []
            restaurants.push(new Restaurant(
                Utils.prototype.generateUniqueId(),
                data[i].name,
                data[i].adress,
                data[i].phone,
                data[i].lat,
                data[i].long,
                data[i].type,
                ratings,
                null,
                null,
                true
                ))
            for (let j = 0; j < data[i].ratings.length; j++) {
                ratings.push(new Comment(
                    Utils.prototype.generateUniqueId(),
                    data[i].ratings[j].commentator,
                    data[i].ratings[j].comment,
                    data[i].ratings[j].stars,
                    )
                )
            }
            restaurants[i].average = restaurants[i].getAverageRating(ratings)
        }
        return restaurants
    }

    async getRestaurants(restaurants) {
        console.log(restaurants)
        console.log(this.inMemoryRestaurant)
        this.inMemoryRestaurant.forEach(restaurantInMemory => {
            if (!restaurants.includes(restaurantInMemory)) {
                restaurants.unshift(restaurantInMemory)
            }
        })
        return restaurants
    }

    /**
     *
     * @param { Object[] }restaurants
     * @param { number } min
     * @param { number } max
     * @returns {Promise<*[]>}
     */
    async getRestaurantsByAverage(restaurants, min= 0,max= 5) {
        return restaurants.filter(restaurant => { return restaurant.average >= min && restaurant.average <= max })
    }

    /**
     *
     * @param { Restaurant } restaurant
     */
    addInMemoryRestaurant(restaurant){
        this.inMemoryRestaurant.push(restaurant)
    }

}

export { RestaurantRepository }