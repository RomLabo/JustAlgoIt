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
        this.canvas = document.getElementById('main-canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth * .98;
        this.canvas.height = window.innerHeight * .9;

        this.lastCnWidth = this.canvas.width;
        this.lastCnvHeight = this.canvas.height;
        
        this.addBtn = document.getElementById("add");
        this.undoBtn = document.getElementById("undo");
        this.redoBtn = document.getElementById("redo");
        this.saveBtn = document.getElementById("save");
        this.openBtn = document.getElementById("open");
        this.newBtn = document.getElementById("new");

        this.nodeMenuType = document.getElementById('node__menu-type');
        this.nodeMenuTypeCancelBtn = document.getElementById("cancel__btn");
        this.allNodeMenuTypeBtn = document.querySelectorAll(".node-type");

        this.nodeForm = document.getElementById('node__form');
        this.validNodeBtn = document.getElementById('valid__btn');
        this.form = new Form(this.nodeForm);
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
     * @description ...
     * @param {*} type 
     */
    displayNodeForm(type) {
        this.form.create(type);
        this.form.show(type);
        this.intervaleForm = setInterval(() => {
            if (this.form.isValid()) {
                this.validNodeBtn.removeAttribute("disabled");
            } else {
                this.validNodeBtn.setAttribute("disabled",true);
            }
        },100);
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
        })
    }
}