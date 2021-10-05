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
        overlayAddRestaurantFormName.append(this.generateOneInput('restaurantName', 'Nom du restaurant', '[A-Za-z0-9\'\\.\\-\\s\\,]'))
        const overlayAddRestaurantFormPhone = $('<div class="overlay-add-restaurant-form"></div>')
        overlayAddRestaurantFormPhone.append(this.generateOneInput('restaurantPhone', 'Numéro de téléphone', '(01|02|03|04|05|06|07|08|09)[ \\.\\-]?[0-9]{2}[ \\.\\-]?[0-9]{2}[ \\.\\-]?[0-9]{2}[ \\.\\-]?[0-9]{2}'))
        overlayAddRestaurantFormsContainerFirst.append(overlayAddRestaurantFormName, overlayAddRestaurantFormPhone)

        const overlayAddRestaurantFormsContainerSecond = $('<div class="overlay-add-restaurant-forms-container"></div>')
        const overlayAddRestaurantFormStreet = $('<div class="overlay-add-restaurant-form"></div>')
        overlayAddRestaurantFormStreet.append(this.generateOneInput('restaurantStreet', 'Adresse', '[A-Za-z0-9\'\\.\\-\\s\\,]'))
        const overlayAddRestaurantFormTownZip = $('<div class="overlay-add-restaurant-form"></div>')
        const overlayAddRestaurantFormTown = this.generateOneInput('restaurantTown', 'Ville', '[A-Za-z0-9\'\\.\\-\\s\\,]')
        const overlayAddRestaurantFormZip = this.generateOneInput('restaurantZipCode', 'Code postal', '^(([0-8][0-9])|(9[0-5])|(2[ab]))[0-9]{3}$')
        overlayAddRestaurantFormTownZip.append(overlayAddRestaurantFormTown, overlayAddRestaurantFormZip)
        overlayAddRestaurantFormsContainerSecond.append(overlayAddRestaurantFormStreet, overlayAddRestaurantFormTownZip)

        const overlayAddRestaurantFormsContainerThird = $('<div class="overlay-add-restaurant-forms-container"></div>')
        const overlayAddRestaurantFormsAddButton = $('<button id="add" type="submit">Ajouter</button>')
        overlayAddRestaurantForms.on('submit', () => {
            this.onClickAdd()
        })
        const overlayAddRestaurantFormsCancelButton = $('<button class="button-cancel" id="cancel">Annuler</button>')
        overlayAddRestaurantFormsCancelButton.on('click', () => {
            this.hideModal()
            this.onClickCancel()
        })
        overlayAddRestaurantFormsContainerThird.append(overlayAddRestaurantFormsAddButton, overlayAddRestaurantFormsCancelButton)

        overlayAddRestaurantForms.append(overlayAddRestaurantFormsContainerFirst, overlayAddRestaurantFormsContainerSecond, overlayAddRestaurantFormsContainerThird)

        overlayAddRestaurant.append(overlayAddRestaurantTitle, overlayAddRestaurantForms)
        this.controlsElt.overlayContainer.append(overlayAddRestaurant)
    }

    generateOneInput(id, placeholder, regex) {
        return $(`<input id="${id}" type="text" placeholder="${placeholder}" pattern="${regex}" required />`)
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