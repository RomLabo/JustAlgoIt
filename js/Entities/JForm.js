/*
0000000001 Author RomLabo 111111111
1000111000 Class JForm 111111111111
1000000001 Created on 17/04/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JForm
 * @description ...
 */
class JForm {
    /* TODO: refactoring */
    
    /**
     * 
     * @param {String} formWrapperId 
     */
    constructor(formWrapperId) {
        this.wrapper = document.getElementById(formWrapperId);
        this.form = document.getElementById('form');
        this.inputWrapper = document.getElementById('input-wrapper');
        this.addInputBtn = document.getElementById('add-input');
        this.removeInputBtn = document.getElementById('remove-input');
        this.inputs = this.inputWrapper.children;
        this._inputsData = [];
        this.allInputs;
        this._currentType;
        this.modifyForm();
    }

    get inputsData() {
        this._inputsData = [];
        for (let i = 0; i < this.inputs.length; i++) {
            this._inputsData.push(this.inputs[i].value);
        }
        if (this._currentType === TYPE.SWITCH) {
            this._inputsData.push(document.getElementById("inp_0").value)
        }
        return this._inputsData;
    }

    addTextInput(txtArray, type) {
        this.inputWrapper.innerHTML = ""
        this._currentType = type;
        if (type === TYPE.SWITCH) {
            for (let i = 0; i < txtArray.length - 1; i++) {
                this.inputWrapper.innerHTML += `<textarea class="model-input" id="inp_${this.inputs.length + 1}"
                                            cols="20" rows="6" placeholder="..."></textarea>`;
                document.getElementById("inp_0").style.display = "flex";                                            
            }
        } else {
            for (let i = 0; i < txtArray.length; i++) {
                this.inputWrapper.innerHTML += `<textarea class="model-input" id="inp_${this.inputs.length + 1}"
                                            cols="20" rows="6" placeholder="..."></textarea>`;
            }
        }
        for (let i = 0; i < txtArray.length; i++) {
            if (type === TYPE.ISSUE && (i === 0 || i === 2)) {
                this.inputs[i].value = txtArray[i].join(' ').replaceAll('  ', ' ');
            } else if (type === TYPE.SWITCH) {
                if (i !== txtArray.length - 1) {
                    this.inputs[i].value = txtArray[i].join('\n');    
                } else {
                    document.getElementById("inp_0").value = txtArray[i].join('\n');
                }
                
            } else {
                this.inputs[i].value = txtArray[i].join('\n');
            }
        }
    }

    resetInputs() {
        for (let i = 0; i < this.inputs.length; i++) {
            this.inputs[i].value = "";
        }
        document.getElementById("inp_0").value = "";
    }

    modifyForm() {
        this.addInputBtn.addEventListener('click', () => {
            if (this.inputs.length === 1) {
                this.removeInputBtn.removeAttribute("disabled");
            }
            if (this.inputs.length <= 7) {
                if (this._currentType === TYPE.CONDITION) {
                    if (this.inputs.length > 1) {
                        this.inputs[this.inputs.length - 1].placeholder = "Si ... Sinon";
                    }
                    this.inputWrapper.innerHTML += `<textarea class="model-input" id="inp_${this.inputs.length + 1}"
                                             cols="20" rows="6" placeholder="Sinon ..."></textarea>`;
                } else {
                    this.inputWrapper.innerHTML += `<textarea class="model-input" id="inp_${this.inputs.length + 1}"
                                             cols="20" rows="6" placeholder="Valeur${this.inputs.length + 1}"></textarea>`;
                }
            }
            if (this.inputs.length === 8) {
                this.addInputBtn.setAttribute("disabled",true);
            }
        })
        this.removeInputBtn.addEventListener('click', () => {
            if (this.inputs.length === 8) {
                this.addInputBtn.removeAttribute("disabled");
            }
            if (this.inputs.length > 1) {
                let elm = document.getElementById(`${this.inputs[this.inputs.length -1].id}`);
                elm.parentNode.removeChild(elm);
                if (this._currentType === 204 && this.inputs.length > 1) {
                    this.inputs[this.inputs.length - 1].placeholder = "Sinon ...";
                }
            }
            if (this.inputs.length === 1) {
                this.removeInputBtn.setAttribute("disabled",true);
            }
        })
    }

    hide () {
        this.wrapper.style.zIndex = -3;
        this.inputWrapper.innerHTML = "";
        document.getElementById("inp_0").style.display = "none";
    }

    isValid() {
        let isValid = false;
        switch (this._currentType) {
            case TYPE.ISSUE:
                isValid = this.inputsData[1] !== "";
                break;
            case TYPE.ASSIGNMENT:
                isValid = this.inputsData[0] !== "";
                break;
            case TYPE.SWITCH:
                isValid = this.inputsData.every(input => input !== "");
                break;
            case TYPE.LOOP:
                isValid = true;
                break;
            case TYPE.CONDITION:
                isValid = this.inputsData.every(input => input !== "");
                break;
            default:
                isValid = true;
                break;
        }
        return isValid;
    }

    create(type) {
        this.resetInputs();
        this._currentType = type;
        switch (type) {
            case TYPE.ISSUE:
                this.inputWrapper.innerHTML = `<textarea class="model-input" id="inp_1" cols="20" rows="6" placeholder="Donnée1, ..."></textarea>
                                    <textarea class="model-input" id="inp_2" cols="20" rows="6" placeholder="Problème"></textarea>
                                    <textarea class="model-input" id="inp_3" cols="20" rows="6" placeholder="Résultat1, ..."></textarea>`;    
                break;
            case TYPE.ASSIGNMENT:
                this.inputWrapper.innerHTML = `<textarea class="model-input" id="inp_1" cols="20" rows="6" placeholder="valeur1 <-- valeur2"></textarea>`;
                break;
            case TYPE.SWITCH:
                document.getElementById("inp_0").value = "";
                document.getElementById("inp_0").style.display = "flex";
                this.removeInputBtn.removeAttribute("disabled");
                this.inputWrapper.innerHTML = `<textarea class="model-input" id="inp_1" cols="20" rows="6" placeholder="Valeur1"></textarea>
                                            <textarea class="model-input" id="inp_2" cols="20" rows="6" placeholder="Valeur2"></textarea>`;
                
                break;
            case TYPE.LOOP:
                this.inputWrapper.innerHTML = `<textarea class="model-input" id="inp_1" cols="20" rows="6" placeholder="Pour i allant\nde ... à ..."></textarea>`;
                break;
            case TYPE.CONDITION:
                this.inputWrapper.innerHTML = `<textarea class="model-input" id="inp_1" cols="20" rows="6" placeholder="Si ..."></textarea>`;
                break;
            default:
                this.inputWrapper.innerHTML = `<textarea class="model-input" disabled id="inp_1" cols="20" rows="6"></textarea>`;
                break;
        }
    }
    
    show(type) {
        document.getElementById("inp_1").focus();
        if (type === TYPE.CONDITION || type === TYPE.SWITCH) {
            this.addInputBtn.style.display = 'inline-block';
            this.removeInputBtn.style.display = 'inline-block';
        } else {
            this.addInputBtn.style.display = 'none';
            this.removeInputBtn.style.display = 'none';
        }
        this.wrapper.style.zIndex = 3;
    }
}
