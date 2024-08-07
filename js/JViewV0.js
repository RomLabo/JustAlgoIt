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
     * Create a JView.
     */
    constructor() {
        // Main canvas
        this.canvas = document.getElementById('main-canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth * .98;
        this.canvas.height = window.innerHeight * .9;
        this.lastCnWidth = this.canvas.width;
        this.lastCnvHeight = this.canvas.height;
        this.shiftKeyPressed = false;

        // Main canvas Landmarks
        this.landmarks = new JLandmark("main-canvas", 
                                    "landmark__vertical", 
                                    "landmark__horizontal");
        this.landmarks.init();

        // Main menu btn
        this.addBtn = document.getElementById("add");
        this.undoBtn = document.getElementById("undo");
        this.redoBtn = document.getElementById("redo");
        this.saveBtn = document.getElementById("save");
        this.openBtn = document.getElementById("open");
        this.newBtn = document.getElementById("new");
        this.infoBtn = document.getElementById("info");

        // Node menu btn
        this.modifyBtn = document.getElementById("modify");
        this.linkBtn = document.getElementById("link");
        this.unlinkBtn = document.getElementById("unlink");
        this.breakDownBtn = document.getElementById("breakdown");
        this.deleteBtn = document.getElementById("erase");

        // Node menu
        this.nodeMenu = document.getElementById('node__menu');

        // Node type menu
        this.nodeMenuType = document.getElementById('node__menu-type');
        this.nodeMenuTypeCancelBtn = document.getElementById("cancel__btn");
        this.allNodeMenuTypeBtn = document.querySelectorAll(".node-type");

        // Node form
        this.nodeForm = document.getElementById('node__form');
        this.validNodeBtn = document.getElementById('valid__btn');
        this.form = new JForm(this.nodeForm);

        // Tab menu
        this.tabMenuBtn = document.getElementById("tab__menu-btn");
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
        this.nodeMenuType.style.zIndex = 5;
    }

    /**
     * @description hides the type menu for
     * the node.
     */
    hideNodeMenuType() {
        this.nodeMenuType.style.zIndex = -5;
    }

    /**
     * @description Check if the form is completed 
     * to unlock the validation button.
     */
    checkNodeForm() {
        this.intervaleForm = setInterval(() => {
            if (this.form.isValid()) {
                this.validNodeBtn.removeAttribute("disabled");
            } else {
                this.validNodeBtn.setAttribute("disabled",true);
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

    /**
     * 
     * @param {*} handlerResize 
     */
    bindResize(handlerResize) {
        window.addEventListener("resize", (e) => {
            handlerResize(e);
        })
    }

    /**
     * 
     * @param {*} handlerAdd 
     */
    bindAdd(handlerAdd) {
        this.addBtn.addEventListener("click", (e) => {
            //this.allNodeMenuTypeBtn[0].focus();
            this.keyOpAllowed = false; 
            handlerAdd(e);
        })
    }

    /**
     * 
     * @param {*} handlerUndo
     */
    bindUndo(handlerUndo) {
        this.undoBtn.addEventListener("click", (e) => {
            this.keyOpAllowed = false; 
            handlerUndo(e);
        })
    }
    
    /**
     * 
     * @param {*} handlerRedo
     */
    bindRedo(handlerRedo) {
        this.redoBtn.addEventListener("click", (e) => {
            this.keyOpAllowed = false; 
            handlerRedo(e);
        })
    }

    /**
     * 
     * @param {*} handlerSave
     */
    bindSave(handlerSave) {
        this.saveBtn.addEventListener("click", (e) => {
            this.keyOpAllowed = false; 
            handlerSave(e);
        })
    }

    /**
     * 
     * @param {*} handlerOpen
     */
    bindOpen(handlerOpen) {
        this.openBtn.addEventListener("click", (e) => {
            this.fileInput.click();
            handlerOpen(e);
        })
    }

    /**
     * 
     * @param {*} handlerNew
     */
    bindNew(handlerNew) {
        this.newBtn.addEventListener("click", (e) => {
            this.keyOpAllowed = false; 
            handlerNew(e);
        })
    }

    /**
     * 
     * @param {*} handlerChoise 
     */
    bindChoise(handlerChoise) {
        this.allNodeMenuTypeBtn.forEach(btn => {
            btn.addEventListener("click", () => {
            handlerChoise(btn.id);
        })});
    }

    /**
     * 
     * @param {*} handlerWrite 
     */
    bindWrite(handlerWrite) {
        this.validNodeBtn.addEventListener("click", () => {
            clearInterval(this.intervaleForm);
            handlerWrite(this.form.inputsData);
            this.form.hide();
            this.validNodeBtn.setAttribute("disabled",true);
            this.keyOpAllowed = true;
        })
    }

    /**
     * 
     * @param {*} handlerMouseUp 
     */
    bindMouseUp(handlerMouseUp) {
        window.addEventListener("mouseup", (e) => {
            e.stopPropagation();
            handlerMouseUp(e);
        });
    }

    /**
     * 
     * @param {*} handlerMouseMove 
     */
    bindMouseMove(handlerMouseMove) {
        this.canvas.addEventListener('mousemove', (e) => {
            handlerMouseMove(e);
        })
    }

    /**
     * 
     * @param {*} handlerMouseDown 
     */
    bindMouseDown(handlerMouseDown) {
        this.canvas.addEventListener("mousedown", (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            handlerMouseDown(e);
        })
    }

    /**
     * 
     * @param {*} handlerClick
     */
    bindDbClick(handlerClick) {
        this.canvas.addEventListener("dblclick", (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            handlerClick(e);
        })
    }

    /**
     * 
     * @param {*} handlerLink
     */
    bindLink(handlerLink) {
        this.linkBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            handlerLink(e);
        })
    }

    /**
     * 
     * @param {*} handlerUnlink
     */
    bindUnlink(handlerUnlink) {
        this.unlinkBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            handlerUnlink(e);
        })
    }

    /**
     * 
     * @param {*} handlerModify
     */
    bindModify(handlerModify) {
        this.modifyBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            handlerModify(e);
        })
    }

    /**
     * 
     * @param {*} handlerBreakDown
     */
    bindBreakDown(handlerBreakDown) {
        this.breakDownBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            handlerBreakDown(e);
        })
    }

    /**
     * 
     * @param {*} handlerDelete
     */
    bindDelete(handlerDelete) {
        this.deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            handlerDelete(e);
        })
    }

    /**
     * 
     * @param {*} handlerShowTab 
     */
    bindShowTab(handlerShowTab) {
        this.tabMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            handlerShowTab(e);
        })
    }

    /**
     * 
     * @param {*} handlerChoiseTab 
     * @param {*} handlerCloseTab 
     */
    bindTabClick(handlerChoiseTab, handlerCloseTab) {
        this.tabWrapper.addEventListener("click", (e) => {
            if (e.target.tagName === "DIV") {
                handlerChoiseTab(e);
            } else if (e.target.tagName === "BUTTON") {
                handlerCloseTab(e);
            }
        })
    }

    /**
     * 
     * @param {*} handlerLoad 
     */
    bindLoad(handlerLoad) {
        this.fileInput.addEventListener("change", (e) => {
            handlerLoad(e);
        })
    }

    /**
     * 
     * @param {*} handlerKeyDown 
     */
    bindKeyDown(handlerKeyDown) {
        window.addEventListener("keydown", (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            
            if (this.shiftKeyPressed && this.keyOpAllowed) {
                switch (e.key) {
                    case "A": this.addBtn.click(); break;
                    case "Z": this.undoBtn.click(); break;
                    case "Y": this.redoBtn.click(); break;
                    case "S": this.saveBtn.click(); break;
                    case "N": this.newBtn.click(); break;
                    case "O": this.openBtn.click(); break;
                    case "I": this.infoBtn.click(); break;
                    default: break;
                }
            }

            handlerKeyDown(e);

            if (e.key === "Shift") {
                this.shiftKeyPressed = true;
            }
        })
    }

    /**
     * 
     * @param {*} handlerKeyUp 
     */
    bindKeyUp(handlerKeyUp) {
        window.addEventListener("keyup", (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();

            if (e.key === "Shift") {
                this.shiftKeyPressed = false;
            }

            handlerKeyUp(e);
        })
    }
}