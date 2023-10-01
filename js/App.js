class App {
    constructor() {
        this.canvas = document.getElementById('main-canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth * .98;
        this.canvas.height = window.innerHeight * .9;
        
        this.allBtn = document.querySelectorAll('.main-btn');
        this.allModelBtn = document.querySelectorAll('.model-btn');
        this.formWrapper = document.getElementById('model-form');
        this.modelMenu = document.getElementById('model-menu');
        this.validModel = document.getElementById('valid-model');
        //this.invalidModel = document.getElementById('invalid-model');
        this.downloadBtn = document.getElementById('save-file');
        this.modelType = document.getElementById('model-type');
        this.closeModelType = document.getElementById("close");
        this.allModelType = document.querySelectorAll('.model-ty');
        
        
        this.file = new File();
        this.data = new Data();
        this.history = new History();
        this.color = new Color();
        this.landmarks = new Landmark("main-canvas", "vertical-line", "horizontal-line");
        this.form = new Form(this.formWrapper);
        this.links = new Link(this.canvas);

        this.elms = [];
        this.indexElms = this.elms.length - 1;
        this.indexOfElmThatWasClicked = -1;
        this.clickAreaThatWasClicked = -1;
        this.mouseDown = false;

        this.intervaleForm;
    }

    displayModelMenu(x = '20%', y = '20%', z = -6) {
        this.modelMenu.style.zIndex = z;
        this.modelMenu.style.left = `${x}px`;
        this.modelMenu.style.top = `${y}px`;
    }

    changeColor(color) {
        this.context.fillStyle = color;
        this.context.strokeStyle = color;
    }

    eraseCanvas() {
        this.changeColor("#161b22");
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.changeColor("#ffffff");
    }

    deleteElm() {
        for (let i = 0; i < this.elms.length; i++) {
            for (let z = 0; z < this.elms[i].output.length; z++) {
                for (let j = 0; j < this.elms[i].output[z].length; j++) {
                    if (this.elms[i].output[z][j] == this.indexOfElmThatWasClicked) {
                        this.elms[i].output[z].splice(j,1);
                    } 
                    if (this.elms[i].output[z][j] > this.indexOfElmThatWasClicked) {
                        this.elms[i].output[z][j] --;
                    }
                }   
            }
        }
        this.elms.splice(this.indexOfElmThatWasClicked, 1);
    }

    main() {
        // this.file.create();
        this.landmarks.display();  

        this.canvas.addEventListener('click', (z) => {
            this.mouseDown = false;

            this.indexOfElmThatWasClicked = -1;
            for (let i = 0; i < this.elms.length; i++) {
                this.clickAreaThatWasClicked = this.elms[i].isClicked(z);
                if (this.clickAreaThatWasClicked !== -1) {
                    this.indexOfElmThatWasClicked = i;
                    break;
                } 
            }

            if (this.indexOfElmThatWasClicked !== -1) {
                this.displayModelMenu(z.offsetX, z.offsetY, 4);
                this.indexElms = this.indexOfElmThatWasClicked;
            } else {
                this.displayModelMenu();
            }
        })

        this.canvas.addEventListener('mousemove', (a) => {
            if (this.mouseDown) {
                this.elms[this.indexElms].majPos((a.offsetX)|0,(a.offsetY)|0);
                this.elms[this.indexElms].majCoord();
            }
        })

        this.allBtn.forEach(btn => btn.addEventListener('click', () => {
            this.displayModelMenu();
            switch (btn.id) {
                case 'new-file': 
                    this.file.create();
                    this.elms.splice(0);
                    break;
                case 'open-file':
                    this.file.load();
                    let idInterval = setInterval(() =>{ 
                        if (this.file.fData !== undefined) {
                            let data = this.data.load(this.file.fData);
                            this.elms.splice(0);
                            this.file.create();
                            if (data.length > 0) {
                                for (let i = 0; i < data.length; i++) {
                                    switch (data[i].type) {
                                        case 208:
                                            this.elms.push(
                                                new Issue(
                                                    this.canvas,
                                                    data[i].x,data[i].y,
                                                    [...data[i].txt]
                                                )
                                            );
                                            break;
                                        case 207:
                                            this.elms.push(
                                                new Affectation(
                                                    this.canvas,
                                                    data[i].x,data[i].y,
                                                    [...data[i].txt]
                                                )
                                            );
                                            break;
                                        case 206:
                                            this.elms.push(
                                                new Switch(
                                                    this.canvas,
                                                    data[i].x,data[i].y,
                                                    [...data[i].txt]
                                                )
                                            );
                                            break;
                                        case 205:
                                            this.elms.push(
                                                new Loop(
                                                    this.canvas,
                                                    data[i].x,data[i].y,
                                                    [...data[i].txt]
                                                )
                                            );
                                            break;
                                        case 204:
                                            this.elms.push(
                                                new Condition(
                                                    this.canvas,
                                                    data[i].x,data[i].y,
                                                    [...data[i].txt]
                                                )
                                            );
                                            break;
                                        default:
                                            this.elms.push(
                                                new Break(
                                                    this.canvas,
                                                    data[i].x,data[i].y,
                                                    [...data[i].txt]
                                                )
                                            );
                                            break;
                                    }
                                    this.elms[this.elms.length - 1].output = data[i].output;
                                }
                            }
                            clearInterval(idInterval);
                        }
                    }, 100);
                    console.log(this.elms);
                    break;
                case 'save-file':
                    clearInterval(this.intervale);
                    this.history.add();
                    this.context.putImageData(
                        this.data.save(
                            this.elms, 
                            this.color.invert(this.history.hData)
                        ),0, 0
                    );
                    this.downloadBtn.href = this.canvas.toDataURL();
                    setTimeout(() => {
                        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        this.intervale = setInterval(() => {
                            this.eraseCanvas();
                            this.elms.forEach(elm => elm.draw())
                            for (let i = 0; i < this.elms.length; i++) {
                                this.links.draw(this.elms,this.elms[i]);
                            }
                        }, 100);
                    }, 1000);
                    break;
                case 'undo':
                    // this.history.back();
                    break;
                case 'redo':
                    // this.history.forward();
                    break;
                case 'add':
                    this.modelType.style.zIndex = 5;
                    // this.canvas.addEventListener('click',() => this.history.add(), {once: true});
                    break;
            }
        }))

        // Select model type
        this.allModelType.forEach(modelType => modelType.addEventListener('click', () => {
            this.form.create(Number(modelType.id));
            this.form.show(Number(modelType.id));

            this.intervaleForm = setInterval(() => {
                if (this.form.isValid()) {
                    this.validModel.removeAttribute("disabled");
                } else {
                    this.validModel.setAttribute("disabled",true);
                }
            },100);
            
            this.validModel.addEventListener("click", () => {
                clearInterval(this.intervaleForm)
                switch (modelType.id) {
                    case "208":
                        this.elms.push(
                            new Issue(
                                this.canvas,0,0,
                                this.form.inputsData
                            )
                        );
                        break;
                    case "207":
                        this.elms.push(
                            new Affectation(
                                this.canvas,0,0,
                                this.form.inputsData
                            )
                        );
                        break;
                    case "206":
                        this.elms.push(
                            new Switch(
                                this.canvas,0,0,
                                this.form.inputsData
                            )
                        );
                        break;
                    case "205":
                        this.elms.push(
                            new Loop(
                                this.canvas,0,0,
                                this.form.inputsData
                            )
                        );
                        break;
                    case "204":
                        this.elms.push(
                            new Condition(
                                this.canvas,0,0,
                                this.form.inputsData
                            )
                        );
                        break;
                    case "203":
                        this.elms.push(
                            new Break(
                                this.canvas,0,0,
                                this.form.inputsData
                            )
                        );
                        break;
                    default:
                        break;
                }

                this.form.hide();
                this.validModel.setAttribute("disabled",true);
                this.indexElms = this.elms.length - 1;
                this.mouseDown = true;

                console.log(this.elms);
            },{once: true});
            
            this.modelType.style.zIndex = -5;
        }))

        this.closeModelType.addEventListener("click", () => this.modelType.style.zIndex = -5);

        this.allModelBtn.forEach(modelBtn => modelBtn.addEventListener('click', () => {
            switch (modelBtn.id) {
                case 'model-move':
                    this.mouseDown = true;
                    break;
                case 'model-modify':
                    this.form.addTextInput(this.elms[this.indexElms].txt,
                                           this.elms[this.indexElms].type);
                    this.form.show(this.elms[this.indexElms].type);

                    this.intervaleForm = setInterval(() => {
                        if (this.form.isValid()) {
                            this.validModel.removeAttribute("disabled");
                        } else {
                            this.validModel.setAttribute("disabled",true);
                        }
                    },100);

                    this.validModel.addEventListener("click", () => {
                        clearInterval(this.intervaleForm);
                        this.elms[this.indexElms].majTxt(this.form.inputsData);
                        this.form.hide();
                        this.validModel.setAttribute("disabled",true);
                    },{once: true});
                    break;
                case 'model-link':
                    this.links.addLink(this.elms, 
                                    this.indexOfElmThatWasClicked, 
                                    this.clickAreaThatWasClicked);
                    break;
                case 'model-unlink':
                    this.links.removeLink(this.elms,
                                    this.indexOfElmThatWasClicked, 
                                    this.clickAreaThatWasClicked);
                    break;
                default:
                    this.deleteElm();
                    // this.history.add();
                    break;
            }

            this.displayModelMenu();
        }))

        this.intervale = setInterval(() => {
            this.eraseCanvas();
            this.elms.forEach(elm => elm.draw())
            for (let i = 0; i < this.elms.length; i++) {
                this.links.draw(this.elms,this.elms[i]);
            }
        }, 100);
    }
}

const app = new App();
app.main();









