class Restaurant {

    /**
     *
     * @param {string} name
     * @param {string} adress
     * @param {number} lat
     * @param {number} long
     * @param {string} image
     * @param {Object} ratings
     */
    constructor(name, adress, lat, long, image, ratings) {
        this.name = name
        this.adress = adress
        this.lat = lat
        this.long = long
        this.image = image
        this.ratings = ratings
    }

    /**
     * @returns {number}
     */
    getAverageRating(){
        //todo compute average rating
        return 3;
    }
}

export { Restaurant }