class InterfaceAddComment {
    /**
     *
     * @param {*|jQuery} container
     * @param {function} onClickSubmit
     */
    constructor(container, onClickSubmit) {
        this.controlsElt = {
            overlayCommentContainer: container
        }
        this.isOpen = false
        this.maxRating = 5
        this.onClickSubmit = onClickSubmit
    }

    setOpen () {
        this.isOpen = true
    }

    setClose () {
        this.isOpen = false
    }

    resetModal() {
        this.controlsElt.overlayCommentContainer.css({ top: '-160px'})
        this.controlsElt.overlayCommentContainer.empty()
        this.setClose()
    }

    showModal() {
        if (!this.isOpen) {
            this.controlsElt.overlayCommentContainer.css({ top: '326px'})
            this.setOpen()
        }
    }

    hideModal() {
        if (this.isOpen) {
            this.controlsElt.overlayCommentContainer.css({ top: '120px'})
            this.controlsElt.overlayCommentContainer.empty()
            this.setClose()
        }
    }

    generateAddCommentForm() {
        const overlayAddComment = $('<div class="overlay-add-comment"></div>')
        const overlayAddCommentTitle = $('<h2>Donner son avis</h2>')
        const overlayAddCommentForm = $('<form class="overlay-add-comment-form" onsubmit="return false"></form>')

        const overlayAddCommentFormComment = $('<div class="overlay-add-comment-form-comment"></div>')
        const overlayAddCommentFormCommentInput = $('<div class="overlay-add-comment-form-comment-input"></div>')
        const overlayAddCommentFormCommentInputTextArea = $('<textarea id="commentTextArea" placeholder="Commentaire..." maxlength="300" required></textarea>')
        overlayAddCommentFormCommentInput.append(overlayAddCommentFormCommentInputTextArea)
        overlayAddCommentFormComment.append(overlayAddCommentFormCommentInput)

        const overlayAddCommentFormNameRating = $('<div class="overlay-add-comment-form-name-rating"></div>')

        const overlayAddCommentFormNameInputContainer = $('<div class="overlay-add-comment-form-name-input"></div>')
        const overlayAddCommentFormNameInput = $('<input id="commentator" placeholder="Nom..." required />')

        const overlayAddCommentFormRatingSelectContainer = $('<div class="overlay-add-comment-form-rating-input"></div>')
        const overlayAddCommentFormRatingSelect = $('<select id="commentRating" required></select>')
        overlayAddCommentFormRatingSelect.append($('<option value="" class="hide">Note</option>'))
        for (let i = 0; i <= this.maxRating; i++) {
            overlayAddCommentFormRatingSelect.append($(`<option value="${i}">${i}</option>`))
        }
        overlayAddCommentFormNameInputContainer.append(overlayAddCommentFormNameInput)
        overlayAddCommentFormRatingSelectContainer.append(overlayAddCommentFormRatingSelect)

        overlayAddCommentFormNameRating.append(overlayAddCommentFormNameInputContainer, overlayAddCommentFormRatingSelectContainer)

        const overlayAddCommentFormBtnContainer = $('<div class="overlay-add-comment-form-submit"></div>')
        const overlayAddCommentFormBtnAdd = $('<button class="overlay-add-comment-form-submit-btn" type="submit" id="add">Ajouter</button>')
        overlayAddCommentForm.on('submit', () =>  {
            this.onClickSubmit()
        })

        const overlayAddCommentFormBtnCancel = $('<button class="overlay-add-comment-form-submit-btn" id="cancel">Annuler</button>')

        overlayAddCommentFormBtnCancel.on('click', () => {
            this.hideModal()
        })

        overlayAddCommentFormBtnContainer.append(overlayAddCommentFormBtnAdd, overlayAddCommentFormBtnCancel)

        overlayAddCommentForm.append(overlayAddCommentFormComment, overlayAddCommentFormNameRating, overlayAddCommentFormBtnContainer)

        overlayAddComment.append(overlayAddCommentTitle, overlayAddCommentForm)
        this.controlsElt.overlayCommentContainer.append(overlayAddComment)
    }
}

export { InterfaceAddComment }