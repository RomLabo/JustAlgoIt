/*
0000000001 Author RomLabo 111111111
1000111000 Class JPresenter 1111111
1000000001 Created on 29/12/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JPresenter
 * @description Contains the information 
 * presentation logic and the status of 
 * the dialog with the user.
 */
class JPresenter {
    /**
     * Create a JPresenter.
     */
    constructor() {
        this._model = null;
        this._view = null;
    }

    set view(val) { this._view = val }
    get view() { return this._view }

    set model(val) { this._model = val }
    get model() { return this._model }

    /**
     * Removes the one-way relationship with the model.
     */
    unlinkModel() {
        if (this.model !== null) {
            this.model = null;
        }
    }

    /**
     * Create a one-way relationship with the model.
     * @param {JModel} model 
     */
    linkModel(model) {
        if (model !== null) {
            this.model = model
        }
    }

    /**
     * Removes the bidirectional relationship with the view.
     */
    unlinkView() {
        if (this.view !== null) {
            this.view.presenter = null;
            this.view = null;
        }
    }

    /**
     * Create a bidirectional relationship with the view.
     * @param {JView} view 
     */
    linkView(view) {
        if (view !== null) {
            this.unlinkView();
            view.unlinkPresenter();
            this.view = view;
            view.linkPresenter(this);
        }
    }

    handleAdd(event) {
        console.log("add");
    }

    handleUndo(event) {
        console.log("undo");
    }

    handleRedo(event) {
        console.log("redo");
    }

    handleSave(event) {
        console.log("save");
    }

    handleOpen(event) {
        console.log("open");
    }

    handleNew(event) {
        console.log("new");
    }
}
