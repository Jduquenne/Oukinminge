export const ALL_RESTAURANTS = '-1'

class InterfaceCustomSelect {
    /**
     *
     * @param {*|jQuery} container
     * @param {function} onSelectHandler
     */
    constructor(container, onSelectHandler) {
        this.controlsElt = {
            customSelect: container,
        }
        this.maxRating = 5
        this.value = ''
        this.onSelectHandler = onSelectHandler;
        this.displayCustomSelect()
    }

    displayCustomSelect() {
        const select = $('<select></select>')
        select.append($(`<option value="hide" class="hide">Note</option>`))
        select.append($(`<option value="${ALL_RESTAURANTS}">Tous</option>`))
        for (let i = 0; i <= this.maxRating; i++) {
            select.append($(`<option value="${i}">Entre ${i} et 5</option>`))
        }
        select.change(()=>{
            this.onSelectHandler($(select).val())
            this.value = select.val()
        })
        this.value = select.val()
        this.controlsElt.customSelect.append(select)
    }
}

export { InterfaceCustomSelect }