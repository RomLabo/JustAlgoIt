/*
0000000001 Author RomLabo 111111111
1000111000 Class View 1111111111111
1000000001 Created on 29/12/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class View
 * @description ...
 */
class View {
    constructor() {
        // Main canvas
        this.canvas = document.getElementById('main-canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth * .98;
        this.canvas.height = window.innerHeight * .9;
        this.lastCnWidth = this.canvas.width;
        this.lastCnvHeight = this.canvas.height;

        // Main canvas Landmarks
        this.landmarks = new Landmark("main-canvas", 
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
        this.form = new Form(this.nodeForm);

        // Tab menu
        this.tabMenuBtn = document.getElementById("tab__menu-btn");
        this.tabMenu = document.getElementById("tab__menu");
        this.tabWrapper = document.getElementById("tab__wrapper");
    }

    /**
     * 
     */
    enableBreakDownBtn() {
        this.breakDownBtn.removeAttribute("disabled");
    }

    /**
     * 
     */
    disabledBreakDownBtn() {
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
     * 
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
     * @description ...
     * @param {*} type 
     */
    displayNodeForm(type) {
        this.form.create(type);
        this.form.show(type);
        this.checkNodeForm();
    }

    /**
     * 
     * @param {*} type 
     * @param {*} txt 
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
        this.disabledBreakDownBtn();
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
     * @param {*} handler 
     */
    bindAdd(handler) {
        this.addBtn.addEventListener("click", (e) => {
            handler(e);
        })
    }

    /**
     * 
     * @param {*} handler 
     */
    bindUndo(handler) {
        this.undoBtn.addEventListener("click", (e) => {
            handler(e);
        })
    }
    
    /**
     * 
     * @param {*} handler 
     */
    bindRedo(handler) {
        this.redoBtn.addEventListener("click", (e) => {
            handler(e);
        })
    }

    /**
     * 
     * @param {*} handler 
     */
    bindSave(handler) {
        this.saveBtn.addEventListener("click", (e) => {
            handler(e);
        })
    }

    /**
     * 
     * @param {*} handler 
     */
    bindOpen(handler) {
        this.openBtn.addEventListener("click", (e) => {
            handler(e);
        })
    }

    /**
     * 
     * @param {*} handler 
     */
    bindNew(handler) {
        this.newBtn.addEventListener("click", (e) => {
            handler(e);
        })
    }

    /**
     * 
     * @param {*} handler 
     */
    bindChoise(handler) {
        this.allNodeMenuTypeBtn.forEach(btn => {
            btn.addEventListener("click", () => {
            handler(btn.id);
        })});
    }

    /**
     * 
     * @param {*} handler 
     */
    bindWrite(handler) {
        this.validNodeBtn.addEventListener("click", () => {
            clearInterval(this.intervaleForm);
            handler(this.form.inputsData);
            this.form.hide();
            this.validNodeBtn.setAttribute("disabled",true);
        })
    }

    /**
     * 
     * @param {*} handler 
     */
    bindMouseUp(handler) {
        window.addEventListener("mouseup", (e) => {
            e.stopPropagation();
            handler(e);
        });
    }

    /**
     * 
     * @param {*} handler 
     */
    bindMouseMove(handler) {
        this.canvas.addEventListener('mousemove', (e) => {
            handler(e);
        })
    }

    /**
     * 
     * @param {*} handler 
     */
    bindMouseDown(handler) {
        this.canvas.addEventListener("mousedown", (e) => {
            e.stopPropagation();
            handler(e);
        })
    }

    /**
     * 
     * @param {*} handler 
     */
    bindDbClick(handler) {
        this.canvas.addEventListener("dblclick", (e) => {
            handler(e);
        })
    }

    /**
     * 
     * @param {*} handler 
     */
    bindLink(handler) {
        this.linkBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            handler(e);
        })
    }

    /**
     * 
     * @param {*} handler 
     */
    bindUnlink(handler) {
        this.unlinkBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            handler(e);
        })
    }

    /**
     * 
     * @param {*} handler 
     */
    bindModify(handler) {
        this.modifyBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            handler(e);
        })
    }

    /**
     * 
     * @param {*} handler 
     */
    bindBreakDown(handler) {
        this.breakDownBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            handler(e);
        })
    }

    /**
     * 
     * @param {*} handler 
     */
    bindDelete(handler) {
        this.deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            handler(e);
        })
    }
}