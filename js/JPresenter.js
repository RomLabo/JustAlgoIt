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
 * @description ...
 */
class JPresenter {
    constructor(model, view) {
        this._model = model;
        this._view = view;
        this._currentType = null;
        this._mouseDown = false;
        this._addInProgress = false;
        this._linkInProgress = false;
        this._unlinkInProgress = false;
        this._resizeInProgress = false;

        this._tabCounter = 1;
        this._tabNames = [["algo_1",0]];

        // Handle resize window
        this._view.bindResize(this.handleResize);

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

        // Handle tab menu interactions
        this._view.bindShowTab(this.handleShowTab);
        this._view.bindTabClick(
            this.handleChoiseTab, this.handleCloseTab
        );

        // Handle file loading
        this._view.bindLoad(this.handleLoad);
    }

    /**
     * 
     * @param {*} val 
     */
    handleResize = val => {
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
     * @param {*} val 
     */
    handleAdd = val => {
        this._view.displayNodeMenuType();
        this._view.hideNodeMenu();
        this._view.hideTabMenu();
        this._addInProgress = true;
    }

    /**
     * 
     * @param {*} val 
     */
    handleUndo = val => {
        console.log(val);
        this._view.hideNodeMenu();
        this._view.hideTabMenu();
    }

    /**
     * 
     * @param {*} val 
     */
    handleRedo = val => {
        console.log(val);
        this._view.hideNodeMenu();
        this._view.hideTabMenu();
    }

    /**
     * 
     * @param {*} val 
     */
    handleSave = val => {
        this._view.hideNodeMenu();
        this._view.hideTabMenu();
        this._view.modifySaveBtn(this._model.currentAlgoIdx);
        this._model.downloadAlgo();
    }

    /**
     * 
     * @param {*} val 
     */
    handleOpen = val => {
        this._view.hideNodeMenu();
        this._view.hideTabMenu();
    }

    /**
     * 
     * @param {*} val 
     */
    handleNew = val => {
        this._tabCounter ++;
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
    }

    /**
     * 
     * @param {*} val 
     */
    handleDelete = val => {
        this._view.hideNodeMenu();
        this._model.deleteCurrentNode();
    }

    /**
     * 
     * @param {*} val 
     */
    handleShowTab = val => {
        this._view.hideNodeMenu();
        this._view.displayTabMenu();
    }

    /**
     * 
     * @param {*} val 
     */
    handleChoiseTab = val => {
        if ((Number(val.target.id.split("_")[1]) 
                    !== this._model.currentAlgoIdx)) {
            this._view.changeTabStyle(
                this._model.currentAlgoIdx,
                "tab-inactive"
            );
    
            this._model.changeCurrentAlgo(
                Number(val.target.id.split("_")[1])
            );
    
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
    handleCloseTab = val => {
        this._view.removeTab(val.target.id);
        this._view.updateAllTabId(val.target.id);

        this._tabNames.splice(
            Number(val.target.id.split("_")[3]),1
        );

        this._view.changeTabStyle(
            Number(val.target.id.split("_")[3] - 1),
            "tab-active"
        );

        this._model.deleteCurrentAlgo();

        if (!this._model.nbAlgoLimitReached) {
            this._view.enableNewBtn();
        }
    }

    /**
     * 
     * @param {*} val 
     */
    handleLoad = val => {
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
        }
    }
}

const app = new JPresenter(new JModel(), new JView());