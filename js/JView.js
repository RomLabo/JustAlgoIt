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
    // Privates properties
    #presenter;

    /**
     * Create a JView.
     */
    constructor() {
        this.#presenter = null;

        // Main canvas
        this.canvas = document.getElementById("main-canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth * .98;
        this.canvas.height = window.innerHeight * .9;
        this.lastCnWidth = this.canvas.width;
        this.lastCnvHeight = this.canvas.height;
        this.shiftKeyPressed = false;

        // Main canvas Landmarks
        this.vLandmark = document.getElementById("landmark-v");
        this.hLandmark = document.getElementById("landmark-h");

        // Main menu btn
        this.undoBtn = document.getElementById("main-undo");
        this.redoBtn = document.getElementById("main-redo");
        this.saveBtn = document.getElementById("main-save");
        this.newBtn = document.getElementById("main-new");

        // Node menu btn
        this.breakDownBtn = document.getElementById("node-breakdown");

        // Node menu
        this.nodeMenu = document.getElementById("node__nav");

        // Node type menu
        this.typeMenu = document.getElementById("type__nav");

        // Node form
        this.nodeForm = document.getElementById("node__form");
        this.validFormBtn = document.getElementById("form-valid");
        this.form = new JForm(this.nodeForm);

        // Tab menu
        this.tabMenu = document.getElementById("tab__menu");
        this.tabWrapper = document.getElementById("tab__wrapper");

        // File input
        this.fileInput = document.getElementById("file__input");

        this._keyOpAllowed = true;
    }

    get lastCnvSize() { return [this.lastCnWidth,this.lastCnvHeight] }
    get keyOpAllowed() { return this._keyOpAllowed }
    set keyOpAllowed(val) { this._keyOpAllowed = val } 
    get isShiftKey() { return this.shiftKeyPressed }

    set presenter(val) { this.#presenter = val }
    get presenter() { return this.#presenter }

    /**
     * @description Removes the bidirectional relationship 
     * with the presenter.
     */
    unlinkPresenter() {
        if (this.presenter !== null) {
            this.presenter.view = null;
            this.presenter = null;
        }
    }

    /**
     * @description Create a bidirectional relationship 
     * with the presenter.
     * @param {JPresenter} presenter 
     */
    linkPresenter(presenter) {
        if (presenter !== null) {
            this.unlinkPresenter();
            presenter.unlinkView();
            this.presenter = presenter;
            presenter.view = this;
            
            this.launchClickListener();
            this.launchMouseMoveListener();
            this.launchDbClickListener();
            this.launchMouseDownListener();
            this.launchMouseUpListener();
            this.launchResizeListener();
            this.launchLoadListener();
        }
    }

    /**
     * @description assigns the default canvas parameters
     * ( width, height, font-familly, line witdh).
     */
    setDefaultCanvasParams() {
        this.canvas.width = window.innerWidth * .98;
        this.canvas.height = window.innerHeight * .9;
        this.context.font = '16px verdana';
        this.context.lineWidth = 2;
    }

    /**
     * @description saves the last size taken by the canvas.
     */
    saveLastCanvasSize() {
        this.lastCnWidth = this.canvas.width;
        this.lastCnvHeight = this.canvas.height;
    }

    /**
     * @description Modifies the "download" attribute 
     * of the save button so that the download file 
     * has the same name as the application name.
     * @param {Number} index 
     */
    modifySaveBtn(index) {
        this.saveBtn.setAttribute(
            "download",
            `${this.tabWrapper.children[index].textContent}.png`    
        );
    } 

    /**
     * @description Enable the new button.
     */
    enableNewBtn() {
        this.newBtn.removeAttribute("disabled");
    }

    /**
     * @description Disable the new button.
     */
    disableNewBtn() {
        this.newBtn.setAttribute("disabled", true);
    }

    /**
     * @description Enable the undo button.
     */
    enableUndoBtn() {
        if (this.undoBtn.hasAttribute("disabled")) {
            this.undoBtn.removeAttribute("disabled");
        }
    }

    /**
     * @description Disable the undo button.
     */
    disableUndoBtn() {
        if (!this.undoBtn.hasAttribute("disabled")) {
            this.undoBtn.setAttribute("disabled", true);
        }
    }

    /**
     * @description Enable the redo button.
     */
    enableRedoBtn() {
        if (this.redoBtn.hasAttribute("disabled")) {
            this.redoBtn.removeAttribute("disabled");
        }
    }

    /**
     * @description Disable the redo button.
     */
    disableRedoBtn() {
        if (!this.redoBtn.hasAttribute("disabled")) {
            this.redoBtn.setAttribute("disabled", true);
        }
    }

    /**
     * @description Enable the breakdown button.
     */
    enableBreakDownBtn() {
        this.breakDownBtn.removeAttribute("disabled");
    }

    /**
     * @description Disable the breakdown button.
     */
    disableBreakDownBtn() {
        this.breakDownBtn.setAttribute("disabled", true);
    }

    /**
     * @description displays the type menu 
     * for the node.
     */
    displayNodeMenuType() {
        this.typeMenu.style.zIndex = 5;
    }

    /**
     * @description hides the type menu for
     * the node.
     */
    hideNodeMenuType() {
        this.typeMenu.style.zIndex = -5;
    }

    /**
     * @description Check if the form is completed 
     * to unlock the validation button.
     */
    checkNodeForm() {
        this.intervaleForm = setInterval(() => {
            if (this.form.isValid()) {
                this.validFormBtn.removeAttribute("disabled");
            } else {
                this.validFormBtn.setAttribute("disabled",true);
            }
        },100);
    }
    
    /**
     * @description Displays the node's text 
     * modification form.
     * @param {String} type 
     */
    displayNodeForm(type) {
        this.form.create(type);
        this.form.show(type);
        this.checkNodeForm();
    }

    /**
     * @description Displays the node text modification 
     * form already pre-filled with the node text.
     * @param {String} type 
     * @param {Array} txt 
     */
    displayNodeFormPrefilled(type, txt) {
        this.form.addTextInput(txt,type);
        this.form.show(type);
        this.checkNodeForm();
    }

    /**
     * @description displays the menu for the node at 
     * the coordinates (x,y) passed as parameters.
     * @param {Number} x // x coordinate of the menu 
     * @param {Number} y // y coordinate of the menu
     */
    displayNodeMenu(x,y) {
        if (x + this.nodeMenu.clientWidth>this.canvas.width) {
            this.nodeMenu.style.left = `${x-this.nodeMenu.clientWidth}px`;
        } else if (x - this.nodeMenu.clientWidth < 0) {
            this.nodeMenu.style.left = `${x}px`;
        } else {
            this.nodeMenu.style.left = `${x - 70}px`;    
        }

        if (y + this.nodeMenu.clientHeight>this.canvas.height) {
            this.nodeMenu.style.top = `${y - this.nodeMenu.clientHeight}px`;
        } else if (y - this.nodeMenu.clientHeight < 0) {
            this.nodeMenu.style.top = `${y}px`;
        } else {
            this.nodeMenu.style.top = `${y - 45}px`;    
        }

        this.nodeMenu.style.zIndex = 6;
    }

    /**
     * @description hides the menu for the node.
     */
    hideNodeMenu() {
        this.nodeMenu.style.zIndex = -6;
        this.disableBreakDownBtn();
    }

    /**
     * @description Display landmarks.
     */
    displayLandmarks(e) {
        this.vLandmark.style.left = `${(e.clientX)}px`;
        this.hLandmark.style.top = `${(e.offsetY)}px`;
        this.vLandmark.style.opacity = 1;
        this.hLandmark.style.opacity = 1;
    }

    /**
     * @description Hides landmarks.
     */
    hideLandmarks() {
        this.vLandmark.style.opacity = 0;
        this.hLandmark.style.opacity = 0;
    }

    /**
     * @description displays the tab menu.
     */
    displayTabMenu() {
        this.tabMenu.style.zIndex = 5;
    }

    /**
     * @description hides the tab menu
     */
    hideTabMenu() {
        this.tabMenu.style.zIndex = -5;
    }

    /**
     * @description applies the style specified by 
     * the Css class passed as a parameter to the tab.
     * @param {Number} index // index of tab element
     * @param {String} cssClassName // "tab-inactive" or "tab-active"
     */
    changeTabStyle(index, cssClassName) {
        document.getElementById(`tab-show-${index}`)
                .setAttribute("class",cssClassName);
    }

    /**
     * @description adds a new tab element with its 
     * close button to the parent container.
     */
    addTabElm(title, index) {
        let tabBtn = document.createElement("button");
        tabBtn.setAttribute("id",`tab-close-${index}`);
        tabBtn.setAttribute("title", "Fermer l'onglet");
        tabBtn.setAttribute("class","tab__close-btn");
        let tab = document.createElement("div");
        tab.setAttribute("id",`tab-show-${index}`);
        tab.setAttribute("class","tab-active");
        tab.textContent = title;
        tab.appendChild(tabBtn);
        this.tabWrapper.appendChild(tab);
    }

    /**
     * @description remove tab, all nodes and names 
     * linked to the closed tab.
     * @param {String} indexOfTabElm 
     */
    removeTab(indexOfTabElm) {
        this.tabWrapper.children[indexOfTabElm].remove();
    }

    /**
     * @description from the id of the closed tab updates 
     * the ids of the following tabs.
     * @param {Number} indexOfTabElm 
     */
    updateAllTabId(indexOfTabElm) {
        for (let i = indexOfTabElm; i < this.tabWrapper.children.length; i++) {
            this.tabWrapper.children[i].setAttribute("id",`tab-show-${i}`);
            this.tabWrapper.children[i].children[0].setAttribute("id",`tab-close-${i}`);
        }
    }

    /**
     * @description updates name of the current tab.
     * @param {Number} currentIndex 
     * @param {String} newName 
     */
    updateTabName(currentIndex, newName) {
        this.tabWrapper.children[currentIndex].firstChild.nodeValue = newName;
    }

    /**
     * @description Handles interactions with the main menu.
     * @param {String} action 
     */
    handleMainMenu(action) {
        this.keyOpAllowed = false; 
        switch (action) {
            case "add": this.presenter.handleAdd(); break;
            case "undo": this.presenter.handleUndo(); break;
            case "redo": this.presenter.handleRedo(); break;
            case "save": this.presenter.handleSave(); break;
            case "open": 
                this.fileInput.click();
                this.presenter.handleOpen(); 
                break;
            case "new":  
                this.presenter.handleNew(); 
                break;
            case "tab": this.presenter.handleShowTab(); break;
        }
    }

    /**
     * @description Handles interactions with the node menu.
     * @param {*} action 
     */
    handleNodeMenu(action) {
        switch (action) {
            case "link": this.presenter.handleLink(); break;
            case "unlink": this.presenter.handleUnlink(); break;
            case "modify": this.presenter.handleModify(); break;
            case "breakdown": this.presenter.handleBreakDown(); break;
            case "delete": this.presenter.handleDelete(); break;
        }
    }

    /**
     * @description
     * @param {*} action 
     */
    handleNodeForm(action) {
        if (action === "valid") {
            clearInterval(this.intervaleForm);
            this.presenter.handleWrite(this.form.inputsData);
            this.validFormBtn.setAttribute("disabled",true);
            this.keyOpAllowed = true;
        }
        this.form.hide();
    }

    /**
     * 
     * @param {*} action 
     * @param {*} tabNumber 
     */
    handleTabMenu(action, tabNumber) {
        if (action === "show") {
            this.presenter.handleChoiseTab(tabNumber);
        } else {
            this.presenter.handleCloseTab(tabNumber);
        }
    }

    /**
     * @description Starts the resize event listener.
     */
    launchResizeListener() {
        window.addEventListener("resize", (e) => {
            this.presenter.handleResize(e);
        })
    }

    /**
     * @description
     */
    launchLoadListener() {
        this.fileInput.addEventListener("change", (e) => {
            this.presenter.handleLoad(e);
        })
    }

    /**
     * @description Starts the click event listener.
     */
    launchClickListener() {
        window.addEventListener("click", (e) => {
            let btnData = e.target.id.split("-");
            switch (btnData[0]) {
                case "main": this.handleMainMenu(btnData[1]); break;
                case "type": this.presenter.handleChoise(btnData[1]); break;
                case "node": this.handleNodeMenu(btnData[1]); break;
                case "form": this.handleNodeForm(btnData[1]); break;
                case "tab": this.handleTabMenu(btnData[1],btnData[2]); break;
            }
        })
    }

    /**
     * @description Starts the mousemove event listener
     */
    launchMouseMoveListener() {
        window.addEventListener("mousemove", (e) => {
            if (e.target.nodeName === "CANVAS") {
                this.displayLandmarks(e);
                this.presenter.handleMouseMove(e)
            } else {
                this.hideLandmarks();
            }
        })
    }

    /**
     * 
     */
    launchMouseUpListener() {
        window.addEventListener("mouseup", (e) => {
            e.stopPropagation();
            this.presenter.handleMouseUp(e);
        });
    }

    /**
     * 
     */
    launchMouseDownListener() {
        this.canvas.addEventListener("mousedown", (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            this.presenter.handleMouseDown(e);
        })
    }

    /**
     * 
     */
    launchDbClickListener() {
        this.canvas.addEventListener("dblclick", (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            this.presenter.handleDbClick(e);
        })
    }
}