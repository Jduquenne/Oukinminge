class InterfaceAddButtonRestaurant {
    /**
     *
     * @param {*|jQuery} main
     * @param {function} showInstructionsOnClick
     * @param {function} resetAddRestaurant
     * @param {function} resetAddRestaurantInstructions
     */
    constructor(main, showInstructionsOnClick, resetAddRestaurant, resetAddRestaurantInstructions) {
        this.controlElt = {
            main: main,
            buttonAddRestaurant: $('<div class="btn-add-restaurant">+</div>'),
        }
        this.showInstructionsOnClick = showInstructionsOnClick
        this.resetAddRestaurant = resetAddRestaurant
        this.resetAddRestaurantInstructions = resetAddRestaurantInstructions
        this.btnState = 0
    }

    displayAddButtonRestaurant() {
        this.handleAddRestaurantClick(this.controlElt.buttonAddRestaurant)
        this.controlElt.main.append(this.controlElt.buttonAddRestaurant)
    }

    setButtonOpenInstruction() {
        this.btnState = 0
        this.handleAddRestaurantClick(this.controlElt.buttonAddRestaurant)
    }

    setButtonHideInstruction() {
        this.btnState = 1
        this.handleAddRestaurantClick(this.controlElt.buttonAddRestaurant)
    }

    setButtonHideAddRestaurantForm() {
        this.btnState = 2
        this.handleAddRestaurantClick(this.controlElt.buttonAddRestaurant)
    }

    /**
     *
     * @param {jQuery} element
     */
    handleAddRestaurantClick(element) {
        switch (this.btnState) {
            case 0:
                this.showInstructions(element)
                break
            case 1:
                this.hideAddRestaurantInstructions(element)
                break
            case 2:
                this.hideAddRestaurantForm(element)
                break
        }
    }

    /**
     *
     * @param {jQuery} element
     */
    showInstructions(element) {
        element.off('click').on('click', () => {
            this.showInstructionsOnClick()
        })
    }

    /**
     *
     * @param {jQuery} element
     */
    hideAddRestaurantInstructions(element) {
        element.off('click').on('click', () => {
            this.resetAddRestaurantInstructions()
        })
    }

    /**
     *
     * @param {jQuery} element
     */
    hideAddRestaurantForm(element) {
        element.off('click').on('click', () => {
            this.resetAddRestaurant()
        })
    }
}

export { InterfaceAddButtonRestaurant }