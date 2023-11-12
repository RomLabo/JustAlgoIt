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
        this.validNodeBtn = document.getElementById('valid__btn');
        this.downloadBtn = document.getElementById('save-file');
        this.nodeMenuType = document.getElementById('node__menu-type');
        this.nodeMenuTypeCancelBtn = document.getElementById("cancel__btn");
        this.allnodeMenuTypeBtn = document.querySelectorAll('.node__menu-type-img');
        this.fileInput = document.getElementById("file__input");
        this.tabMenuBtn = document.getElementById("tab__menu-btn");
        this.tabMenu = document.getElementById("tab__menu");
        this.tabWrapper = document.getElementById("tab__wrapper");
        
        this.file = new File("save-canvas");
        this.data = new Data();
        this.dataStorage = new DataStorage();
        this.history = new History("main-canvas");
        this.form = new Form(this.nodeForm);
        this.links = new Link(this.canvas);
        this.landmarks = new Landmark(
            "main-canvas", 
            "landmark__vertical", 
            "landmark__horizontal"
        );

        this.allAlgo = [[]];
        this.changeHasBeenMade = false;
        this.changeInProgress = false;
        this.tabCounter = 1;
        this.tabNames = [["algo_1",0]];
        this.currentAlgoIndex = 0;
        this.nodeIndex = -1;
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
     * @description changes the colour used for 
     * drawing in the canvas.
     * @param {String} color // hexa code of colour
     */
    changeColor(color) {
        this.context.fillStyle = color;
        this.context.strokeStyle = color;
    }

    /**
     * @description deletes the entire canvas.
     */
    eraseCanvas() {
        this.changeColor("#161b22");
        this.context.fillRect(
            0, 0, 
            this.canvas.width, 
            this.canvas.height
        );
        this.changeColor("#ffffff");
    }

    /**
     * @description deletes the node and any 
     * links pointing to it.
     */
    deleteNode() {
        for (let i = 0; i < this.allAlgo[this.currentAlgoIndex].length; i++) {
            for (let z = 0; z < this.allAlgo[this.currentAlgoIndex][i].output.length; z++) {
                for (let j = 0; j < this.allAlgo[this.currentAlgoIndex][i].output[z].length; j++) {
                    if (this.allAlgo[this.currentAlgoIndex][i].output[z][j] == this.nodeIndex) {
                        this.allAlgo[this.currentAlgoIndex][i].output[z].splice(j,1);
                    } 
                    if (this.allAlgo[this.currentAlgoIndex][i].output[z][j] > this.nodeIndex) {
                        this.allAlgo[this.currentAlgoIndex][i].output[z][j] --;
                    }
                }   
            }
        }
        this.allAlgo[this.currentAlgoIndex].splice(this.nodeIndex, 1);
    }

    /**
     * @description create a new node of the specified 
     * type and initialise it with the passed parameters.
     * @param {Number} type // see the shapes.js file 
     *                         for more information on types.
     * @param {Array} params // an array containing: 
     *                          - the canvas on which to draw the node
     *                          - its x coordinate
     *                          - its y coordinate
     *                          - its text
     */
    createNode(type, params) {
        switch (type) {
            case 208:
                this.allAlgo[this.currentAlgoIndex].push(new Issue(...params));
                break;
            case 207:
                this.allAlgo[this.currentAlgoIndex].push(new Assignment(...params));
                break;
            case 206:
                this.allAlgo[this.currentAlgoIndex].push(new Switch(...params));
                break;
            case 205:
                this.allAlgo[this.currentAlgoIndex].push(new Loop(...params));
                break;
            case 204:
                this.allAlgo[this.currentAlgoIndex].push(new Condition(...params));
                break;
            default:
                this.allAlgo[this.currentAlgoIndex].push(new Break(...params));
                break;
        }
    }

    /**
     * @description draws nodes from the active node array.
     */
    drawAlgo() {
        this.eraseCanvas();
        this.allAlgo[this.currentAlgoIndex].forEach(elm => elm.draw())
        for (let i = 0; i < this.allAlgo[this.currentAlgoIndex].length; i++) {
            this.links.draw(this.allAlgo[this.currentAlgoIndex],this.allAlgo[this.currentAlgoIndex][i]);
        }
        // Ancienne version ============================================
        // if (this.changeHasBeenMade) {
        //     this.eraseCanvas();
        //     this.allAlgo[this.currentAlgoIndex].forEach(elm => elm.draw())
        //     for (let i = 0; i < this.allAlgo[this.currentAlgoIndex].length; i++) {
        //         this.links.draw(this.allAlgo[this.currentAlgoIndex],this.allAlgo[this.currentAlgoIndex][i]);
        //     }
        //     this.changeHasBeenMade = false;
        // }
    }

    /**
     * @description applies the style specified by 
     * the Css class passed as a parameter to the tab.
     * @param {Number} currentElmsIndex // index of tab element
     * @param {String} cssClassName // "tab-inactive" or "tab-active"
     */
    changeTabStyle(currentElmsIndex, cssClassName) {
        document.getElementById(
            `tab_${currentElmsIndex}`
        ).setAttribute("class",cssClassName);
    }

    /**
     * @description adds a new tab element with its 
     * close button to the parent container.
     */
    addTabElm(tabTxt) {
        this.tabCounter ++;
        let tabBtn = document.createElement("button");
        tabBtn.setAttribute("id",`close-tab__btn_${this.allAlgo.length}`);
        tabBtn.setAttribute("class","tab__close-btn");
        let tab = document.createElement("div");
        tab.setAttribute("id",`tab_${this.allAlgo.length}`);
        tab.setAttribute("class","tab-active");
        tab.textContent = tabTxt;
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
        this.allAlgo.splice(Number(idOfTabElm.split("_")[3]),1);
        this.tabNames.splice(Number(idOfTabElm.split("_")[3]),1);
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
        this.tabNames[currentIndex][0] = newName;
    }

    /**
     * @description updates the x and y coordinates 
     * of the current node.
     * @param {Number} x // the new x coordinate 
     * @param {Number} y // the new y coordinate
     */
    updateCurrentNodePos(x,y) {
        this.allAlgo[this.currentAlgoIndex][this.nodeIndex].majPos((x)|0,(y)|0);
        this.allAlgo[this.currentAlgoIndex][this.nodeIndex].majCoord();
    }

    /**
     * @description updates the coordinates of all 
     * the nodes by recalculating their coordinates 
     * in proportion to the size of the canvas.
     */
    updateAllNodesPos() {
        this.allAlgo.forEach(elmTab => {
            elmTab.forEach(elm => {
                elm.majPos(
                    Math.round((((elm.x*100)/this.lastCnWidth)*this.canvas.width)/100),
                    Math.round((((elm.y*100)/this.lastCnvHeight)*this.canvas.height)/100)
                );
                elm.majCoord();
            })
        })
    }

    /**
     * @description manages user interactions 
     * and calls the appropriate functions.
     */
    main() {
        // sets the canvas landmarks
        this.landmarks.init(); 

        // Load data from localStorage if data
        // exist and if it's available
        for (let i = 0; i < this.dataStorage.data.length; i++) {
            if (i === 0) {
                this.updateTabName(this.currentAlgoIndex, this.dataStorage.data[i].tabName);
                this.dataStorage.data[i].algo.forEach(node => {
                    this.createNode(node.type,[this.canvas,node.x,node.y,[...node.txt]]);
                    this.allAlgo[this.currentAlgoIndex][this.allAlgo[this.currentAlgoIndex].length - 1].output = node.output;
                })
            } else {
                this.changeTabStyle(
                    this.currentAlgoIndex, 
                    "tab-inactive"
                );
                this.addTabElm(this.dataStorage.data[i].tabName);
                this.tabNames.push([this.dataStorage.data[i].tabName,0]);
                this.allAlgo.push([]);
                this.currentAlgoIndex = this.allAlgo.length -1;
                
                this.dataStorage.data[i].algo.forEach(node => {
                    this.createNode(node.type,[this.canvas,node.x,node.y,[...node.txt]]);
                    this.allAlgo[this.currentAlgoIndex][this.allAlgo[this.currentAlgoIndex].length - 1].output = node.output;
                })

                if (this.allAlgo.length === 10) {
                    btn.setAttribute("disabled",true);
                }
            }
            this.changeHasBeenMade = true;
            console.log(this.allAlgo);
        }


        // handles interaction with the tab menu
        this.tabWrapper.addEventListener("click", (e) => {
            if ((e.target.tagName === "DIV") 
                && (Number(e.target.id.split("_")[1]) !== this.currentAlgoIndex)) {
                    this.changeTabStyle(this.currentAlgoIndex,"tab-inactive");
                    this.currentAlgoIndex = Number(e.target.id.split("_")[1]);
                    this.changeTabStyle(this.currentAlgoIndex,"tab-active");
                    this.changeHasBeenMade = true;

            } else if (e.target.tagName === "BUTTON") {
                this.removeTab(e.target.id);
                this.updateAllTabId(e.target.id);
                this.changeTabStyle(Number(e.target.id.split("_")[3] - 1),"tab-active");

                this.currentAlgoIndex = Number(e.target.id.split("_")[3] - 1);
                this.changeHasBeenMade = true;

                if (this.tabWrapper.children.length === 1) {
                    this.tabCounter = 1;
                }

                if (this.allAlgo.length < 10 
                    && document.getElementById("new-file").hasAttribute("disabled")) {
                        document.getElementById("new-file").removeAttribute("disabled");
                }
            }
        })

        // handles double-clicks on nodes
        this.canvas.addEventListener("dblclick", (e) => {
            this.mouseDown = false;
            this.clickAreaClicked = -1;
            let i = 0;

            // Check dblclick event on nodes
            while (i < this.allAlgo[this.currentAlgoIndex].length && this.clickAreaClicked === -1) {
                this.clickAreaClicked = this.allAlgo[this.currentAlgoIndex][i].isClicked(e);
                if (this.clickAreaClicked !== -1) {
                    if (this.allAlgo[this.currentAlgoIndex][i].type === 208 
                        && this.allAlgo[this.currentAlgoIndex][i].output[0].length === 0
                        && this.allAlgo.length < 10) {
                        document.getElementById("breakdown").removeAttribute("disabled");
                    }
                    this.displayNodeMenu(e.clientX, e.offsetY);
                    this.nodeIndex = i;
                    break;
                } 
                i ++; 
            }
        })

        this.canvas.addEventListener("mousedown", (e) => {
            e.stopPropagation();
            this.hideNodeMenu();
            this.hideTabMenu();
            this.clickAreaClicked = -1;
            let i = 0;

            // Check mousedown event on nodes
            while (i < this.allAlgo[this.currentAlgoIndex].length && this.clickAreaClicked === -1) {
                this.clickAreaClicked = this.allAlgo[this.currentAlgoIndex][i].isClicked(e);
                if (this.clickAreaClicked !== -1) {
                    this.nodeIndex = i;
                    this.mouseDown = true;
                    this.changeHasBeenMade = true;
                    break;
                }
                i ++; 
            }

            // To Link nodes or Unlink nodes
            if (this.links.addInProress) {
                this.links.addLink(
                    this.allAlgo[this.currentAlgoIndex], 
                    this.nodeIndex, 
                    this.clickAreaClicked
                );
            } else if (this.links.removeInProgress) {
                this.links.removeLink(
                    this.allAlgo[this.currentAlgoIndex],
                    this.nodeIndex, 
                    this.clickAreaClicked
                );
            }

            if (!document.getElementById("breakdown").hasAttribute("disabled")) {
                document.getElementById("breakdown").setAttribute("disabled",true);
            }
        })

        // handles the display of the tab menu
        this.tabMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.displayTabMenu();
        })

        window.addEventListener("mouseup", (e) => {
            e.stopPropagation();
            if (this.mouseDown) {
                this.changeInProgress = false;
            }
            this.mouseDown = false;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.mouseDown) {
                this.changeHasBeenMade = true;
                this.changeInProgress = true;
                this.updateCurrentNodePos(e.offsetX,e.offsetY);
            }
        })

        // handles window resizing
        window.addEventListener("resize", () => {
            this.setDefaultCanvasParams();
            this.updateAllNodesPos();
            this.changeHasBeenMade = true;
            this.saveLastCanvasSize();
        })

        // handles file uploads
        this.fileInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                this.allAlgo[this.currentAlgoIndex].splice(0);
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
                                this.allAlgo[this.currentAlgoIndex][this.allAlgo[this.currentAlgoIndex].length - 1].output = node.output;
                            });

                            this.updateTabName(this.currentAlgoIndex, this.file.name);
                            this.changeHasBeenMade = true;
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

        // handles interaction with the main menu
        this.allBtn.forEach(btn => btn.addEventListener('click', () => {
            this.hideNodeMenu();
            this.hideTabMenu();
            this.mouseDown = false;
            switch (btn.id) {
                case 'new-file': 
                    this.changeTabStyle(
                        this.currentAlgoIndex, 
                        "tab-inactive"
                    );
                    this.addTabElm(`algo_${this.tabCounter + 1}`);
                    this.tabNames.push([`algo_${this.tabCounter + 1}`,0]);
                    this.allAlgo.push([]);
                    this.currentAlgoIndex = this.allAlgo.length -1;
                    
                    this.changeHasBeenMade = true;

                    if (this.allAlgo.length === 10) {
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
                            this.allAlgo[this.currentAlgoIndex],
                            localStorage, 
                            Color.invert(this.history.data),
                            this.deltaData
                        );
                        this.context.putImageData(
                            this.deltaKey[1]
                            ,0, 0
                        );
                        this.key=this.deltaKey[2];

                        // Modification du nom du fichier
                        this.downloadBtn.setAttribute(
                            "download",
                            `${this.tabWrapper.children[this.currentAlgoIndex].textContent}.png`    
                        );
                        this.downloadBtn.href = this.canvas.toDataURL();
                    } catch (error) {
                        console.error(error);
                    }
                    setTimeout(() => {
                        this.changeHasBeenMade = true;
                        this.intervale = setInterval(() => this.drawAlgo(), 100);
                    }, 1000);
                    break;
                case 'undo':
                    // this.history.back();
                    break;
                case 'redo':
                    // this.history.forward();
                    break;
                case 'add':
                    this.displayNodeMenuType();
                    break;
            }
        }))

        // handles the selection of the type of node to be created
        this.allnodeMenuTypeBtn.forEach(btn => btn.addEventListener('click', () => {
            this.form.create(Number(btn.id));
            this.form.show(Number(btn.id));

            this.intervaleForm = setInterval(() => {
                if (this.form.isValid()) {
                    this.validNodeBtn.removeAttribute("disabled");
                } else {
                    this.validNodeBtn.setAttribute("disabled",true);
                }
            },100);
            
            this.validNodeBtn.addEventListener("click", () => {
                clearInterval(this.intervaleForm);
                this.createNode(Number(btn.id),[this.canvas,0,0,this.form.inputsData]);
                this.form.hide();
                this.validNodeBtn.setAttribute("disabled",true);
                this.nodeIndex = this.allAlgo[this.currentAlgoIndex].length - 1;
                this.mouseDown = true;
            },{once: true});
            this.hideNodeMenuType();
        }))

        // Hide node type menu
        this.nodeMenuTypeCancelBtn.addEventListener("click", () => this.hideNodeMenuType());

        // handles interaction with the node menu
        this.allModelBtn.forEach(modelBtn => modelBtn.addEventListener("click", () => {
            switch (modelBtn.id) {
                case "modify":
                    this.form.addTextInput(this.allAlgo[this.currentAlgoIndex][this.nodeIndex].txt,
                        this.allAlgo[this.currentAlgoIndex][this.nodeIndex].type);
                    this.form.show(this.allAlgo[this.currentAlgoIndex][this.nodeIndex].type);

                    this.intervaleForm = setInterval(() => {
                        if (this.form.isValid()) {
                            this.validNodeBtn.removeAttribute("disabled");
                        } else {
                            this.validNodeBtn.setAttribute("disabled",true);
                        }
                    },100);

                    this.validNodeBtn.addEventListener("click", () => {
                        clearInterval(this.intervaleForm);
                        this.allAlgo[this.currentAlgoIndex][this.nodeIndex].majTxt(this.form.inputsData);
                        this.form.hide();
                        this.validNodeBtn.setAttribute("disabled",true);
                        this.changeHasBeenMade = true;
                    },{once: true});
                    break;
                case "link":
                    this.links.addLink(this.allAlgo[this.currentAlgoIndex], 
                                    this.nodeIndex, 
                                    this.clickAreaClicked);
                    break;
                case "unlink":
                    this.links.removeLink(this.allAlgo[this.currentAlgoIndex],
                                    this.nodeIndex, 
                                    this.clickAreaClicked);
                    break;
                case "breakdown":
                    this.tabNames[this.currentAlgoIndex][1] ++;
                
                    this.changeTabStyle(
                        this.currentAlgoIndex, 
                        "tab-inactive"
                    );
                    this.addTabElm(`${this.tabNames[this.currentAlgoIndex][0]}.${this.tabNames[this.currentAlgoIndex][1]}`);
                    this.tabNames.push(
                        [`${this.tabNames[this.currentAlgoIndex][0]}.${this.tabNames[this.currentAlgoIndex][1]}`,0]
                    );
                    this.allAlgo.push([new Issue(
                        this.canvas,
                        (this.canvas.width/2)|0,
                        (this.allAlgo[this.currentAlgoIndex][this.nodeIndex].height*1.5)|0,
                        [
                            this.allAlgo[this.currentAlgoIndex][this.nodeIndex].txt[0].join(' '),
                            this.allAlgo[this.currentAlgoIndex][this.nodeIndex].txt[1].join('\n'),
                            this.allAlgo[this.currentAlgoIndex][this.nodeIndex].txt[2].join(' ')
                        ]
                    )]);

                    let txt = this.allAlgo[this.currentAlgoIndex][this.nodeIndex].txt[1].join('\n');
                    
                    this.allAlgo[this.currentAlgoIndex][this.nodeIndex].majTxt(
                        [
                            this.allAlgo[this.currentAlgoIndex][this.nodeIndex].txt[0].join(' '),
                            txt += `\n( voir ${`${this.tabNames[this.currentAlgoIndex][0]}.${this.tabNames[this.currentAlgoIndex][1]}`} )`,
                            this.allAlgo[this.currentAlgoIndex][this.nodeIndex].txt[2].join(' ')
                        ]
                    );
                
                    this.currentAlgoIndex = this.allAlgo.length -1;
                    this.changeHasBeenMade = true;

                    if (this.allAlgo.length === 10 
                        && !document.getElementById("new-file").hasAttribute("disabled")) {
                            document.getElementById("new-file").setAttribute("disabled",true);
                    }
                    break;
                default:
                    this.deleteNode();
                    break;
            }
            this.changeHasBeenMade = true;
            this.hideNodeMenu();
        }))

        // Draw current algo
        this.intervale = setInterval(() => {
            if (this.changeHasBeenMade) {
                this.drawAlgo();
                if (!this.changeInProgress) {
                    // A MODIFIER ====================================
                    let data = [];
                    for (let i = 0; i < this.allAlgo.length; i++) {
                        let tab = {
                            tabName: this.tabNames[i][0],
                            algo: []
                        }
                        this.allAlgo[i].forEach(node => tab.algo.push(node.toString()));
                        data.push(tab);
                    }
                    this.dataStorage.save(data);
                    // ==================================================
                }
                this.changeHasBeenMade = false;
            }
        }, 100);
    }
}

const app = new App();
app.main();