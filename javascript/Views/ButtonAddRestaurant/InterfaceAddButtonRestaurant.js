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

    setButtonOpenInstruction() {
        this.btnState = 0
    }

    setButtonHideInstruction() {
        this.btnState = 1
    }

    setButtonHideAddRestaurantForm() {
        this.btnState = 2
    }

    displayAddButtonRestaurant() {
        this.handleAddRestaurantClick(this.controlElt.buttonAddRestaurant)
        this.controlElt.main.append(this.controlElt.buttonAddRestaurant)
    }

    handleAddRestaurantClick(element) {
        switch (this.btnState) {
            case 0:
                console.log(this.btnState)
                this.showInstructions(element)
                break
            case 1:
                console.log(this.btnState)
                this.hideAddRestaurantInstructions(element)
                break
            case 2:
                console.log(this.btnState)
                this.hideAddRestaurantForm(element)
                break
        }
    }

    showInstructions(element) {
        element.off('click').on('click', () => {
            this.showInstructionsOnClick()
        })
    }

    hideAddRestaurantInstructions(element) {
        element.off('click').on('click', () => {
            this.resetAddRestaurantInstructions()

        })
    }

    hideAddRestaurantForm(element) {
        element.off('click').on('click', () => {
            this.resetAddRestaurant()
            console.log('je me suis trompé de position')
        })
    }
}

export { InterfaceAddButtonRestaurant }