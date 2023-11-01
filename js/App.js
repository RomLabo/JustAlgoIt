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

        this.elmsWereModified = false;

        this.tabMenuBtn = document.getElementById("tab__menu-btn");
        this.tabMenu = document.getElementById("tab__menu");
        this.tabWrapper = document.getElementById("tab__wrapper");

        this.currentElmsIndex = 0;
        this.allElms = [
            []
        ];
        
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
    }

    displayModelMenu(x = '20', y = '20', z = -6) {
        this.nodeMenu.style.zIndex = z;
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
        for (let i = 0; i < this.allElms[this.currentElmsIndex].length; i++) {
            for (let z = 0; z < this.allElms[this.currentElmsIndex][i].output.length; z++) {
                for (let j = 0; j < this.allElms[this.currentElmsIndex][i].output[z].length; j++) {
                    if (this.allElms[this.currentElmsIndex][i].output[z][j] == this.indexElms) {
                        this.allElms[this.currentElmsIndex][i].output[z].splice(j,1);
                    } 
                    if (this.allElms[this.currentElmsIndex][i].output[z][j] > this.indexElms) {
                        this.allElms[this.currentElmsIndex][i].output[z][j] --;
                    }
                }   
            }
        }
        this.allElms[this.currentElmsIndex].splice(this.indexElms, 1);
    }

    createNode(type, params) {
        switch (type) {
            case 208:
                this.allElms[this.currentElmsIndex].push(new Issue(...params));
                break;
            case 207:
                this.allElms[this.currentElmsIndex].push(new Assignment(...params));
                break;
            case 206:
                this.allElms[this.currentElmsIndex].push(new Switch(...params));
                break;
            case 205:
                this.allElms[this.currentElmsIndex].push(new Loop(...params));
                break;
            case 204:
                this.allElms[this.currentElmsIndex].push(new Condition(...params));
                break;
            default:
                this.allElms[this.currentElmsIndex].push(new Break(...params));
                break;
        }
    }

    drawAllNodes() {
        if (this.elmsWereModified) {
            this.eraseCanvas();
            this.allElms[this.currentElmsIndex].forEach(elm => elm.draw())
            for (let i = 0; i < this.allElms[this.currentElmsIndex].length; i++) {
                this.links.draw(this.allElms[this.currentElmsIndex],this.allElms[this.currentElmsIndex][i]);
            }
            this.elmsWereModified = false;
        }
    }

    changeTabStyle(currentElmsIndex, cssClassName) {
        document.getElementById(
            `tab_${currentElmsIndex}`
        ).setAttribute("class",cssClassName);
    }

    addTabElm() {
        this.tabWrapper.innerHTML += `<div id="tab_${this.allElms.length}" 
                                        class="tab-active">
                                        algo_${this.allElms.length +1}
                                        <button id="close-tab__btn_${this.allElms.length}" class="tab__close-btn">x</button>
                                    </div>`;
    }

    main() {
        this.landmarks.init();  

        this.tabWrapper.addEventListener("click", (e) => {
            if ((e.target.tagName === "DIV") 
                && (Number(e.target.id.split("_")[1]) !== this.currentElmsIndex)) {
                    this.changeTabStyle(this.currentElmsIndex,"tab-inactive")
                    this.currentElmsIndex = Number(e.target.id.split("_")[1]);
                    this.changeTabStyle(this.currentElmsIndex,"tab-active")
                    this.elmsWereModified = true;
            } else if (e.target.tagName === "BUTTON") {
                this.tabWrapper.children[Number(e.target.id.split("_")[3])].remove();
                this.allElms.splice(Number(e.target.id.split("_")[3]),1);
                for (let i = Number(e.target.id.split("_")[3]); i < this.tabWrapper.children.length; i++) {
                    this.tabWrapper.children[i].setAttribute("id",`tab_${i}`);
                    this.tabWrapper.children[i].children[0].setAttribute("id",`close-tab__btn_${i}`);
                }
                this.changeTabStyle(Number(e.target.id.split("_")[3] - 1),"tab-active");
                this.currentElmsIndex = Number(e.target.id.split("_")[3] - 1);
                this.elmsWereModified = true;
            }
        })

        this.canvas.addEventListener("dblclick", (e) => {
            this.mouseDown = false;
            this.clickAreaClicked = -1;
            let i = 0;
            while (i < this.allElms[this.currentElmsIndex].length && this.clickAreaClicked === -1) {
                this.clickAreaClicked = this.allElms[this.currentElmsIndex][i].isClicked(e);
                if (this.clickAreaClicked !== -1) {
                    if (this.allElms[this.currentElmsIndex][i].type === 208 
                        && this.allElms[this.currentElmsIndex][i].output[0].length === 0
                        && this.allElms.length < 10) {
                        document.getElementById("breakdown").removeAttribute("disabled");
                    }
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
            while (i < this.allElms[this.currentElmsIndex].length && this.clickAreaClicked === -1) {
                this.clickAreaClicked = this.allElms[this.currentElmsIndex][i].isClicked(e);
                if (this.clickAreaClicked !== -1) {
                    this.indexElms = i;
                    this.mouseDown = true;
                    break;
                }
                i ++; 
            }

            if (!document.getElementById("breakdown").hasAttribute("disabled")) {
                document.getElementById("breakdown").setAttribute("disabled",true);
            }
        })

        this.tabMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.tabMenu.style.zIndex = 5;
        })

        window.addEventListener("mouseup", (e) => {
            e.stopPropagation();
            this.tabMenu.style.zIndex = -5;
            this.mouseDown = false;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.mouseDown) {
                this.elmsWereModified = true;
                this.allElms[this.currentElmsIndex][this.indexElms].majPos((e.offsetX)|0,(e.offsetY)|0);
                this.allElms[this.currentElmsIndex][this.indexElms].majCoord();
            }
        })

        window.addEventListener("resize", () => {
            this.canvas.width = window.innerWidth * .98;
            this.canvas.height = window.innerHeight * .9;
            this.context.font = '16px arial';
            this.context.lineWidth = 2;

            this.allElms.forEach(elmTab => {
                elmTab.forEach(elm => {
                    elm.majPos(Math.round((((elm.x*100)/this.lastCnWidth)*this.canvas.width)/100),
                           Math.round((((elm.y*100)/this.lastCnvHeight)*this.canvas.height)/100));
                    elm.majCoord();
                })
            })
            this.elmsWereModified = true;

            this.lastCnWidth = this.canvas.width;
            this.lastCnvHeight = this.canvas.height;
        })

        this.fileInput.addEventListener("change", (e) => {
            console.log(e.target.files.length);
            if (e.target.files.length > 0) {
                this.allElms[this.currentElmsIndex].splice(0);
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
                                this.allElms[this.currentElmsIndex][this.allElms[this.currentElmsIndex].length - 1].output = node.output;
                            });

                            // ---------------------------
                            console.log(this.allElms);
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
                    this.changeTabStyle(
                        this.currentElmsIndex, 
                        "tab-inactive"
                    );
                    this.addTabElm();
                    this.allElms.push([]);
                    this.currentElmsIndex = this.allElms.length -1;
                    this.elmsWereModified = true;

                    if (this.allElms.length === 10) {
                        btn.setAttribute("disabled",true);
                    }
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
                            this.allElms[this.currentElmsIndex],
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
                this.indexElms = this.allElms[this.currentElmsIndex].length - 1;
                this.mouseDown = true;
                // ----------------------
                console.log(this.allElms);
            },{once: true});
            this.nodeMenuType.style.zIndex = -5;
        }))

        // Hide node menu
        this.nodeMenuTypeCancelBtn.addEventListener("click", () => this.nodeMenuType.style.zIndex = -5);

        // Update node params
        this.allModelBtn.forEach(modelBtn => modelBtn.addEventListener("click", () => {
            switch (modelBtn.id) {
                case "modify":
                    this.form.addTextInput(this.allElms[this.currentElmsIndex][this.indexElms].txt,
                        this.allElms[this.currentElmsIndex][this.indexElms].type);
                    this.form.show(this.allElms[this.currentElmsIndex][this.indexElms].type);

                    this.intervaleForm = setInterval(() => {
                        if (this.form.isValid()) {
                            this.validModel.removeAttribute("disabled");
                        } else {
                            this.validModel.setAttribute("disabled",true);
                        }
                    },100);

                    this.validModel.addEventListener("click", () => {
                        clearInterval(this.intervaleForm);
                        this.allElms[this.currentElmsIndex][this.indexElms].majTxt(this.form.inputsData);
                        this.form.hide();
                        this.validModel.setAttribute("disabled",true);
                        this.elmsWereModified = true;
                    },{once: true});
                    break;
                case "link":
                    this.links.addLink(this.allElms[this.currentElmsIndex], 
                                    this.indexElms, 
                                    this.clickAreaClicked);
                    break;
                case "unlink":
                    this.links.removeLink(this.allElms[this.currentElmsIndex],
                                    this.indexElms, 
                                    this.clickAreaClicked);
                    break;
                case "breakdown":
                    this.changeTabStyle(
                        this.currentElmsIndex, 
                        "tab-inactive"
                    );
                    this.addTabElm();

                    this.allElms.push([new Issue(
                        this.canvas,
                        (this.canvas.width/2)|0,
                        (this.allElms[this.currentElmsIndex][this.indexElms].height*1.5)|0,
                        [
                            this.allElms[this.currentElmsIndex][this.indexElms].txt[0].join(' '),
                            this.allElms[this.currentElmsIndex][this.indexElms].txt[1].join('\n'),
                            this.allElms[this.currentElmsIndex][this.indexElms].txt[2].join(' ')
                        ]
                    )]);

                    let txt = this.allElms[this.currentElmsIndex][this.indexElms].txt[1].join('\n');
                    
                    this.allElms[this.currentElmsIndex][this.indexElms].majTxt(
                        [
                            this.allElms[this.currentElmsIndex][this.indexElms].txt[0].join(' '),
                            txt += `\n( voir algo_${this.allElms.length} )`,
                            this.allElms[this.currentElmsIndex][this.indexElms].txt[2].join(' ')
                        ]
                    );
                
                    this.currentElmsIndex = this.allElms.length -1;
                    this.elmsWereModified = true;
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