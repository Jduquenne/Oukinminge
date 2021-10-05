class Restaurant {

    /**
     *
     * @param {string} name
     * @param {string} adress
     * @param {string} phone
     * @param {number} lat
     * @param {number} long
     * @param {string[]} type
     * @param {Object} ratings
     */
    constructor(name, adress, phone, lat, long, type, ratings) {
        this.name = name
        this.adress = adress
        this.phone = phone
        this.lat = lat
        this.long = long
        this.type = type
        this.image = null
        this.ratings = ratings
        this.marker = null
        this.card = null
        this.average = this.getAverageRating(ratings)
    }

    /**
     * @returns {number | null}
     */
    getAverageRating(ratings){
        if (ratings.length !== 0) {
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