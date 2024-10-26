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
     * Private properties
     */
    #presenter; #nodeMenu; #tabWrapper
    #inputsDefaultTxt; #modifyId; #linkId;
    #unlinkId; #breakDownId; #deleteId;
    #fileInputId; #saveId; #newId;
    #undoId; #redoId; #vMarkId; #context;
    #hMarkId; #keyOpAllowed; #shiftPressed;
    #addId; #openId; #infoId; #canvas;
    #lastCnvWidth; #lastCnvHeight;
    #tabMenu; #form; #formValidId;
    
    /**
     * * @description Create a View.
     */
    constructor() {
        this.#presenter = null;

        this.#canvas = document.getElementById("main-canvas");
        this.#context = this.#canvas.getContext("2d");
        this.#canvas.width = window.innerWidth * .98;
        this.#canvas.height = window.innerHeight * .9;
        this.#lastCnvWidth = this.#canvas.width;
        this.#lastCnvHeight = this.#canvas.height;

        this.#modifyId = "node-modify";
        this.#linkId = "node-link";
        this.#unlinkId = "node-unlink";
        this.#breakDownId = "node-breakdown";
        this.#deleteId = "node-delete";
        this.#fileInputId = "file__input";

        this.#saveId = "menu-save";
        this.#newId = "menu-new";
        this.#undoId = "menu-undo";
        this.#redoId = "menu-redo";
        this.#addId = "menu-add";
        this.#openId = "menu-open";
        this.#infoId = "menu-info";

        this.#hMarkId = "landmark-h";
        this.#vMarkId = "landmark-v";

        this.#keyOpAllowed = true;
        this.#shiftPressed = false;

        this.#nodeMenu = document.getElementById("node__nav");
        this.#formValidId = "form-valid";
        this.#form = new JForm("node__form");

        this.#tabMenu = document.getElementById("tab__menu");
        this.#tabWrapper = document.getElementById("tab__wrapper");

        this.disableRedoBtn();
        this.disableUndoBtn();
    }

    get lastCnvSize() { return [this.#lastCnvWidth, this.#lastCnvHeight] }
    get isShiftKey() { return this.#shiftPressed }

    set presenter(val) { this.#presenter = val }
    get presenter() { return this.#presenter }

    set keyOpAllowed(val) { this.#keyOpAllowed = val } 
    get keyOpAllowed() { return this.#keyOpAllowed }

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
            this.launchContextMenuListener();
            this.launchMouseDownListener();
            this.launchMouseUpListener();
            this.launchFileListener();
            this.launchResizeListener();
            this.launchKeyDownListener();
            this.launchKeyUpListener();
        }
    }

    /**
     * @description Returns an Html Element object with
     * the id passed in parameter.
     * @param {String} idOfElm 
     * @returns Object
     */
    getElm(idOfElm) {
        return document.getElementById(idOfElm);
    }

    /**
     * @description assigns the default canvas parameters
     * ( width, height, font-familly, line witdh).
     */
    setDefaultCanvasParams() {
        this.#canvas.width = window.innerWidth * .98;
        this.#canvas.height = window.innerHeight * .9;
        this.#context.font = '2vh verdana';
        this.#context.lineWidth = 2;
    }

    /**
     * @description saves the last size taken by the canvas.
     */
    saveLastCanvasSize() {
        this.#lastCnvWidth = this.#canvas.width;
        this.#lastCnvHeight = this.#canvas.height;
    }

    /**
     * @description Modifies the "download" attribute 
     * of the save button so that the download file 
     * has the same name as the application name.
     * @param {Number} index 
     */
    modifySaveBtn(index) {
        this.getElm(this.#saveId).setAttribute(
            "download",
            `${this.#tabWrapper.children[index].textContent}.png`    
        );
    } 

    /**
     * @description Check if the form is completed 
     * to unlock the validation button.
     */
    checkNodeForm() {
        this.intervaleForm = setInterval(() => {
            if (this.#form.isValid()) {
                this.getElm(this.#formValidId)
                    .removeAttribute("disabled");
            } else {
                this.getElm(this.#formValidId)
                    .setAttribute("disabled",true);
            }
        },100);
    }
    
    /**
     * @description Displays the node's text 
     * modification form.
     * @param {Number} type 
     */
    displayNodeForm(type) {
        this.#form.create(type);
        this.#form.show(type);
        this.checkNodeForm();
    }

    /**
     * @description Displays the node text modification 
     * form already pre-filled with the node text.
     * @param {Number} type 
     * @param {Array} txt 
     */
    displayNodeFormPrefilled(type, txt) {
        this.#form.addTextInput(txt,type);
        this.#form.show(type);
        this.checkNodeForm();
    }

    /**
     * @description displays the menu for the node at 
     * the coordinates (x,y) passed as parameters.
     * @param {Number} x // x coordinate of the menu 
     * @param {Number} y // y coordinate of the menu
     */
    displayNodeMenu(x,y) {
        if (x + this.#nodeMenu.clientWidth>this.#canvas.width) {
            this.#nodeMenu.style.left = `${x-this.#nodeMenu.clientWidth}px`;
        } else if (x - this.#nodeMenu.clientWidth < 0) {
            this.#nodeMenu.style.left = `${x}px`;
        } else {
            this.#nodeMenu.style.left = `${x - 70}px`;    
        }

        if (y + this.#nodeMenu.clientHeight>this.#canvas.height) {
            this.#nodeMenu.style.top = `${y - this.#nodeMenu.clientHeight}px`;
        } else if (y - this.#nodeMenu.clientHeight < 0) {
            this.#nodeMenu.style.top = `${y}px`;
        } else {
            this.#nodeMenu.style.top = `${y - 45}px`;    
        }

        this.#nodeMenu.style.zIndex = 6;
    }

    /**
     * @description hides the menu for the node.
     */
    hideNodeMenu() {
        this.#nodeMenu.style.zIndex = -6;
        this.disableBreakDownBtn();
    }

    /**
     * @description displays the tab menu.
     */
    displayTabMenu() {
        this.#tabMenu.style.zIndex = 5;
    }

    /**
     * @description hides the tab menu
     */
    hideTabMenu() {
        this.#tabMenu.style.zIndex = -5;
    }

    /**
     * @description Displays the file manager.
     */
    displayFileManager() {
        this.getElm(this.#fileInputId).click()
    }

    /**
     * @description Applies the style specified by 
     * the Css class passed as a parameter to the tab.
     * @param {Number} index // index of tab element
     * @param {String} cssClassName // "tab-inactive" or "tab-active"
     */
    changeTabStyle(index, cssClassName) {
        this.getElm(`tab-${index}`)
            .setAttribute("class",cssClassName);
    }

    /**
     * @description Adds a new tab element with its 
     * close button to the parent container.
     */
    addTabElm(title, index) {
        let tabBtn = document.createElement("button");
        tabBtn.setAttribute("id",`close-${index}`);
        tabBtn.setAttribute("title", "Fermer l'onglet");
        tabBtn.setAttribute("class","tab__close-btn");
        let tab = document.createElement("div");
        tab.setAttribute("id",`tab-${index}`);
        tab.setAttribute("class","tab-active");
        tab.textContent = title;
        tab.appendChild(tabBtn);
        this.#tabWrapper.appendChild(tab);
    }

    /**
     * @description Remove tab, all nodes and names 
     * linked to the closed tab.
     * @param {Number} index 
     */
    removeTab(index) {
        this.#tabWrapper.children[index].remove();
    }

    /**
     * @description From the id of the closed tab 
     * updates the ids of the following tabs.
     * @param {Number} index
     */
    updateAllTabId(index) {
        for (let i = index; i < this.#tabWrapper.children.length; i++) {
            this.#tabWrapper.children[i].setAttribute("id",`tab-${i}`);
            this.#tabWrapper.children[i].children[0].setAttribute("id",`close-${i}`);
        }
    }

    /**
     * @description Updates name of the current tab.
     * @param {Number} currentIndex 
     * @param {String} newName 
     */
    updateTabName(currentIndex, newName) {
        this.#tabWrapper.children[currentIndex]
                       .firstChild.nodeValue = newName;
    }


    /**
     * @description Display landmarks.
     * @param {Event} e // Mouse move event 
     */
    displayLandmarks(e) {
        this.getElm(this.#vMarkId)
            .style.left = `${(e.clientX)}px`;
        this.getElm(this.#hMarkId)
            .style.top = `${(e.offsetY)}px`;
        this.getElm(this.#vMarkId)
            .style.opacity = 1;
        this.getElm(this.#hMarkId)
            .style.opacity = 1;
    }

    /**
     * @description Hides landmarks.
     */
    hideLandmarks() {
        this.getElm(this.#vMarkId)
            .style.opacity = 0;
        this.getElm(this.#hMarkId)
            .style.opacity = 0;
    }

    /**
     * @description Enable the new button
     * * of main menu.
     */
    enableNewBtn() {
        this.getElm(this.#newId)
            .removeAttribute("disabled");
    }

    /**
     * @description Disable the new button
     * * of main menu.
     */
    disableNewBtn() {
        this.getElm(this.#newId)
            .setAttribute("disabled", true);
    }

    /**
     * @description Enable the undo button
     * * of main menu.
     */
    enableUndoBtn() {
        this.getElm(this.#undoId)
            .removeAttribute("disabled");
    }

    /**
     * @description Disable the undo button
     * * of main menu.
     */
    disableUndoBtn() {
        this.getElm(this.#undoId)
            .setAttribute("disabled", true);
    }

    /**
     * @description Enable the redo button
     * * of main menu.
     */
    enableRedoBtn() {
        this.getElm(this.#redoId)
            .removeAttribute("disabled");
    }

    /**
     * @description Disable the redo button
     * of main menu.
     */
    disableRedoBtn() {
        this.getElm(this.#redoId)
            .setAttribute("disabled", true);
    }

    /**
     * @description Enable the breakdown button 
     * of node menu.
     */
    enableBreakDownBtn() {
        this.getElm(this.#breakDownId)
            .removeAttribute("disabled");
    }

    /**
     * @description Disable the breakdown button
     * of node menu.
     */
    disableBreakDownBtn() {
        this.getElm(this.#breakDownId)
            .setAttribute("disabled", true);
    }

    /**
     * @description displays the type menu 
     * for the node.
     */
    displayTypeMenu() {
        this.getElm("type__nav").style.zIndex = 20;
    }

    /**
     * @description hides the type menu for
     * the node.
     */
    hideTypeMenu() {
        this.getElm("type__nav").style.zIndex = -20;
    }

    /**
     * @description Displays the node's text 
     * modification form.
     */
    displayForm() {
        this.getElm("input-wrapper").children[0].focus()
        this.getElm("node__form").style.zIndex = 3;
    }

    /**
     * @description Hides the node's text 
     * modification form.
     */
    hideForm () {
        clearInterval(this.intervaleForm);
        this.getElm("node__form").style.zIndex = -3;
        this.getElm("inp_0").style.display = "none";
    }

    /**
     * @description
     * @returns 
     */
    getDataForm() {
        return this.#form.inputsData;
    }

    /**
     * @description Handles interactions with the main menu.
     * @param {String} action 
     */
    handleMainMenu(action) {
        switch (action) {
            case "add": this.presenter.handleAdd(); break;
            case "undo": this.presenter.handleUndo(); break;
            case "redo": this.presenter.handleRedo(); break;
            case "save": this.presenter.handleSave(); break;
            case "open": this.presenter.handleOpen(); break;
            case "new": this.presenter.handleNew(); break;
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
            case "erase": this.presenter.handleDelete(); break;
        }
    }

    /**
     * @description Starts the click event listener.
     */
    launchClickListener() {
        window.addEventListener("click", (e) => {
            let btnData = e.target.id.split("-");
            switch (e.target.id.split("-")[0]) {
                case "menu": this.handleMainMenu(btnData[1]); break;
                case "type": this.presenter.handleTypeChoise(Number(btnData[1])); break;
                case "node": this.handleNodeMenu(btnData[1]); break;
                case "form": this.presenter.handleNodeForm(btnData[1]); break;
                case "tab": this.presenter.handleChoiseTab(btnData[1]); break;
                case "close": this.presenter.handleCloseTab(btnData[1]); break;
            }
        })
    }

    /**
     * @description Starts the mouse move event listener
     */
    launchMouseMoveListener() {
        window.addEventListener("mousemove", (e) => {
            if (e.target.nodeName === "CANVAS") {
                this.displayLandmarks(e);
                this.presenter.handleMouseMove(e)
            } else { this.hideLandmarks(); }
        })
    }

    /**
     * @description Starts the mouse up event listener
     */
    launchMouseUpListener() {
        window.addEventListener("mouseup", (e) => {
            e.stopPropagation();
            this.presenter.handleMouseUp(e);
        });
    }

    /**
     * @description Starts the mouse down event listener
     */
    launchMouseDownListener() {
        this.#canvas.addEventListener("mousedown", (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            this.presenter.handleMouseDown(e);
        })
    }

    /**
     * @description Starts the double click event listener
     */
    launchDbClickListener() {
        this.#canvas.addEventListener("dblclick", (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            this.presenter.handleDbClick(e);
        })
    }

    /**
     * @description Starts the right click event listener
     */
    launchContextMenuListener() {
        this.#canvas.addEventListener("contextmenu", (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
            this.presenter.handleDbClick(e);
        })
    }

    /**
     * @description Starts the file event listener
     */
    launchFileListener() {
        this.getElm(this.#fileInputId)
                .addEventListener("change", (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            this.presenter.handleLoad(e);
        })
    }

    /**
     * @description Starts the window resize event listener
     */
    launchResizeListener() {
        window.addEventListener("resize", (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            this.presenter.handleResize();
        })
    }

    /**
     * @description Starts the key down event listener
     */
    launchKeyDownListener() {
        window.addEventListener("keydown", (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            
            if (this.#shiftPressed && this.keyOpAllowed) {
                switch (e.key) {
                    case "A": this.getElm(this.#addId).click(); break;
                    case "Z": this.getElm(this.#undoId).click(); break;
                    case "Y": this.getElm(this.#redoId).click(); break;
                    case "S": this.getElm(this.#saveId).click(); break;
                    case "N": this.getElm(this.#newId).click(); break;
                    case "O": this.getElm(this.#openId).click(); break;
                    case "I": this.getElm(this.#infoId).click(); break;
                    default: break;
                }
            }
            
            if (e.key === "Shift") {
                this.#shiftPressed = true;
            }
        })
    }

    /**
     * @description Starts the key up event listener
     */
    launchKeyUpListener() {
        window.addEventListener("keyup", (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();

            if (e.key === "Shift") {
                this.#shiftPressed = false;
            }
        })
    }
}