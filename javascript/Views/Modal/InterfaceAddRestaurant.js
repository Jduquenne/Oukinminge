class InterfaceAddRestaurant {
    constructor(container, onClickCancel, onClickAdd) {
        this.controlsElt = {
            overlayContainer: container,
            closeModal: $('.overlay-restaurant-close'),
            infoCardRestaurant: $('.info-card-restaurant')
        }
        this.isOpen = false
        this.onClickCancel = onClickCancel
        this.onClickAdd = onClickAdd
    }

    setOpen () {
        this.isOpen = true
    }

    setClose () {
        this.isOpen = false
    }

    setHeightForAddRestaurant() {
        this.controlsElt.overlayContainer.css({ height: '200px' })
    }

    showModal() {
        if (!this.isOpen) {
            this.setHeightForAddRestaurant()
            this.controlsElt.overlayContainer.css({ top: '75px'})
            this.setOpen()
        }
    }

    hideModal() {
        if (this.isOpen) {
            this.controlsElt.overlayContainer.css({ top: '-200px'})
            this.controlsElt.overlayContainer.empty()
            $('.info-card-restaurant').removeClass('active')
            this.setClose()
        }
    }

    generateAddForm() {
        const overlayAddRestaurant = $('<div class="overlay-add-restaurant"></div>')
        const overlayAddRestaurantTitle = $('<h2>Ajouter un restaurant</h2>')
        const overlayAddRestaurantForms = $('<form class="overlay-add-restaurant-forms" onsubmit="return false"></form>')

        const overlayAddRestaurantFormsContainerFirst = $('<div class="overlay-add-restaurant-forms-container"></div>')
        const overlayAddRestaurantFormName = $('<div class="overlay-add-restaurant-form"></div>')
        overlayAddRestaurantFormName.append(this.generateOneInput('restaurantName', 'Nom du restaurant'))
        const overlayAddRestaurantFormPhone = $('<div class="overlay-add-restaurant-form"></div>')
        overlayAddRestaurantFormPhone.append(this.generateOneInput('restaurantPhone', 'Numéro de téléphone'))
        overlayAddRestaurantFormsContainerFirst.append(overlayAddRestaurantFormName, overlayAddRestaurantFormPhone)

        const overlayAddRestaurantFormsContainerSecond = $('<div class="overlay-add-restaurant-forms-container"></div>')
        const overlayAddRestaurantFormStreet = $('<div class="overlay-add-restaurant-form"></div>')
        overlayAddRestaurantFormStreet.append(this.generateOneInput('restaurantStreet', 'Adresse'))
        const overlayAddRestaurantFormTownZip = $('<div class="overlay-add-restaurant-form"></div>')
        const overlayAddRestaurantFormTown = this.generateOneInput('restaurantTown', 'Ville')
        const overlayAddRestaurantFormZip = this.generateOneInput('restaurantZipCode', 'Code postal')
        overlayAddRestaurantFormTownZip.append(overlayAddRestaurantFormTown, overlayAddRestaurantFormZip)
        overlayAddRestaurantFormsContainerSecond.append(overlayAddRestaurantFormStreet, overlayAddRestaurantFormTownZip)

        const overlayAddRestaurantFormsContainerThird = $('<div class="overlay-add-restaurant-forms-container"></div>')
        const overlayAddRestaurantFormsAddButton = $('<button id="add" type="submit">Ajouter</button>')
        overlayAddRestaurantFormsAddButton.on('click', () => {
            this.onClickAdd()
        })
        const overlayAddRestaurantFormsCancelButton = $('<div class="button-cancel" id="cancel">Annuler</div>')
        overlayAddRestaurantFormsCancelButton.on('click', () => {
            this.hideModal()
            this.onClickCancel()
        })
        overlayAddRestaurantFormsContainerThird.append(overlayAddRestaurantFormsAddButton, overlayAddRestaurantFormsCancelButton)

        overlayAddRestaurantForms.append(overlayAddRestaurantFormsContainerFirst, overlayAddRestaurantFormsContainerSecond, overlayAddRestaurantFormsContainerThird)

        overlayAddRestaurant.append(overlayAddRestaurantTitle, overlayAddRestaurantForms)
        this.controlsElt.overlayContainer.append(overlayAddRestaurant)
    }

    generateOneInput(id, placeholder) {
        return $(`<input id="${id}" type="text" placeholder="${placeholder}">`)
    }

    generateInstructions() {
        const overlayAddRestaurant = $('<div class="overlay-add-restaurant"></div>')

        const overlayAddRestaurantTitle = $('<h2>Ajouter un restaurant</h2>')
        const overlayAddRestaurantInstructions = $('<p class="overlay-add-restaurant-instructions">Pour ajouter un restaurant, cliquez sur la carte pour définir la position du restaurant ...</p>')

        overlayAddRestaurant.append(overlayAddRestaurantTitle, overlayAddRestaurantInstructions)
        this.controlsElt.overlayContainer.append(overlayAddRestaurant)
    }

}

export { InterfaceAddRestaurant }