class InterfaceHeader {
    constructor() {
        this.app = document.querySelector('.app')
        this.header = this.createHeader()
    }

    displayHeader() {
        this.header.appendTo(this.app)
    }

    createHeader() {
        const header = $(`<header></header>`)
        const headerContainer = $(`<div class='header-container'></div>`)

        headerContainer.append(this.createBrand(), this.createSpacer(), this.createSpacer())
        header.append(headerContainer)

        return header.appendTo(this.app)
    }

    createBrand() {
        const brand = $(`<div class='brand'></div>`)

        const iconLogo = $(`<i class="fas fa-utensils"></i>`)
        const nameLogo = $(`<h1>Oukin<span>minge</span></h1>`)
        return brand.append(iconLogo, nameLogo)
    }

    createSpacer() {
        return $(`<div class="spacer-20"></div>`)
    }
}

export { InterfaceHeader }