class Restaurant {

    /**
     *
     * @param {string} name
     * @param {string} adress
     * @param {string} phone
     * @param {number} lat
     * @param {number} long
     * @param {string} type
     * @param {string} image
     * @param {Object} ratings
     */
    constructor(name, adress, phone, lat, long, type, image, ratings) {
        this.name = name
        this.adress = adress
        this.phone = phone
        this.lat = lat
        this.long = long
        this.type = type
        this.image = image
        this.ratings = ratings
        this.marker = null
        this.card = null
        this.average = this.getAverageRating(ratings)
    }

    /**
     * @returns {number}
     */
    getAverageRating(ratings){
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
        return starsSum / ratingFound
    }
}

export { Restaurant }