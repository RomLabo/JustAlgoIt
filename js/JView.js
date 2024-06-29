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
    // Private properties
    #presenter; #dataForm;
    #inputsDefaultTxt; #inputsElms;
    /**
     * * @description Create a JView.
     */
    constructor() {
        this.#presenter = null;
        this.#dataForm = [];
        this.#inputsDefaultTxt = {
            issue: "Problème", assignment: "Valeur1 <-- Valeur2",
            switch: "Valeur", loop: "Pour i allant\nde ... à ...",
            condition: "Si ..."
        };
        this.#inputsElms = {
            issue: `<textarea class="model-input" id="inp_1" cols="20" rows="6" placeholder="Donnée1, ..."></textarea>
                    <textarea class="model-input" id="inp_2" cols="20" rows="6" placeholder="Problème"></textarea>
                    <textarea class="model-input" id="inp_3" cols="20" rows="6" placeholder="Résultat1, ..."></textarea>`,
            assignment: `<textarea class="model-input" id="inp_1" cols="20" rows="6" placeholder="Valeur1 <-- Valeur2"></textarea>`,
            switch: `<textarea class="model-input" id="inp_1" cols="20" rows="6" placeholder="Valeur1"></textarea>
                    <textarea class="model-input" id="inp_2" cols="20" rows="6" placeholder="Valeur2"></textarea>`,
            loop: `<textarea class="model-input" id="inp_1" cols="20" rows="6" placeholder="Pour i allant\nde ... à ..."></textarea>`,
            condition: `<textarea class="model-input" id="inp_1" cols="20" rows="6" placeholder="Si ..."></textarea>`
        };

        // Main canvas
        this.canvas = document.getElementById("main-canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth * .98;
        this.canvas.height = window.innerHeight * .9;
        this.lastCnWidth = this.canvas.width;
        this.lastCnvHeight = this.canvas.height;
        this.shiftKeyPressed = false;

        // Node menu btn
        this.modifyBtn = document.getElementById("modify");
        this.linkBtn = document.getElementById("link");
        this.unlinkBtn = document.getElementById("unlink");
        this.breakDownBtn = document.getElementById("breakdown");
        this.deleteBtn = document.getElementById("erase");

        // Node menu
        this.nodeMenu = document.getElementById("node__nav");
        

        // Tab menu
        this.tabMenuBtn = document.getElementById("tab__menu-btn");
        this.tabMenu = document.getElementById("tab__menu");
        this.tabWrapper = document.getElementById("tab__wrapper");

        // File input
        this.fileInput = document.getElementById("file__input");

        this._keyOpAllowed = true;
    }

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
            this.launchFileListener();
        }
    }

    /* ************************* */

    get lastCnvSize() { return [this.lastCnWidth,this.lastCnvHeight] }
    get keyOpAllowed() { return this._keyOpAllowed }
    set keyOpAllowed(val) { this._keyOpAllowed = val } 
    get isShiftKey() { return this.shiftKeyPressed }

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
        document.getElementById("menu-save").setAttribute(
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
        document.getElementById("type__nav")
                .style.zIndex = 5;
    }

    /**
     * @description hides the type menu for
     * the node.
     */
    hideNodeMenuType() {
        document.getElementById("type__nav")
                .style.zIndex = -5;
    }

    /**
     * @description Check if the form is completed 
     * to unlock the validation button.
     */
    checkNodeForm() {
        this.intervaleForm = setInterval(() => {
            if (this.form.isValid()) {
                document.getElementById("valid__btn")
                        .removeAttribute("disabled");
            } else {
                document.getElementById("valid__btn")
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
        this.form.create(type);
        this.form.show(type);
        this.checkNodeForm();
    }

    /**
     * @description Displays the node text modification 
     * form already pre-filled with the node text.
     * @param {Number} type 
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
     * 
     */
    displayFileManager() {
        document.getElementById("file__input").click()
    }

    /**
     * @description applies the style specified by 
     * the Css class passed as a parameter to the tab.
     * @param {Number} index // index of tab element
     * @param {String} cssClassName // "tab-inactive" or "tab-active"
     */
    changeTabStyle(index, cssClassName) {
        document.getElementById(`tab_${index}`)
                .setAttribute("class",cssClassName);
    }

    /**
     * @description adds a new tab element with its 
     * close button to the parent container.
     */
    addTabElm(title, index) {
        let tabBtn = document.createElement("button");
        tabBtn.setAttribute("id",`close-tab__btn_${index}`);
        tabBtn.setAttribute("title", "Fermer l'onglet");
        tabBtn.setAttribute("class","tab__close-btn");
        let tab = document.createElement("div");
        tab.setAttribute("id",`tab_${index}`);
        tab.setAttribute("class","tab-active");
        tab.textContent = title;
        tab.appendChild(tabBtn);
        this.tabWrapper.appendChild(tab);
    }

    /**
     * @description remove tab, all nodes and names 
     * linked to the closed tab.
     * @param {String} idOfTabElm 
     */
    removeTab(idOfTabElm) {
        this.tabWrapper.children[Number(idOfTabElm.split("_")[3])].remove();
    }

    /**
     * @description from the id of the closed tab updates 
     * the ids of the following tabs.
     * @param {String} idOfTabElm 
     */
    updateAllTabId(idOfTabElm) {
        for (let i = Number(idOfTabElm.split("_")[3]); i < this.tabWrapper.children.length; i++) {
            this.tabWrapper.children[i].setAttribute("id",`tab_${i}`);
            this.tabWrapper.children[i].children[0].setAttribute("id",`close-tab__btn_${i}`);
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


    /* ************************* */

    /**
     * @description Display landmarks.
     */
    displayLandmarks(e) {
        document.getElementById("landmark-v").style.left = `${(e.clientX)}px`;
        document.getElementById("landmark-h").style.top = `${(e.offsetY)}px`;
        document.getElementById("landmark-v").style.opacity = 1;
        document.getElementById("landmark-h").style.opacity = 1;
    }

    /**
     * @description Hides landmarks.
     */
    hideLandmarks() {
        document.getElementById("landmark-v").style.opacity = 0;
        document.getElementById("landmark-h").style.opacity = 0;
    }

    /**
     * 
     */
    displayInputsControls() {
        document.getElementById("remove-input").style.display = "inline-block";
        document.getElementById("add-input").style.display = "inline-block";
    }

    /**
     * 
     */
    hideInputsControls() {
        document.getElementById("remove-input").style.display = "none";
        document.getElementById("add-input").style.display = "none";
    }

    /**
     * @description Enable the new button
     * * of main menu.
     */
    enableNewBtn() {
        document.getElementById("menu-new")
                .removeAttribute("disabled");
    }

    /**
     * @description Disable the new button
     * * of main menu.
     */
    disableNewBtn() {
        document.getElementById("menu-new")
                .setAttribute("disabled", true);
    }

    /**
     * @description Enable the undo button
     * * of main menu.
     */
    enableUndoBtn() {
        document.getElementById("menu-undo")
                .removeAttribute("disabled");
    }

    /**
     * @description Disable the undo button
     * * of main menu.
     */
    disableUndoBtn() {
        document.getElementById("menu-undo")
                .setAttribute("disabled", true);
    }

    /**
     * @description Enable the redo button
     * * of main menu.
     */
    enableRedoBtn() {
        document.getElementById("menu-redo")
                .removeAttribute("disabled");
    }

    /**
     * @description Disable the redo button
     * of main menu.
     */
    disableRedoBtn() {
        document.getElementById("menu-redo")
                .setAttribute("disabled", true);
    }

    /**
     * @description Enable the breakdown button 
     * of node menu.
     */
    enableBreakDownBtn() {
        document.getElementById("node-breakdown")
                .removeAttribute("disabled");
    }

    /**
     * @description Disable the breakdown button
     * of node menu.
     */
    disableBreakDownBtn() {
        document.getElementById("node-breakdown")
                .setAttribute("disabled", true);
    }

    /**
     * @description displays the type menu 
     * for the node.
     */
    displayTypeMenu() {
        document.getElementById("type__nav").style.zIndex = 20;
    }

    /**
     * @description hides the type menu for
     * the node.
     */
    hideTypeMenu() {
        document.getElementById("type__nav").style.zIndex = -20;
    }

    /**
     * @description Builds the node's text form.
     * @param {String} type 
     * @param {Array} txt
     */
    buildForm(type, txt) {
        if (type === TYPE.CONDITION || type === TYPE.SWITCH) {
            this.displayInputsControls();
        } else {
            this.hideInputsControls();
        }

        document.getElementById("input-wrapper")
                    .innerHTML = "";
        document.getElementById("input-wrapper")
                    .innerHTML = this.#inputsElms[TXT_TYPE[type]];
        if (txt) {
            for (let i = 0; i < document.getElementById("input-wrapper").children.length; i++) {
                if (type === TYPE.ISSUE && (i === 0 || i === 2)) {
                    document.getElementById("input-wrapper").children[i].value = txt[i].join(" ");
                } else {
                    document.getElementById("input-wrapper").children[i].value = txt[i].join("\n");
                } 
            }
        }
    }

    /**
     * @description Displays the node's text 
     * modification form.
     */
    displayForm() {
        document.getElementById("input-wrapper").children[0].focus()
        document.getElementById("node__form").style.zIndex = 3;
    }

    /**
     * @description Hides the node's text 
     * modification form.
     */
    hideForm () {
        document.getElementById("node__form").style.zIndex = -3;
        document.getElementById("inp_0").style.display = "none";
    }

    /**
     * @description
     * @returns 
     */
    getDataForm() {
        this.#dataForm = [];
        for (let i = 0; 
            i < document.getElementById("input-wrapper").children.length; 
                                                                    i++) {
            this.#dataForm.push(
                document.getElementById("input-wrapper").children[i].value
            )
        }
        return this.#dataForm;
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

    launchFileListener() {
        this.fileInput.addEventListener("change", (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            this.presenter.handleLoad(e);
        })
    }
}