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
     * Private properties
     */
    #view; #model; #currentNodeType;
    #modifyInProgress; #mouseDown;
    #linkInProgress; #unlinkInProgress;
    #resizeInProgress; #modeInProgress;
    #tabCounter; #tabNames;
    
    /**
     * Create a Presenter.
     */
    constructor() {
        this.#model = null;
        this.#view = null;
        this.#currentNodeType = null;
        this.#mouseDown = false;
        this.#linkInProgress = false;
        this.#unlinkInProgress = false;
        this.#resizeInProgress = false;
        this.#modeInProgress = false;
        this.#modifyInProgress = false;
        this.#tabCounter = 1;
        this.#tabNames = [["algo_1",0]];
    }

    set view(val) { this.#view = val }
    get view() { return this.#view }

    set model(val) { this.#model = val }
    get model() { return this.#model }

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
        if (!this.#resizeInProgress) {
            this.#resizeInProgress = true;
            this.view.setDefaultCanvasParams();
            this.model.resizeAllAlgo(this.view.lastCnvSize);
            this.view.saveLastCanvasSize();
            this.#resizeInProgress = false;
        }
    }

    /**
     * 
     */
    handleAdd() {
        this.view.keyOpAllowed = false;
        this.view.displayTypeMenu();
        this.view.hideNodeMenu();
        this.view.hideTabMenu();
    }

    /**
     * 
     */
    handleUndo() {
        this.view.hideNodeMenu();
        this.view.hideTabMenu();
        this.model.previousOp();
        this.view.enableRedoBtn();
        if (this.model.isPreviousEmpty) {
            this.view.disableUndoBtn();
        }
        this.view.keyOpAllowed = true;
    }

    /**
     * 
     */
    handleRedo() {
        this.view.hideNodeMenu();
        this.view.hideTabMenu();
        this.model.forwardOp();
        this.view.enableUndoBtn();
        if (this.model.isForwardEmpty) {
            this.view.disableRedoBtn();
        }
        this.view.keyOpAllowed = true;
    }

    /**
     * 
     */
    handleSave() {
        this.view.hideNodeMenu();
        this.view.hideTabMenu();
        this.view.modifySaveBtn(this.model.currentAlgoIdx);
        this.model.downloadAlgo();
        this.view.keyOpAllowed = true;
    }

    /**
     * 
     */
    handleOpen() {
        this.view.hideNodeMenu();
        this.view.hideTabMenu();
        this.view.displayFileManager()
    }

    /**
     * 
     */
    handleNew() {
        this.#tabCounter ++;
        this.view.disableRedoBtn();
        this.view.disableUndoBtn();
        this.view.hideNodeMenu();
        this.view.hideTabMenu();

        this.view.changeTabStyle(
            this.model.currentAlgoIdx, "tab-inactive"
        );

        this.#tabNames.push([`algo_${this.#tabCounter}`,0]);
        this.model.addAlgo(`algo_${this.#tabCounter}`);

        this.view.addTabElm(
            `algo_${this.#tabCounter}`, 
            this.model.currentAlgoIdx
        );

        if (this.model.nbAlgoLimitReached) {
            this.view.disableNewBtn();
        }
        this.view.keyOpAllowed = true;
    }

    /**
     * 
     * @param {*} type 
     */
    handleTypeChoise(type) {
        this.view.hideTypeMenu();
        if (type !== TYPE.NOTHING && type !== TYPE.BREAK) {
            this.view.keyOpAllowed = false;
            this.#currentNodeType = type;
            this.view.displayNodeForm(type);
        } else if (type === TYPE.BREAK) {
            this.#currentNodeType = type;
            this.model.addNode(type, [""] );
            this.model.startOperation(OP.ADD);
            this.model.updateHistory();
            this.view.keyOpAllowed = true;
        } else if (type === TYPE.NOTHING) {
            this.view.keyOpAllowed = true;
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
                this.model.startOperation(OP.ADD);
            }
            this.model.updateHistory();
            this.view.enableUndoBtn();
            this.view.disableRedoBtn();
        }
        this.view.keyOpAllowed = true;   
    }

    /**
     * 
     */
    handleMouseUp() {
        this.#mouseDown = false;
        if (this.#modeInProgress) {
            this.model.updateHistory();
            this.view.enableUndoBtn();
            this.view.disableRedoBtn();
            this.#modeInProgress = false;
        }
    }

    /**
     * 
     * @param {*} val 
     */
    handleMouseMove(val) {
        if (this.#mouseDown) {
            this.model.moveCurrentNode(
                val.offsetX, val.offsetY
            );
        }
    }

    /**
     * 
     * @param {*} val 
     */
    handleMouseDown(val) {
        this.view.hideNodeMenu();
        this.view.hideTabMenu();
        this.view.hideTabMenu();

        if (this.model.nodeIsClicked(val)) {
            if (!this.#linkInProgress 
                && !this.#unlinkInProgress
                && !this.#modeInProgress) {
                    this.model.startOperation(OP.MOVE);
                    this.#modeInProgress = true;
            }
            this.#mouseDown = true;
        } else { this.model.abortOperation(); }

        if (this.#linkInProgress) {
            this.#mouseDown = false;
            this.model.linkCurrentNode();
            this.model.updateHistory();
            this.view.enableUndoBtn();
            this.view.disableRedoBtn();
            this.#linkInProgress = false;
        }

        if (this.#unlinkInProgress) {
            this.#mouseDown = false;
            this.model.unlinkCurrentNode();
            this.model.updateHistory();
            this.view.enableUndoBtn();
            this.view.disableRedoBtn();
            this.#unlinkInProgress = false;
        }
    }

    /**
     * 
     * @param {*} val 
     */
    handleDbClick(val) {
        this.#mouseDown = false;
        this.#modeInProgress = false;
        if (this.model.nodeIsClicked(val)) {
            if (this.model.currentNode.type === TYPE.ISSUE 
                && !this.model.currentNodeHasLink
                && !this.model.nbAlgoLimitReached) {
                this.view.enableBreakDownBtn();
            }
            this.view.displayNodeMenu(val.clientX, val.offsetY);
        }
    }

    /**
     * 
     */
    handleLink() {
        if (this.model.historyOpInProgress) {
            this.model.abortOperation();
        }
        this.view.hideNodeMenu();
        this.model.linkCurrentNode();
        this.model.startOperation(OP.LINK);
        this.#linkInProgress = true;
    }

    /**
     * 
     */
    handleUnlink() {
        if (this.model.historyOpInProgress) {
            this.model.abortOperation();
        }
        this.view.hideNodeMenu();
        this.model.unlinkCurrentNode();
        this.model.startOperation(OP.LINK);
        this.#unlinkInProgress = true;
    }

    /**
     * 
     */
    handleModify() {
        this.view.keyOpAllowed = false;
        this.model.startOperation(OP.MODIF);
        this.#modifyInProgress = true;
        this.view.hideNodeMenu();
        this.view.displayNodeFormPrefilled(
            this.model.currentNode.type, 
            this.model.currentNode.txt
        );
    }

    /**
     * 
     */
    handleBreakDown() {
        this.view.hideNodeMenu();
        this.#tabNames[this.model.currentAlgoIdx][1] ++;

        this.view.changeTabStyle(
            this.model.currentAlgoIdx, "tab-inactive"
        );

        let title = `${this.#tabNames[this.model.currentAlgoIdx][0]}.${this.#tabNames[this.model.currentAlgoIdx][1]}`;

        this.#tabCounter ++;
        this.#tabNames.push([title,0]);

        let txt = [
            this.model.currentNode.txt[0].join(' '),
            this.model.currentNode.txt[1].join('\n'),
            this.model.currentNode.txt[2].join(' ')
        ];

        this.model.modifyCurrentNode([
            txt[0], txt[1] += `\n ( ${title} )`, txt[2]
        ]);

        this.model.addAlgo(`algo_${this.#tabCounter}`);
        this.model.addNode(TYPE.ISSUE, txt);

        this.view.addTabElm(
            `algo_${title}`, this.model.currentAlgoIdx
        );

        if (this.model.nbAlgoLimitReached) {
            this.view.disableNewBtn();
        }

        this.view.enableUndoBtn();
        this.view.disableRedoBtn();
    }

    /**
     * 
     */
    handleDelete() {
        this.view.hideNodeMenu();
        this.model.startOperation(OP.DEL);
        this.model.deleteCurrentNode();
        this.model.updateHistory();
    }

    /**
     * 
     */
    handleShowTab() {
        this.view.hideNodeMenu();
        this.view.displayTabMenu();
    }

    /**
     * 
     * @param {*} val 
     */
    handleChoiseTab(val) {
        if (Number(val) !== this.model.currentAlgoIdx) {
            this.view.changeTabStyle(
                this.model.currentAlgoIdx, "tab-inactive"
            );
    
            this.model.changeCurrentAlgo(Number(val));

            if (this.model.isForwardEmpty) {
                this.view.disableRedoBtn();
            } else { this.view.enableRedoBtn(); }

            if (this.model.isPreviousEmpty) {
                this.view.disableUndoBtn();
            } else { this.view.enableUndoBtn(); }
    
            this.view.changeTabStyle(
                this.model.currentAlgoIdx, "tab-active"
            );
        }
    }

    /**
     * 
     * @param {*} val 
     */
    handleCloseTab(val) {
        this.view.removeTab(Number(val));
        this.view.updateAllTabId(Number(val));
        this.#tabNames.splice(Number(val),1);

        this.view.changeTabStyle(
            Number(val) - 1, "tab-active"
        );

        this.model.deleteCurrentAlgo();

        if (this.model.isForwardEmpty) {
            this.view.disableRedoBtn();
        } else { this.view.enableRedoBtn(); }

        if (this.model.isPreviousEmpty) {
            this.view.disableUndoBtn();
        } else { this.view.enableUndoBtn(); }

        if (!this.model.nbAlgoLimitReached) {
            this.view.enableNewBtn();
        }
    }

    /**
     * 
     * @param {*} val 
     */
    handleLoad(val) {
        this.view.keyOpAllowed = false;
        if (val.target.files.length > 0) {
            try {
                this.model.loadAlgo(val);
            
                this.view.updateTabName(
                    this.model.currentAlgoIdx, 
                    val.target.files[0].name.split(".png")[0]
                );

                this.#tabNames[this.model.currentAlgoIdx][0] = val.target.files[0].name.split(".png")[0];
            } catch (error) { console.error(error); } // PENSER A AFFICHER MESSAGE ERREUR

            setTimeout(() => {
                if (!this.model.isPreviousEmpty) {
                    this.view.enableUndoBtn();
                }
            }, 2000);
        }
        this.view.keyOpAllowed = true;
    }
}
