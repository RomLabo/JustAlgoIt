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
    #resizeInProgress; #moveInProgress;
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
        this.#moveInProgress = false;
        this.#modifyInProgress = false;
        this.#tabCounter = 1;
        this.#tabNames = [["algo_1",0]];
    }

    set view(val) { this.#view = val }
    get view() { return this.#view }

    set model(val) { this.#model = val }
    get model() { return this.#model }

    /**
     * @description Removes the one-way relationship with the model.
     */
    unlinkModel() {
        if (this.model !== null) {
            this.model = null;
        }
    }

    /**
     * @description Create a one-way relationship with the model.
     * @param {JModel} model 
     */
    linkModel(model) {
        if (model !== null) {
            this.model = model
        }
    }

    /**
     * @description Removes the bidirectional relationship with the view.
     */
    unlinkView() {
        if (this.view !== null) {
            this.view.presenter = null;
            this.view = null;
        }
    }

    /**
     * @description Create a bidirectional relationship with the view.
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
     * @description Resizes the canvas and recalculates node
     * positions when the window is resized.
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
     * @description Displays the node type selection menu
     */
    handleAdd() {
        this.view.keyOpAllowed = false;
        this.view.displayTypeMenu();
        this.view.hideNodeMenu();
        this.view.hideTabMenu();
    }

    /**
     * @description Go back in the modification history.
     */
    handleUndo() {
        this.view.hideNodeMenu();
        this.view.hideTabMenu();
        this.model.previousOp();

        if (!this.model.isForwardEmpty) {
            this.view.enableRedoBtn();
        }

        if (this.model.isPreviousEmpty) {
            this.view.disableUndoBtn();
        }

        this.view.keyOpAllowed = true;
    }

    /**
     * @description Move backwards in the modification history
     */
    handleRedo() {
        this.view.hideNodeMenu();
        this.view.hideTabMenu();
        this.model.forwardOp();

        if (!this.model.isPreviousEmpty) {
            this.view.enableUndoBtn();
        }

        if (this.model.isForwardEmpty) {
            this.view.disableRedoBtn();
        }

        this.view.keyOpAllowed = true;
    }

    /**
     * @description Launches algorithm save.
     */
    handleSave() {
        this.view.hideNodeMenu();
        this.view.hideTabMenu();
        this.view.modifySaveBtn(this.model.currentAlgoIdx);
        this.model.downloadAlgo();
        this.view.keyOpAllowed = true;
    }

    /**
     * @description Opens the file selection screen.
     */
    handleOpen() {
        this.view.hideNodeMenu();
        this.view.hideTabMenu();
        this.view.displayFileManager()
    }

    /**
     * @description Create a new tab.
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
     * @description Manages the type of node selected and
     * depending on the type, displays the form for 
     * entering values. 
     * @param {TYPE} type // Type of node  
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
            this.model.startHistoryOp(OP.ADD);
            this.model.stopHistoryOp();
            this.view.keyOpAllowed = true;
        } else if (type === TYPE.NOTHING) {
            this.view.keyOpAllowed = true;
        }
    }

    /**
     * @description Manages form submission and updates
     * data entered in the node to be modified.
     * @param {String} action // "valider" or "annuler" 
     */
    handleNodeForm(action) {
        this.view.hideForm();
        if (action === "valid") {
            if (this.#modifyInProgress) {
                this.model.startHistoryOp(OP.MODIF);
                this.model.modifyCurrentNode(
                    this.view.getDataForm()
                );
                this.#modifyInProgress = false;
            } else {
                this.model.addNode(
                    this.#currentNodeType, 
                    this.view.getDataForm()
                );
                this.model.startHistoryOp(OP.ADD);
            }
            this.model.stopHistoryOp();
            this.view.enableUndoBtn();
            this.view.disableRedoBtn();
        }
        this.view.keyOpAllowed = true;   
    }

    /**
     * @description Manages the mouse up event
     */
    handleMouseUp() {
        this.#mouseDown = false;
        if (this.#moveInProgress) {
            this.model.stopHistoryOp();
            this.view.enableUndoBtn();
            this.view.disableRedoBtn();
            this.#moveInProgress = false;
        }
    }

    /**
     * @description Manages the mouse move event
     * @param {Event} event 
     */
    handleMouseMove(event) {
        if (this.#mouseDown) {
            this.model.moveCurrentNode(
                event.offsetX, event.offsetY
            );
        }
    }

    /**
     * @description Manages the mouse down event and
     * determines whether the click has taken place 
     * on a node.
     * @param {Event} event 
     */
    handleMouseDown(event) {
        this.view.hideNodeMenu();
        this.view.hideTabMenu();
        this.view.hideTabMenu();

        if (this.model.nodeIsClicked(event)) {
            if (!this.#linkInProgress 
                && !this.#unlinkInProgress
                && !this.#moveInProgress) {
                    this.model.startHistoryOp(OP.MOVE);
                    this.#moveInProgress = true;
            }

            this.#mouseDown = true;
        } else { 
            this.model.abortOperation(); 
            console.log("abort op");
        }

        if (this.#linkInProgress) {
            this.#mouseDown = false;
            this.model.startHistoryOp(OP.LINK);
            this.model.linkCurrentNode();
            this.model.stopHistoryOp();
            this.view.enableUndoBtn();
            this.view.disableRedoBtn();
            this.#linkInProgress = false;
        }

        if (this.#unlinkInProgress) {
            this.#mouseDown = false;
            this.model.startHistoryOp(OP.LINK);
            this.model.unlinkCurrentNode();
            this.model.stopHistoryOp();
            this.view.enableUndoBtn();
            this.view.disableRedoBtn();
            this.#unlinkInProgress = false;
        }
    }

    /**
     * @description Manages the right click event 
     * and determines whether the click has taken place 
     * on a node, if so displays the node's menu.
     * @param {Event} event 
     */
    handleRightClick(event) {
        this.#mouseDown = false;
        this.#moveInProgress = false;
        if (this.model.nodeIsClicked(event)) {
            if (this.model.currentNode.type === TYPE.ISSUE 
                && !this.model.currentNodeHasLink
                && !this.model.nbAlgoLimitReached) {
                this.view.enableBreakDownBtn();
            }
            this.view.displayNodeMenu(event.clientX, event.offsetY);
        }
    }

    /**
     * @description Manages the addition of a link
     * between two nodes.
     */
    handleLink() {
        if (this.model.historyOpInProgress) {
            this.model.abortOperation();
        }
        this.view.hideNodeMenu();
        this.model.linkCurrentNode();
        this.#linkInProgress = true;
    }

    /**
     * @description Manages the deletion of a link
     * between two nodes.
     */
    handleUnlink() {
        if (this.model.historyOpInProgress) {
            this.model.abortOperation();
        }
        this.view.hideNodeMenu();
        this.model.unlinkCurrentNode();
        this.#unlinkInProgress = true;
    }

    /**
     * @description Manages node modification.
     */
    handleModify() {
        this.view.keyOpAllowed = false;
        this.#modifyInProgress = true;
        this.view.hideNodeMenu();
        this.view.displayNodeFormPrefilled(
            this.model.currentNode.type, 
            this.model.currentNode.txt
        );
    }

    /**
     * @description Manages node break down in a 
     * new algorithm accessible in the new create tab.
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
     * @description Manages node deletion.
     */
    handleDelete() {
        this.view.hideNodeMenu();
        this.model.startHistoryOp(OP.DEL);
        this.model.stopHistoryOp();
        this.model.deleteCurrentNode();
    }

    /**
     * @description Manages tab selector display
     */
    handleShowTab() {
        this.view.hideNodeMenu();
        this.view.displayTabMenu();
    }

    /**
     * @description Manages the display of the
     * selected tab. 
     * @param {String} val // id of tab
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
     * @description Closes the selected tab.
     * @param {String} val // id of tab 
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
     * @description Manages the loading of a file 
     * containing an algorithm.
     * @param {Event} event 
     */
    handleLoad(event) {
        this.view.keyOpAllowed = false;
        if (event.target.files.length > 0) {
            try {
                this.model.loadAlgo(event);
            
                this.view.updateTabName(
                    this.model.currentAlgoIdx, 
                    event.target.files[0].name.split(".png")[0]
                );

                this.#tabNames[this.model.currentAlgoIdx][0] = event.target.files[0].name.split(".png")[0];
            } catch (error) { console.error(error); } // PENSER A AFFICHER MESSAGE ERREUR

            setTimeout(() => {
                if (this.model.isPreviousEmpty) {
                    this.view.disableUndoBtn();
                } else { this.view.enableUndoBtn(); }

                if (this.model.isForwardEmpty) {
                    this.view.disableRedoBtn();
                } else { this.view.enableRedoBtn(); }
            }, 2000);
        }
        this.view.keyOpAllowed = true;
    }
}
