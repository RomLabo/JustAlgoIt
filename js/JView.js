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

        /* A Modifier ----------- */
        document.getElementById("main-canvas").width = window.innerWidth * .98;
        document.getElementById("main-canvas").height = window.innerHeight * .9;
        /* -------------------- */

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
        }
    }

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
        document.getElementById("main-new")
                .removeAttribute("disabled");
    }

    /**
     * @description Disable the new button
     * * of main menu.
     */
    disableNewBtn() {
        document.getElementById("main-new")
                .setAttribute("disabled", true);
    }

    /**
     * @description Enable the undo button
     * * of main menu.
     */
    enableUndoBtn() {
        document.getElementById("main-undo")
                .removeAttribute("disabled");
    }

    /**
     * @description Disable the undo button
     * * of main menu.
     */
    disableUndoBtn() {
        document.getElementById("main-undo")
                .setAttribute("disabled", true);
    }

    /**
     * @description Enable the redo button
     * * of main menu.
     */
    enableRedoBtn() {
        document.getElementById("main-redo")
                .removeAttribute("disabled");
    }

    /**
     * @description Disable the redo button
     * of main menu.
     */
    disableRedoBtn() {
        document.getElementById("main-redo")
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
        document.getElementById("type__nav").style.zIndex = 5;
    }

    /**
     * @description hides the type menu for
     * the node.
     */
    hideTypeMenu() {
        document.getElementById("type__nav").style.zIndex = -5;
    }

    /**
     * @description Builds the node's text 
     * modification form.
     * @param {String} type 
     */
    buildForm(type) {
        if (type === "condition" || type === "switch") {
            this.displayInputsControls();
        } else {
            this.hideInputsControls();
        }
        document.getElementById("input-wrapper")
                    .innerHTML = "";
        document.getElementById("input-wrapper")
                    .innerHTML = this.#inputsElms[type];
    }

    /**
     * @description Displays the node's text 
     * modification form.
     */
    displayForm() {
        document.getElementById("inp_1").focus();
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
        this.#dataForm.splice(0);
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
     * @param {Event} event 
     */
    handleMainMenu(action, event) {
        switch (action) {
            case "add": this.presenter.handleAdd(event); break;
            case "undo": this.presenter.handleUndo(event); break;
            case "redo": this.presenter.handleRedo(event); break;
            case "save": this.presenter.handleSave(event); break;
            case "open": this.presenter.handleOpen(event); break;
            case "new": this.presenter.handleNew(event); break;
            case "tab": this.presenter.handleTab(event); break;
        }
    }

    /**
     * @description Handles interactions with the node menu.
     * @param {*} action 
     * @param {*} event 
     */
    handleNodeMenu(action, event) {
        switch (action) {
            case value: break;
            default: break;
        }
    }

    /**
     * @description Starts the click event listener.
     */
    launchClickListener() {
        window.addEventListener("click", (e) => {
            console.log(e.target);
            let btnData = e.target.id.split("-");

            switch (btnData[0]) {
                case "main": this.handleMainMenu(btnData[1],e); break;
                case "type": this.presenter.handleTypeChoise(btnData[1]); break;
                case "node": this.handleNodeMenu(btnData[1],e); break;
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
            } else {
                this.hideLandmarks();
            }
        })
    }
}