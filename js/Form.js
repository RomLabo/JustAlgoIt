/*
0000000001 Author RomLabo
1000111000 Class Form
1000000001 Created on 17/04/2023.
1000100011111000000001100001110000
1000110001111000110001100010101000
0000011000011000000001100011011000
*/
class Form {
    constructor(formWrapper) {
        this.wrapper = formWrapper;
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
        if (this._currentType === 206) {
            this._inputsData.push(document.getElementById("inp_0").value)
        }
        return this._inputsData;
    }

    addTextInput(txtArray, type) {
        this._currentType = type;
        if (type === 206) {
            for (let i = 0; i < txtArray.length - 1; i++) {
                this.inputWrapper.innerHTML += `<textarea class="model-input" id="inp_${this.inputs.length + 1}"
                                            cols="20" rows="6" placeholder="Données"></textarea>`;
                document.getElementById("inp_0").style.display = "flex";                                            
            }
        } else {
            for (let i = 0; i < txtArray.length; i++) {
                this.inputWrapper.innerHTML += `<textarea class="model-input" id="inp_${this.inputs.length + 1}"
                                            cols="20" rows="6" placeholder="Données"></textarea>`;
            }
        }
        for (let i = 0; i < txtArray.length; i++) {
            if (type === 208 && (i === 0 || i === 2)) {
                this.inputs[i].value = txtArray[i].join(' ').replaceAll('  ', ' ');
            } else if (type === 206) {
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
            if (this.inputs.length <= 10) {
                this.inputWrapper.innerHTML += `<textarea class="model-input" id="inp_${this.inputs.length + 1}"
                                             cols="20" rows="6" placeholder="Données"></textarea>`;
            }
        })
        this.removeInputBtn.addEventListener('click', () => {
            if (this.inputs.length > 1) {
                let elm = document.getElementById(`${this.inputs[this.inputs.length -1].id}`);
                elm.parentNode.removeChild(elm);
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
            case 208:
                isValid = this.inputsData[1] !== "";
                break;
            case 207:
                isValid = this.inputsData[0] !== "";
                break;
            case 206:
                isValid = this.inputsData.every(input => input !== "");
                break;
            case 205:
                isValid = true;
                break;
            case 204:
                isValid = this.inputsData.every(input => input !== "");
                break;
            default:
                isValid = true;
                break;
        }
        return isValid;
    }

    create(type) {
        this._currentType = type;
        if (type === 208) {
            this.inputWrapper.innerHTML = `<textarea class="model-input" id="inp_1" cols="20" rows="6" placeholder="Données"></textarea>
                                    <textarea class="model-input" id="inp_2" cols="20" rows="6" placeholder="Sous-problème"></textarea>
                                    <textarea class="model-input" id="inp_3" cols="20" rows="6" placeholder="Résultats"></textarea>`;
        } else if (type === 203) {
            this.inputWrapper.innerHTML = `<textarea class="model-input" disabled id="inp_1" cols="20" rows="6"></textarea>`;
        } else if (type === 206) {
            document.getElementById("inp_0").value = "";
            document.getElementById("inp_0").style.display = "flex";
            this.inputWrapper.innerHTML = `<textarea class="model-input" id="inp_1" cols="20" rows="6" placeholder="Données"></textarea>
                                            <textarea class="model-input" id="inp_2" cols="20" rows="6" placeholder="Données"></textarea>`;
        } else {
            this.inputWrapper.innerHTML = `<textarea class="model-input" id="inp_1" cols="20" rows="6" placeholder="Données"></textarea>`;
        }
    }
    
    show(type) {
        if (type === 204 || type === 206) {
            this.addInputBtn.style.display = 'inline-block';
            this.removeInputBtn.style.display = 'inline-block';
        } else {
            this.addInputBtn.style.display = 'none';
            this.removeInputBtn.style.display = 'none';
        }
        this.wrapper.style.zIndex = 3;
    }
}
