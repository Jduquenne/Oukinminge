class InterfaceCustomSelect {
    constructor(container, onSelectHandler) {
        this.controlsElt = {
            customSelect: container,
        }
        this.maxRating = 5
        this.onSelectHandler = onSelectHandler;
        this.displayCustomSelect()
    }

    displayCustomSelect() {
        const select = $('<select></select>')
        select.append($('<option value="0" class="hide">Note</option>'))
        for (let i = 0; i <= this.maxRating; i++) {
            select.append($(`<option value="${i}">${i}</option>`))
        }
        select.change(()=>{
            this.onSelectHandler($(select).val())
        })
        this.controlsElt.customSelect.append(select)
    }

}

export { InterfaceCustomSelect }