import { Restaurant } from "../Models/Restaurant.js";

class RestaurantPlacesRepository {
    constructor() {
        this.inMemoryRestaurant = []
        this.nearbySearchRadius = 500
    }

    findRestaurants(map, pos) {
        return new Promise((resolve, reject) => {
            const restaurantWithoutFullInfos = []
            const requestRestaurants = {
                location: pos,
                radius: this.nearbySearchRadius,
                type: 'restaurant'
            }
            let placesService = new google.maps.places.PlacesService(map)

            placesService.nearbySearch(requestRestaurants, (result, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].rating) {
                            restaurantWithoutFullInfos.push(new Restaurant(
                                result[i].place_id,
                                result[i].name,
                                result[i].vicinity,
                                null,
                                result[i].geometry.location.lat(),
                                result[i].geometry.location.lng(),
                                [],
                                [],
                                result[i].rating
                            ))
                            if (result[i].photos) {
                                restaurantWithoutFullInfos[i].image = result[i].photos[0].getUrl()
                            }
                        } else {
                            restaurantWithoutFullInfos.push(new Restaurant(
                                result[i].place_id,
                                result[i].name,
                                result[i].vicinity,
                                null,
                                result[i].geometry.location.lat(),
                                result[i].geometry.location.lng(),
                                [],
                                [],
                                5
                            ))
                        }

                    }
                } else {
                    console.log('Status Google place Not Ok')
                    reject('Status Google place Not Ok');
                }
                resolve(restaurantWithoutFullInfos)
            })
        })
    }

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
     * @param { Object[] } restaurants
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