/*
0000000001 Author RomLabo 111111111
1000111000 Class Controller 1111111
1000000001 Created on 29/12/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class Controller
 * @description ...
 */
class Controller {
    constructor(model, view) {
        this._currentType = null;
        this._model = model;
        this._view = view;

        this._view.bindAdd(this.handleAdd);
        this._view.bindUndo(this.handleUndo);
        this._view.bindRedo(this.handleRedo);
        this._view.bindSave(this.handleSave);
        this._view.bindOpen(this.handleOpen);
        this._view.bindNew(this.handleNew);
        this._view.bindChoise(this.handleChoise);
        this._view.bindWrite(this.handleWrite);
    }

    handleAdd = val => {
        this._view.displayNodeMenuType();
    }

    handleUndo = val => {
        console.log(val);
    }

    handleRedo = val => {
        console.log(val);
    }

    handleSave = val => {
        console.log(val);
    }

    handleOpen = val => {
        console.log(val);
    }

    handleNew = val => {
        console.log(val);
    }

    handleChoise = val => {
        this._view.hideNodeMenuType();
        if (val !== "cancel") {
            this._view.displayNodeForm(Number(val));
            this._currentType = Number(val);
        }
    }

    handleWrite = val => {
        this._model.add(this._currentType, val);
    }
}