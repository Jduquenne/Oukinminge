import {Comment} from "./Comment.js";
import {StringConvert} from "../Utils/stringConvert.js";

class Restaurant {

    /**
     *
     * @param {string} id
     * @param {string} name
     * @param {string} adress
     * @param {string} phone
     * @param {number} lat
     * @param {number} long
     * @param {string[]} type
     * @param {Object[]} ratings
     * @param {Number} average
     * @param {function} loadFullInfosHandler
     * @param {boolean} fullInfoLoaded
     */
    constructor(id, name, adress, phone, lat, long, type, ratings, average , loadFullInfosHandler = null, fullInfoLoaded = false) {
        this.id = id
        this.name = name
        this.adress = adress
        this.phone = phone
        this.lat = lat
        this.long = long
        this.type = type
        this.ratings = ratings
        this.average = average
        this.loadFullInfoHandler = loadFullInfosHandler;
        this.fullInfoLoaded = fullInfoLoaded
        this.card = null
        this.marker = null
        this.cardImage = null
        this.image = null
    }

    loadFullInfo(map, restaurant) {
        return new Promise((resolve, reject) => {
            if (restaurant.fullInfoLoaded === false) {
                const requestPlaceId = {
                    placeId: restaurant.id,
                    fields: ["name", "formatted_address","formatted_phone_number", "reviews"],
                };
                let placesService = new google.maps.places.PlacesService(map)
                placesService.getDetails(requestPlaceId, (result, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        if (!restaurant.phone) {
                            restaurant.phone = result.formatted_phone_number
                        }
                        restaurant.type = ['Restaurant']
                        if (result.reviews) {
                            for (let i = 0; i < result.reviews.length; i++) {
                                restaurant.ratings.push(new Comment(
                                    StringConvert.prototype.generateUniqueId(),
                                    result.reviews[i].author_name,
                                    result.reviews[i].text,
                                    result.reviews[i].rating,
                                    )
                                )
                            }
                        } else {
                            restaurant.ratings.push(new Comment(
                                StringConvert.prototype.generateUniqueId(),
                                'Anonyme',
                                'Excellent ! je recommande !',
                                5,
                                restaurant.id
                            ))
                        }
                        resolve(restaurant);
                    } else {
                        console.log('Status Google place Not Ok')
                        reject('Status Google place Not Ok');
                    }
                })
                restaurant.fullInfoLoaded = true;
            } else {
                resolve(restaurant);
            }

        });
    }

    /**
     * @returns {number | null}
     */
    getAverageRating(ratings){
        if (ratings) {
            let starsSum = 0
            let ratingFound = 0
            let rating = null
            for (let i = 0; i < ratings.length; i++ ) {
                rating = ratings[i]
                if (rating){
                    starsSum = rating.stars + starsSum
                    ratingFound = ratingFound + 1
                }
            }
            return this.aroundAverage( starsSum / ratingFound )
        } else {
            return null
        }
    }

    /**
     * @returns {number | null}
     */
    aroundAverage(average) {
        return Math.round(average * 10) / 10
    }
}

export { Restaurant }