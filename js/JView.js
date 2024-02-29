/*
0000000001 Author RomLabo 111111111
1000111000 Class JView 111111111111
1000000001 Created on 29/12/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JView
 * @description Delegates interaction to the presenter.
 */
class JView {
    /**
     * Create a JView.
     */
    constructor() {
        this._presenter = null;
        this._mainMenu = document.getElementById("header__nav");
    }

    set presenter(val) { this._presenter = val }
    get presenter() { return this._presenter }

    /**
     * Removes the bidirectional relationship with the presenter.
     */
    unlinkPresenter() {
        if (this.presenter !== null) {
            this.presenter.view = null;
            this.presenter = null;
        }
    }

    /**
     * Create a bidirectional relationship with the presenter.
     * @param {JPresenter} presenter 
     */
    linkPresenter(presenter) {
        if (presenter !== null) {
            this.unlinkPresenter();
            presenter.unlinkView();
            this.presenter = presenter;
            presenter.view = this;
            this.lauchClickListener();
        }
    }

    /**
     * 
     * @param {String} action 
     * @param {Event} event 
     */
    mainMenuHandler(action, event) {
        switch (action) {
            case "add": this.presenter.handleAdd(event); break;
            case "undo": this.presenter.handleUndo(event); break;
            case "redo": this.presenter.handleRedo(event); break;
            case "save": this.presenter.handleSave(event); break;
            case "open": this.presenter.handleOpen(event); break;
            case "new": this.presenter.handleNew(event); break;
            default: console.error("Action not recognized"); break;
        }
    }

    lauchClickListener() {
        window.addEventListener("click", (e) => {
            let btnData = e.target.id.split("-");
            switch (btnData[0]) {
                case "main": this.mainMenuHandler(btnData[1],e); break;
                //case "type": typeMenuHandler(btnData[1],e); break;
                //case "node": this.nodeMenuHandler(btnData[1],e); break;
                default: console.error("Menu name not recognized"); break;
            }
        })
    }
}