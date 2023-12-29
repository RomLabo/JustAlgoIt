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
        this._model = model;
        this._view = view;
        this._currentType = null;
        this._mouseDown = false;
        this._addInProgress = false;
        this._linkInProgress = false;
        this._unlinkInProgress = false;

        // Handle main menu interactions
        this._view.bindAdd(this.handleAdd);
        this._view.bindUndo(this.handleUndo);
        this._view.bindRedo(this.handleRedo);
        this._view.bindSave(this.handleSave);
        this._view.bindOpen(this.handleOpen);
        this._view.bindNew(this.handleNew);

        // Handle other interactions
        this._view.bindChoise(this.handleChoise);
        this._view.bindWrite(this.handleWrite);
        this._view.bindMouseUp(this.handleMouseUp);
        this._view.bindMouseMove(this.handleMouseMove);
        this._view.bindMouseDown(this.handleMouseDown);
        this._view.bindDbClick(this.handleDbClick);

        // Handle node menu interactions
        this._view.bindLink(this.handleLink);
        this._view.bindUnlink(this.handleUnlink);
        this._view.bindModify(this.handleModify);
        this._view.bindBreakDown(this.handleBreakDown);
        this._view.bindDelete(this.handleDelete);
    }

    /**
     * 
     * @param {*} val 
     */
    handleAdd = val => {
        this._view.displayNodeMenuType();
        this._view.hideNodeMenu();
        this._addInProgress = true;
    }

    /**
     * 
     * @param {*} val 
     */
    handleUndo = val => {
        console.log(val);
        this._view.hideNodeMenu();
    }

    /**
     * 
     * @param {*} val 
     */
    handleRedo = val => {
        console.log(val);
        this._view.hideNodeMenu();
    }

    /**
     * 
     * @param {*} val 
     */
    handleSave = val => {
        console.log(val);
        this._view.hideNodeMenu();
    }

    /**
     * 
     * @param {*} val 
     */
    handleOpen = val => {
        console.log(val);
        this._view.hideNodeMenu();
    }

    /**
     * 
     * @param {*} val 
     */
    handleNew = val => {
        console.log(val);
        this._view.hideNodeMenu();
    }

    /**
     * 
     * @param {*} val 
     */
    handleChoise = val => {
        this._view.hideNodeMenuType();
        if (val !== "cancel") {
            this._view.displayNodeForm(Number(val));
            this._currentType = Number(val);
        }
    }

    /**
     * 
     * @param {*} val 
     */
    handleWrite = val => {
        if (this._addInProgress) {
            this._model.addNode(this._currentType, val);
            this._mouseDown = true;
            this._addInProgress = false;
        } else {
            this._model.modifyCurrentNode(val);
        }
    }

    /**
     * 
     * @param {*} val 
     */
    handleMouseUp = val => {
        this._mouseDown = false;
    }

    /**
     * 
     * @param {*} val 
     */
    handleMouseMove = val => {
        if (this._mouseDown) {
            this._model.moveCurrentNode(val.offsetX,val.offsetY);
        }
    }

    /**
     * 
     * @param {*} val 
     */
    handleMouseDown = val => {
        this._view.hideNodeMenu();
        this._view.hideTabMenu();
        if (this._model.nodeIsClicked(val)) {
            this._mouseDown = true;
        }

        if (this._linkInProgress) {
            this._mouseDown = false;
            this._model.linkCurrentNode();
            this._linkInProgress = false;
        }

        if (this._unlinkInProgress) {
            this._mouseDown = false;
            this._model.unlinkCurrentNode();
            this._unlinkInProgress = false;
        }
    }

    /**
     * 
     * @param {*} val 
     */
    handleDbClick = val => {
        this._mouseDown = false;
        if (this._model.nodeIsClicked(val)) {
            if (this._model.currentNodeType === 208 
                && !this._model.currentNodeHasLink
                && !this._model.nbAlgoLimitReached) {
                this._view.enableBreakDownBtn();
            }
            this._view.displayNodeMenu(val.clientX, val.offsetY);
        }
    }

    /**
     * 
     * @param {*} val 
     */
    handleLink = val => {
        this._view.hideNodeMenu();
        this._model.linkCurrentNode();
        this._linkInProgress = true;
    }

    /**
     * 
     * @param {*} val 
     */
    handleUnlink = val => {
        this._view.hideNodeMenu();
        this._model.unlinkCurrentNode();
        this._unlinkInProgress = true;
    }

    /**
     * 
     * @param {*} val 
     */
    handleModify = val => {
        this._view.hideNodeMenu();
        this._view.displayNodeFormPrefilled(
            this._model.currentNodeType, 
            this._model.currentNodeTxt
        );
    }

    /**
     * 
     * @param {*} val 
     */
    handleBreakDown = val => {
        console.log(val);
        this._view.hideNodeMenu();
    }

    /**
     * 
     * @param {*} val 
     */
    handleDelete = val => {
        this._view.hideNodeMenu();
        this._model.deleteCurrentNode();
    }
}