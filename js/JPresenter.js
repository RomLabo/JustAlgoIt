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
    // Private properties
    #addInProgress; #currentNodeType;
    #modifyInProgress;
    /**
     * Create a JPresenter.
     */
    constructor() {
        this._model = null;
        this._view = null;

        this.#currentNodeType = null;

        this._currentType = null;
        this._mouseDown = false;
        this._addInProgress = false;
        this._linkInProgress = false;
        this._unlinkInProgress = false;
        this._resizeInProgress = false;
        this._moveInProgress = false;

        this.#modifyInProgress = false;

        this._tabCounter = 1;
        this._tabNames = [["algo_1",0]];
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

    /**
     * 
     */
    handleResize() {
        if (!this._resizeInProgress) {
            this._resizeInProgress = true;
            this._view.setDefaultCanvasParams();
            this._model.resizeAllAlgo(this._view.lastCnvSize);
            this._view.saveLastCanvasSize();
            this._resizeInProgress = false;
        }
    }

    /**
     * 
     */
    handleAdd() {
        this._view.displayNodeMenuType();
        this._view.hideNodeMenu();
        this._view.hideTabMenu();
        this._addInProgress = true;
    }

    /**
     * 
     */
    handleUndo() {
        this._view.hideNodeMenu();
        this._view.hideTabMenu();
        this._model.previousOp();
        this._view.enableRedoBtn();
        if (this._model.isPreviousEmpty) {
            this._view.disableUndoBtn();
        }
        this._view.keyOpAllowed = true;
    }

    /**
     * 
     */
    handleRedo() {
        this._view.hideNodeMenu();
        this._view.hideTabMenu();
        this._model.forwardOp();
        this._view.enableUndoBtn();
        if (this._model.isForwardEmpty) {
            this._view.disableRedoBtn();
        }
        this._view.keyOpAllowed = true;
    }

    /**
     * 
     */
    handleSave() {
        console.log("save");
        this._view.hideNodeMenu();
        this._view.hideTabMenu();
        this._view.modifySaveBtn(this._model.currentAlgoIdx);
        this._model.downloadAlgo();
        this._view.keyOpAllowed = true;
    }

    /**
     * 
     */
    handleOpen() {
        this._view.hideNodeMenu();
        this._view.hideTabMenu();
        this._view.displayFileManager()
    }

    /**
     * 
     */
    handleNew() {
        this._tabCounter ++;
        this._view.disableRedoBtn();
        this._view.disableUndoBtn();
        this._view.hideNodeMenu();
        this._view.hideTabMenu();

        this._view.changeTabStyle(
            this._model.currentAlgoIdx, 
            "tab-inactive"
        );

        this._tabNames.push([`algo_${this._tabCounter}`,0]);
        this._model.addAlgo(`algo_${this._tabCounter}`);

        this._view.addTabElm(
            `algo_${this._tabCounter}`, 
            this._model.currentAlgoIdx
        );

        if (this._model.nbAlgoLimitReached) {
            this._view.disableNewBtn();
        }
        this._view.keyOpAllowed = true;
    }

    /**
     * 
     * @param {*} type 
     */
    handleTypeChoise(type) {
        this.view.hideTypeMenu();
        this._view.keyOpAllowed = true;
        if (type !== TYPE.NOTHING && type !== TYPE.BREAK) {
            this._view.keyOpAllowed = false;
            this.#currentNodeType = type;
            this.view.displayNodeForm(type);
        } else if (type === TYPE.BREAK) {
            this.model.addNode(type, [""] );
        }
    }

    /**
     * 
     * @param {*} action 
     */
    handleNodeForm(action) {
        this.view.hideForm();
        if (action === "valid") {
            if (this.#modifyInProgress) {
                this.model.modifyCurrentNode(
                    this.view.getDataForm()
                );
                this.#modifyInProgress = false;
            } else {
                this.model.addNode(
                    this.#currentNodeType, 
                    this.view.getDataForm()
                );
                this._model.startOperation(OP.ADD);
            }
            this._model.updateHistory();
            this._view.enableUndoBtn();
            this._view.disableRedoBtn();
        }   
    }

    /**
     * 
     */
    handleMouseUp() {
        this._mouseDown = false;
        if (this._moveInProgress) {
            this._model.updateHistory();
            this._view.enableUndoBtn();
            this._view.disableRedoBtn();
            this._moveInProgress = false;
        }
    }

    /**
     * 
     * @param {*} val 
     */
    handleMouseMove(val) {
        if (this._mouseDown) {
            this._model.moveCurrentNode(
                val.offsetX,
                val.offsetY
            );
        }
    }

    /**
     * 
     * @param {*} val 
     */
    handleMouseDown(val) {
        this._view.hideNodeMenu();
        this._view.hideTabMenu();
        this._view.hideTabMenu();

        if (this._model.nodeIsClicked(val)) {
            if (!this._linkInProgress 
                && !this._unlinkInProgress
                && !this._moveInProgress) {

                this._model.startOperation(OP.MOVE);
                this._moveInProgress = true;
            }
            this._mouseDown = true;
        }

        if (this._linkInProgress) {
            this._mouseDown = false;
            this._model.linkCurrentNode();
            this._model.updateHistory();
            this._view.enableUndoBtn();
            this._view.disableRedoBtn();
            this._linkInProgress = false;
        }

        if (this._unlinkInProgress) {
            this._mouseDown = false;
            this._model.unlinkCurrentNode();
            this._model.updateHistory();
            this._view.enableUndoBtn();
            this._view.disableRedoBtn();
            this._unlinkInProgress = false;
        }
    }

    /**
     * 
     * @param {*} val 
     */
    handleDbClick(val) {
        this._mouseDown = false;
        this._moveInProgress = false;
        if (this._model.nodeIsClicked(val)) {
            if (this._model.currentNodeType === TYPE.ISSUE 
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
    handleKeyDown = val => {
        
    }

    /**
     * 
     * @param {*} val 
     */
    handleKeyUp = val => {
        
    }

    /**
     * 
     */
    handleLink() {
        this._view.hideNodeMenu();
        this._model.linkCurrentNode();
        this._model.startOperation(OP.LINK);
        this._linkInProgress = true;
    }

    /**
     * 
     */
    handleUnlink() {
        this._view.hideNodeMenu();
        this._model.unlinkCurrentNode();
        this._model.startOperation(OP.UNLINK);
        this._unlinkInProgress = true;
    }

    /**
     * 
     */
    handleModify() {
        this._model.startOperation(OP.MODIF);
        this.#modifyInProgress = true;
        this._view.hideNodeMenu();
        this._view.displayNodeFormPrefilled(
            this._model.currentNodeType, 
            this._model.currentNodeTxt
        );
    }

    /**
     * 
     */
    handleBreakDown() {
        this._view.hideNodeMenu();
        this._tabNames[this._model.currentAlgoIdx][1] ++;

        this._view.changeTabStyle(
            this._model.currentAlgoIdx,
            "tab-inactive"
        );

        let title = `${this._tabNames[this._model.currentAlgoIdx][0]}.${this._tabNames[this._model.currentAlgoIdx][1]}`;

        this._tabCounter ++;
        this._tabNames.push([title,0]);

        let txt = [
            this._model.currentNodeTxt[0].join(' '),
            this._model.currentNodeTxt[1].join('\n'),
            this._model.currentNodeTxt[2].join(' ')
        ];

        this._model.modifyCurrentNode([
            txt[0],
            txt[1] += `\n ( ${title} )`,
            txt[2]
        ]);

        this._model.addAlgo(`algo_${this._tabCounter}`);
        this._model.addNode(208,txt);

        this._view.addTabElm(
            `algo_${this._tabCounter}`, 
            this._model.currentAlgoIdx
        );

        if (this._model.nbAlgoLimitReached) {
            this._view.disableNewBtn();
        }

        this._view.enableUndoBtn();
        this._view.disableRedoBtn();
    }

    /**
     * 
     */
    handleDelete() {
        this._view.hideNodeMenu();
        this._model.startOperation(OP.DEL);
        this._model.deleteCurrentNode();
        this._model.updateHistory();
    }

    /**
     * 
     */
    handleShowTab() {
        this._view.hideNodeMenu();
        this._view.displayTabMenu();
    }

    /**
     * 
     * @param {*} val 
     */
    handleChoiseTab(val) {
        if (Number(val) !== this._model.currentAlgoIdx) {
            this._view.changeTabStyle(
                this._model.currentAlgoIdx,
                "tab-inactive"
            );
    
            this._model.changeCurrentAlgo(Number(val));

            if (this._model.isForwardEmpty) {
                this._view.disableRedoBtn();
            } else {
                this._view.enableRedoBtn();
            }

            if (this._model.isPreviousEmpty) {
                this._view.disableUndoBtn();
            } else {
                this._view.enableUndoBtn();
            }
    
            this._view.changeTabStyle(
                this._model.currentAlgoIdx,
                "tab-active"
            );
        }
    }

    /**
     * 
     * @param {*} val 
     */
    handleCloseTab(val) {
        this._view.removeTab(Number(val));
        this._view.updateAllTabId(Number(val));
        this._tabNames.splice(Number(val),1);

        this._view.changeTabStyle(
            Number(val) - 1,
            "tab-active"
        );

        this._model.deleteCurrentAlgo();

        if (this._model.isForwardEmpty) {
            this._view.disableRedoBtn();
        } else {
            this._view.enableRedoBtn();
        }

        if (this._model.isPreviousEmpty) {
            this._view.disableUndoBtn();
        } else {
            this._view.enableUndoBtn();
        }

        if (!this._model.nbAlgoLimitReached) {
            this._view.enableNewBtn();
        }
    }

    /**
     * 
     * @param {*} val 
     */
    handleLoad(val) {
        this._view.keyOpAllowed = false;
        if (val.target.files.length > 0) {
            try {
                this._model.loadAlgo(val);
            
                this._view.updateTabName(
                    this._model.currentAlgoIdx, 
                    val.target.files[0].name.split(".png")[0]
                );

                this._tabNames[this._model.currentAlgoIdx][0] = val.target.files[0].name.split(".png")[0];
            } catch (error) {
                console.error(error); // PENSER A AFFICHER MESSAGE ERREUR
            }

            setTimeout(() => {
                if (!this._model.isPreviousEmpty) {
                    this._view.enableUndoBtn();
                }
            }, 2000);
        }
        this._view.keyOpAllowed = true;
    }
}
