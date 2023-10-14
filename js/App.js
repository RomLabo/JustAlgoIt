class App {
    constructor() {
        this.canvas = document.getElementById('main-canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth * .98;
        this.canvas.height = window.innerHeight * .9;

        this.lastCnWidth = this.canvas.width;
        this.lastCnvHeight = this.canvas.height;
        
        this.allBtn = document.querySelectorAll('.header__btn');
        this.allModelBtn = document.querySelectorAll('.node__btn');
        this.nodeForm = document.getElementById('node__form');
        this.nodeMenu = document.getElementById('node__menu');
        this.validModel = document.getElementById('valid-model');
        this.downloadBtn = document.getElementById('save-file');
        this.nodeMenuType = document.getElementById('node__menu-type');
        this.nodeMenuTypeCancelBtn = document.getElementById("cancel__btn");
        this.allnodeMenuTypeBtn = document.querySelectorAll('.node__menu-type-img');
        this.fileInput = document.getElementById("file__input");
        
        this.file = new File("save-canvas");
        this.data = new Data();
        this.history = new History("main-canvas");
        this.landmarks = new Landmark(
            "main-canvas", 
            "landmark__vertical", 
            "landmark__horizontal"
        );
        this.form = new Form(this.nodeForm);
        this.links = new Link(this.canvas);

        this.elms = [];
        this.indexElms = this.elms.length - 1;
        this.indexOfElmThatWasClicked = -1;
        this.clickAreaThatWasClicked = -1;
        this.mouseDown = false;

        this.intervaleForm;
        this.intervaleFile;
        this.intervale;
        this.imData;
        this.deltaData = [];
        this.key;
        this.deltaKey;
    }

    displayModelMenu(x = '20', y = '20', z = -6) {
        this.nodeMenu.style.zIndex = z;
        if (x+this.nodeMenu.clientWidth>this.canvas.width) {
            this.nodeMenu.style.left = `${x-this.nodeMenu.clientWidth}px`;    
        } else {
            this.nodeMenu.style.left = `${x}px`;    
        }

        if (y+this.nodeMenu.clientHeight>this.canvas.height) {
            this.nodeMenu.style.top = `${y-this.nodeMenu.clientHeight}px`;    
        } else {
            this.nodeMenu.style.top = `${y}px`;    
        }
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
        this.landmarks.init();  

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
                this.displayModelMenu(z.clientX, z.offsetY, 4);
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

        window.addEventListener("resize", () => {
            this.canvas.width = window.innerWidth * .98;
            this.canvas.height = window.innerHeight * .9;
            this.context.font = '16px arial';
            this.context.lineWidth = 2;

            this.elms.forEach(elm => {
                elm.majPos(Math.round((((elm.x*100)/this.lastCnWidth)*this.canvas.width)/100),
                           Math.round((((elm.y*100)/this.lastCnvHeight)*this.canvas.height)/100));
                elm.majCoord();
            })

            this.lastCnWidth = this.canvas.width;
            this.lastCnvHeight = this.canvas.height;
        })

        this.fileInput.addEventListener("change", (e) => {
            console.log(e.target.files.length);
            if (e.target.files.length > 0) {
                this.elms.splice(0);
                this.eraseCanvas();
                this.file.load(e);

                this.intervaleFile = setInterval(() => {
                    if (this.file.isFileLoaded()) {
                        try {
                            this.deltaKey = this.data.load(this.deltaData,this.file.data,localStorage)
                            this.key = this.deltaKey[0];
                            this.imData = this.deltaKey[1];

                            // Créer une fonction pour créer des noeuds et enlever redondance. (**)
                            this.deltaKey[2].forEach(node => {
                                switch (node.type) {
                                    case 208:
                                        this.elms.push(
                                            new Issue(
                                                this.canvas,
                                                node.x,node.y,
                                                [...node.txt]
                                            )
                                        );
                                        break;
                                    case 207:
                                        this.elms.push(
                                            new Assignment(
                                                this.canvas,
                                                node.x,node.y,
                                                [...node.txt]
                                            )
                                        );
                                        break;
                                    case 206:
                                        this.elms.push(
                                            new Switch(
                                                this.canvas,
                                                node.x,node.y,
                                                [...node.txt]
                                            )
                                        );
                                        break;
                                    case 205:
                                        this.elms.push(
                                            new Loop(
                                                this.canvas,
                                                node.x,node.y,
                                                [...node.txt]
                                            )
                                        );
                                        break;
                                    case 204:
                                        this.elms.push(
                                            new Condition(
                                                this.canvas,
                                                node.x,node.y,
                                                [...node.txt]
                                            )
                                        );
                                        break;
                                    default:
                                        this.elms.push(
                                            new Break(
                                                this.canvas,
                                                node.x,node.y,
                                                [...node.txt]
                                            )
                                        );
                                        break;
                                }
                                this.elms[this.elms.length - 1].output = node.output;
                            });
                        } catch (error) {
                            clearInterval(this.intervaleFile);
                            console.error(error);
                        }
                        clearInterval(this.intervaleFile);
                    }
                },100)
            } else {
                clearInterval(this.intervaleFile);
            }
        })

        this.allBtn.forEach(btn => btn.addEventListener('click', () => {
            this.displayModelMenu();
            switch (btn.id) {
                case 'new-file': 
                    this.eraseCanvas();
                    this.elms.splice(0);
                    break;
                case 'open-file':
                    this.fileInput.click();
                    break;
                case 'save-file':
                    clearInterval(this.intervale);

                    this.deltaData = [];
                    this.history.add();
                    try {
                        this.deltaKey = this.data.save(
                            this.elms,
                            localStorage, 
                            Color.invert(this.history.data),
                            this.deltaData
                        );
                        this.context.putImageData(
                            this.deltaKey[1]
                            ,0, 0
                        );
                        this.key=this.deltaKey[2];
                        this.downloadBtn.href = this.canvas.toDataURL();
                    } catch (error) {
                        console.error(error);
                    }
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
                    this.nodeMenuType.style.zIndex = 5;
                    // this.canvas.addEventListener('click',() => this.history.add(), {once: true});
                    break;
            }
        }))

        // Select model type
        this.allnodeMenuTypeBtn.forEach(modelType => modelType.addEventListener('click', () => {
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
                clearInterval(this.intervaleForm);
                // (**)
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
                            new Assignment(
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
            
            this.nodeMenuType.style.zIndex = -5;
        }))

        this.nodeMenuTypeCancelBtn.addEventListener("click", () => this.nodeMenuType.style.zIndex = -5);

        this.allModelBtn.forEach(modelBtn => modelBtn.addEventListener("click", () => {
            switch (modelBtn.id) {
                case "move":
                    this.mouseDown = true;
                    break;
                case "modify":
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
                case "link":
                    this.links.addLink(this.elms, 
                                    this.indexOfElmThatWasClicked, 
                                    this.clickAreaThatWasClicked);
                    break;
                case "unlink":
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









