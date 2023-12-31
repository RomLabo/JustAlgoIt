/*
0000000001 Author RomLabo 111111111
1000111000 Class JModel 11111111111
1000000001 Created on 29/12/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JModel
 * @description ...
 */
class JModel {
    constructor() {
        this.canvas = document.getElementById('main-canvas');
        this.context = this.canvas.getContext('2d');
        this.allAlgo = [new JAlgo(this.canvas, "algo_1")];
        this.history = [new JHistory()];
        this.idx = 0;
        this.changeHasBeenMade = false;
        this.nodeIndex;
        this.intervaleFile;
        this.deltaData = [];
        this.deltaKey;
        this.imData;
        this.key;

        this.currentOp;
        this.abortOp = false;
        this.opInProgress = false;

        this.intervale = setInterval(() => {
            if (this.changeHasBeenMade) {
                this.eraseCanvas();
                this.currentAlgo.draw();
                this.changeHasBeenMade = false;
            }
        }, 100);

        this.file = new JFile("save-canvas");
        this.data = new JData();
    }

    get currentAlgo() { return this.allAlgo[this.idx] }

    get currentHistory() { return this.history[this.idx] }

    get currentAlgoIdx() { return this.idx }

    get currentNodeType() { return this.currentAlgo.currentNode.type }

    get currentNodeTxt() { return this.currentAlgo.currentNode.txt }

    get currentNodeX() { return this.currentAlgo.currentNode.x }
    get currentNodeY() { return this.currentAlgo.currentNode.y }

    get currentNodeHasLink() { return this.currentAlgo.currentNode.output[0].length !== 0}

    get nbAlgoLimitReached() { return this.allAlgo.length === 10 } 

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
     * 
     * @param {*} index 
     */
    changeCurrentAlgo(index) {
        this.idx = index;
        this.changeHasBeenMade = true;
    }

    /**
     * 
     */
    deleteCurrentAlgo() {
        this.currentAlgo.delete();
        this.allAlgo.splice(this.idx, 1);
        this.history.splice(this.idx, 1);
        this.idx --;
        this.changeHasBeenMade = true;
    }

    loadAlgo(event) {
        this.currentAlgo.delete();
        this.eraseCanvas();
        this.file.load(event);

        this.intervaleFile = setInterval(() => {
            if (this.file.isFileLoaded()) {
                try {
                    this.deltaKey = this.data.load(this.deltaData,this.file.data,localStorage)
                    this.key = this.deltaKey[0];
                    this.imData = this.deltaKey[1];

                    this.deltaKey[2].forEach(node => {
                        this.currentAlgo.createNode(
                            node.type,
                            [
                                this.canvas,
                                node.x,
                                node.y,
                                [...node.txt]
                            ],
                            node.key
                        );

                        this.currentAlgo.currentNode.output = node.output;
                    });
                    
                    this.changeHasBeenMade = true;
                } catch (error) {
                    clearInterval(this.intervaleFile);
                    throw error;
                }

                clearInterval(this.intervaleFile);
            }
        },100)
    }

    /**
     * 
     * @param {*} title 
     */
    addAlgo(title) {
        this.allAlgo.push(new JAlgo(
            this.canvas, title
        ));
        this.history.push(new JHistory());
        this.idx = this.allAlgo.length - 1;
        this.changeHasBeenMade = true;
    }

    /**
     * @description ...
     * @param {*} type 
     * @param {*} txt 
     */
    addNode(type, txt) {
        this.currentAlgo.createNode(
            type,
            [
                this.canvas,
                (this.canvas.width/2)|0,
                (this.canvas.height/2)|0,
                txt
            ]
        );
        this.changeHasBeenMade = true;
    }

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     */
    moveCurrentNode(x, y) {
        this.currentAlgo.moveNode(x,y);
        this.changeHasBeenMade = true;
    }

    /**
     * 
     * @param {*} txt 
     */
    modifyCurrentNode(txt) {
        this.currentAlgo.modifyNode(txt);
        this.changeHasBeenMade = true;
    }

    /**
     * 
     * @param {*} val 
     * @returns 
     */
    nodeIsClicked(val) {
        return this.currentAlgo.nodeIsClicked(val);
    }

    /**
     * 
     */
    deleteCurrentNode() {
        this.currentAlgo.deleteNode();
        this.changeHasBeenMade = true;
    }

    /**
     * 
     */
    linkCurrentNode() {
        if (this.currentAlgo.linkNode()) {
            this.changeHasBeenMade = true;
        }
    }

    /**
     * 
     */
    unlinkCurrentNode() {
        if (this.currentAlgo.unlinkNode()) {
            this.changeHasBeenMade = true;
        }
    }

    /**
     * 
     * @param {Array<Number>} lastCnvSize 
     */
    resizeAllAlgo(lastCnvSize) {
        this.allAlgo.forEach(
            algo => algo.resize(lastCnvSize[0],lastCnvSize[1])
        );
        this.changeHasBeenMade = true;
    }

    /**
     * 
     */
    downloadAlgo() {
        this.deltaData = [];         
        try {
            this.deltaKey = this.data.save(
                this.currentAlgo.nodes,
                localStorage, 
                JColor.invert(
                    this.context.getImageData(
                        0,0,this.canvas.width,this.canvas.height
                    )
                ),
                this.deltaData
            );

            this.context.putImageData(
                this.deltaKey[1]
                ,0, 0
            );

            this.key=this.deltaKey[2];
            document.getElementById("save").href = this.canvas.toDataURL();

            setTimeout(() => {
                this.eraseCanvas();
                this.changeHasBeenMade = true;
            }, 1000)
        } catch (error) {
            console.error(error);
        }
    }

    startOperation(operationType) {
        if (!this.opInProgress) {
            this.opInProgress = true;

            this.currentOp = {
                type: operationType,
                idx: this.currentAlgo.currentIdx
            }
    
            switch (operationType) {
                case OP.DEL: 
    
                    break;
                case OP.ADD:
                    this.currentOp.data = {
                        txt: this.currentNodeTxt,
                        type: this.currentNodeType,
                        x: 0,
                        y: 0
                    }
                    break;
                case OP.MODIF:
                    this.currentOp.data = {
                        old: this.currentNodeTxt,
                        new: []
                    }
                    break;
                case OP.MOVE:
                    this.currentOp.data = {
                        old: [
                            this.currentNodeX,
                            this.currentNodeY
                        ],
                        new: []
                    }
                    break;
                case OP.LINK:
    
                    break;
                case OP.UNLINK:
    
                    break;
                default: break;
            }
        }
    }

    updateHistory() {
        this.abortOp = false;
        switch (this.currentOp.type) {
            case OP.DEL: 

                break;
            case OP.ADD:
                console.log("ADD");
                this.currentOp.data.x = this.currentNodeX;
                this.currentOp.data.y = this.currentNodeY;
                break;
            case OP.MODIF:
                console.log("MODIF");
                this.currentOp.data.new = this.currentNodeTxt;
                break;
            case OP.MOVE:
                console.log("MOVE");
                if (this.currentOp.data.old[0] === this.currentNodeX 
                    && this.currentOp.data.old[1] === this.currentNodeY) {
                    this.abortOp = true;
                } else {
                    this.currentOp.data.new = [
                        this.currentNodeX,
                        this.currentNodeY
                    ];
                }
                break;
            case OP.LINK:
                console.log("LINK");
                break;
            case OP.UNLINK:
                console.log("UNLINK");
                break;
            default: break;
        }

        if (!this.abortOp) {
            this.currentHistory.update(this.currentOp);
        }
        this.opInProgress = false;
        console.log(this.currentHistory);
    }
}