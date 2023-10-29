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
        this.indexElms = -1;
        this.clickAreaClicked = -1;
        this.mouseDown = false;

        this.intervaleForm;
        this.intervaleFile;
        this.intervale;
        this.imData;
        this.deltaData = [];
        this.key;
        this.deltaKey;

        this.elmsWereModified = false;
    }

    displayModelMenu(x = '20', y = '20', z = -6) {
        this.nodeMenu.style.zIndex = z;
        if (x + this.nodeMenu.clientWidth>this.canvas.width) {
            this.nodeMenu.style.left = `${x-this.nodeMenu.clientWidth}px`;
        } else if (x - this.nodeMenu.clientWidth < 0) {
            this.nodeMenu.style.left = `${x}px`;
        } else {
            this.nodeMenu.style.left = `${x - 45}px`;    
        }

        if (y + this.nodeMenu.clientHeight>this.canvas.height) {
            this.nodeMenu.style.top = `${y - this.nodeMenu.clientHeight}px`;
        } else if (y - this.nodeMenu.clientHeight < 0) {
            this.nodeMenu.style.top = `${y}px`;
        } else {
            this.nodeMenu.style.top = `${y - 45}px`;    
        }
    }

    changeColor(color) {
        this.context.fillStyle = color;
        this.context.strokeStyle = color;
    }

    eraseCanvas() {
        this.changeColor("#161b22");
        this.context.fillRect(
            0, 0, 
            this.canvas.width, 
            this.canvas.height
        );
        this.changeColor("#ffffff");
    }

    deleteNode() {
        for (let i = 0; i < this.elms.length; i++) {
            for (let z = 0; z < this.elms[i].output.length; z++) {
                for (let j = 0; j < this.elms[i].output[z].length; j++) {
                    if (this.elms[i].output[z][j] == this.indexElms) {
                        this.elms[i].output[z].splice(j,1);
                    } 
                    if (this.elms[i].output[z][j] > this.indexElms) {
                        this.elms[i].output[z][j] --;
                    }
                }   
            }
        }
        this.elms.splice(this.indexElms, 1);
    }

    createNode(type, params) {
        switch (type) {
            case 208:
                this.elms.push(new Issue(...params));
                break;
            case 207:
                this.elms.push(new Assignment(...params));
                break;
            case 206:
                this.elms.push(new Switch(...params));
                break;
            case 205:
                this.elms.push(new Loop(...params));
                break;
            case 204:
                this.elms.push(new Condition(...params));
                break;
            default:
                this.elms.push(new Break(...params));
                break;
        }
    }

    drawAllNodes() {
        if (this.elmsWereModified) {
            this.eraseCanvas();
            this.elms.forEach(elm => elm.draw())
            for (let i = 0; i < this.elms.length; i++) {
                this.links.draw(this.elms,this.elms[i]);
            }
            this.elmsWereModified = false;
        }
    }

    main() {
        this.landmarks.init();  

        this.canvas.addEventListener("dblclick", (e) => {
            this.mouseDown = false;
            this.clickAreaClicked = -1;
            let i = 0;
            while (i < this.elms.length && this.clickAreaClicked === -1) {
                this.clickAreaClicked = this.elms[i].isClicked(e);
                if (this.clickAreaClicked !== -1) {
                    this.displayModelMenu(e.clientX, e.offsetY, 4);
                    this.indexElms = i;
                    break;
                } 
                i ++; 
            }
        })

        this.canvas.addEventListener("mousedown", (e) => {
            e.stopPropagation();
            this.displayModelMenu();
            this.clickAreaClicked = -1;
            let i = 0;
            while (i < this.elms.length && this.clickAreaClicked === -1) {
                this.clickAreaClicked = this.elms[i].isClicked(e);
                if (this.clickAreaClicked !== -1) {
                    this.indexElms = i;
                    this.mouseDown = true;
                    break;
                }
                i ++; 
            }
        })

        window.addEventListener("mouseup", (e) => {
            e.stopPropagation();
            this.mouseDown = false
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.mouseDown) {
                this.elmsWereModified = true;
                this.elms[this.indexElms].majPos((e.offsetX)|0,(e.offsetY)|0);
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
            this.elmsWereModified = true;

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

                            this.deltaKey[2].forEach(node => {
                                this.createNode(node.type,[this.canvas,node.x,node.y,[...node.txt]]);
                                this.elms[this.elms.length - 1].output = node.output;
                            });

                            this.elmsWereModified = true;
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

        // Main menu
        this.allBtn.forEach(btn => btn.addEventListener('click', () => {
            this.displayModelMenu();
            this.mouseDown = false;
            switch (btn.id) {
                case 'new-file': 
                    this.eraseCanvas();
                    this.elms.splice(0);
                    this.elmsWereModified = true;
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
                        this.elmsWereModified = true;
                        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        this.intervale = setInterval(() => this.drawAllNodes(), 100);
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
                    break;
            }
        }))

        // Select node type
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
                this.createNode(Number(modelType.id),[this.canvas,0,0,this.form.inputsData]);
                this.form.hide();
                this.validModel.setAttribute("disabled",true);
                this.indexElms = this.elms.length - 1;
                this.mouseDown = true;
                // ----------------------
                console.log(this.elms);
            },{once: true});
            this.nodeMenuType.style.zIndex = -5;
        }))

        // Hide node menu
        this.nodeMenuTypeCancelBtn.addEventListener("click", () => this.nodeMenuType.style.zIndex = -5);

        // Update node params
        this.allModelBtn.forEach(modelBtn => modelBtn.addEventListener("click", () => {
            switch (modelBtn.id) {
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
                        this.elmsWereModified = true;
                    },{once: true});
                    break;
                case "link":
                    this.links.addLink(this.elms, 
                                    this.indexElms, 
                                    this.clickAreaClicked);
                    break;
                case "unlink":
                    this.links.removeLink(this.elms,
                                    this.indexElms, 
                                    this.clickAreaClicked);
                    break;
                default:
                    this.deleteNode();
                    break;
            }
            this.elmsWereModified = true;
            this.displayModelMenu();
        }))

        // Draw all nodes
        this.intervale = setInterval(() => this.drawAllNodes(), 100);
    }
}

const app = new App();
app.main();









