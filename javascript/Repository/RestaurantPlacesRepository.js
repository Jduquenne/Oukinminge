import { Restaurant } from "../Models/Restaurant.js";

class RestaurantPlacesRepository {
    constructor() {
        this.inMemoryRestaurant = []
        this.nearbySearchRadius = 500
    }

    findRestaurants(map, pos) {
        return new Promise((resolve, reject) => {
            let restaurantWithoutFullInfos = []
            const requestRestaurants = {
                location: pos,
                radius: this.nearbySearchRadius,
                type: 'restaurant'
            }
            let placesService = new google.maps.places.PlacesService(map)

            placesService.nearbySearch(requestRestaurants, (restaurants, status) => {
                if (restaurants.length !== 0) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        for (let i = 0; i < restaurants.length; i++) {
                            if (restaurants[i].rating) {
                                restaurantWithoutFullInfos.push(new Restaurant(
                                    restaurants[i].place_id,
                                    restaurants[i].name,
                                    restaurants[i].vicinity,
                                    null,
                                    restaurants[i].geometry.location.lat(),
                                    restaurants[i].geometry.location.lng(),
                                    [],
                                    [],
                                    restaurants[i].rating
                                ))
                                if (restaurants[i].photos) {
                                    restaurantWithoutFullInfos[i].image = restaurants[i].photos[0].getUrl()
                                }
                            } else {
                                restaurantWithoutFullInfos.push(new Restaurant(
                                    restaurants[i].place_id,
                                    restaurants[i].name,
                                    restaurants[i].vicinity,
                                    null,
                                    restaurants[i].geometry.location.lat(),
                                    restaurants[i].geometry.location.lng(),
                                    [],
                                    [],
                                    5
                                ))
                            }
                        }
                        resolve(restaurantWithoutFullInfos)
                    } else {
                        reject('GooglePlacesNotWorking');
                    }
                } else {
                    resolve(restaurantWithoutFullInfos = [])
                }
            })
        })
    }

    /**
     *
     * @param {Restaurant[]} restaurants
     * @returns {Promise<*>}
     */
    async getRestaurants(restaurants) {
        restaurants.forEach(restaurant => {
            this.inMemoryRestaurant.forEach(restaurantInMemory => {
                if (restaurantInMemory.id === restaurant.id) {
                    const index = restaurants.indexOf(restaurant)
                    restaurants.splice(index, 1)
                }
                if (!restaurants.includes(restaurantInMemory)) {
                    restaurants.unshift(restaurantInMemory)
                }
            })
        })
        return restaurants
    }

    /**
     *
     * @param { Restaurant[] } restaurants
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
    addInMemoryRestaurant(restaurant) {
        this.inMemoryRestaurant.push(restaurant)
        console.log(restaurant)
    }
}

export {RestaurantPlacesRepository}