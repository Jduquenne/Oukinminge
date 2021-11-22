// Représentation d'un commentaire
class Comment {
    /**
     *
     * @param {string} id
     * @param {string} commentator
     * @param {string} comment
     * @param {number} stars
     * @param {string} restaurantId
     */
    constructor(id, commentator, comment, stars, restaurantId) {
        this.id = id
        this.commentator = commentator
        this.comment = comment
        this.stars = stars
        this.restaurantId = restaurantId
    }
}
export { Comment }