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
 * @description Manages data with 
 * the application's business actions.
 */
class JModel {
    /**
     * Create a JModel.
     */
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
    get nbAlgoLimitReached() { return this.allAlgo.length === 10 }
    get currentAlgoIdx() { return this.idx }

    get currentHistory() { return this.history[this.idx] }
    get isForwardEmpty() { return this.currentHistory.isForwardEmpty }
    get isPreviousEmpty() { return this.currentHistory.isPreviousEmpty }

    get currentNodeType() { return this.currentAlgo.currentNode.type }
    get currentNodeTxt() { return this.currentAlgo.currentNode.txt }
    get currentNodeOut() { return this.currentAlgo.currentNode.output }
    get currentNodeX() { return this.currentAlgo.currentNode.x }
    get currentNodeY() { return this.currentAlgo.currentNode.y }
    get currentNodeHasLink() { return this.currentAlgo.currentNode.output[0].length !== 0} 

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
     * @description Changes the current algorithm.
     * @param {Number} index 
     */
    changeCurrentAlgo(index) {
        this.idx = index;
        this.changeHasBeenMade = true;
    }

    /**
     * @description Delete the current algorithm.
     */
    deleteCurrentAlgo() {
        this.currentAlgo.delete();
        this.allAlgo.splice(this.idx, 1);
        this.history.splice(this.idx, 1);
        this.idx --;
        this.changeHasBeenMade = true;
    }

    /**
     * @description Add a new algorithm.
     * @param {String} title 
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
     * @description Adds a node of type "type" 
     * with text "text" to the current algorithm.
     * @param {Number} type 
     * @param {Array} txt 
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
     * @description Moves current node 
     * to "x" and "y" positions.
     * @param {Number} x 
     * @param {Number} y 
     */
    moveCurrentNode(x, y) {
        this.currentAlgo.moveNode(x,y);
        this.changeHasBeenMade = true;
    }

    /**
     * @description Modifies the text of 
     * the current node.
     * @param {Array} txt 
     */
    modifyCurrentNode(txt) {
        this.currentAlgo.modifyNode(txt);
        this.changeHasBeenMade = true;
    }

    /**
     * @description Determines whether a node 
     * in the algorithm has been clicked.
     * @param {Event} val // click event
     * @returns {Boolean} True if node has been clicked, 
     * false otherwise.
     */
    nodeIsClicked(val) {
        return this.currentAlgo.nodeIsClicked(val);
    }

    /**
     * @description Delete the current node.
     */
    deleteCurrentNode() {
        this.currentAlgo.deleteNode();
        this.changeHasBeenMade = true;
    }

    /**
     * @description Links the previously selected node 
     * with the current node.
     */
    linkCurrentNode() {
        if (this.currentAlgo.linkNode()) {
            this.changeHasBeenMade = true;
        }
    }

    /**
     * @description Unlinks the previously selected node 
     * with the current node.
     */
    unlinkCurrentNode() {
        if (this.currentAlgo.unlinkNode()) {
            this.changeHasBeenMade = true;
        }
    }

    /**
     * @description Resize all algorithms.
     * @param {Array<Number>} lastCnvSize 
     */
    resizeAllAlgo(lastCnvSize) {
        this.allAlgo.forEach(
            algo => algo.resize(lastCnvSize[0],lastCnvSize[1])
        );
        this.changeHasBeenMade = true;
    }

    /**
     * @description Retrieves information 
     * from the algorithm loaded by the user.
     * @param {Event} event 
     */
    loadAlgo(event) {
        this.currentAlgo.delete();
        this.currentHistory.clear();
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
     * @description Download user's algorithm 
     * in png image format.
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

    /**
     * 
     * @param {*} operationType 
     */
    startOperation(operationType) {
        if (!this.opInProgress) {
            this.opInProgress = true;

            this.currentOp = {
                type: operationType,
                idx: this.currentAlgo.currentIdx
            }
    
            switch (operationType) {
                case OP.DEL: 
                    this.currentOp.data = {
                        txt: this.currentNodeTxt,
                        type: this.currentNodeType,
                        x: this.currentNodeX,
                        y: this.currentNodeY,
                        out: this.currentNodeOut,
                        inIdx: -1,
                        inArea: -1
                    }
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
                    this.currentOp.data = {
                        idx: -1,
                        area1: this.currentAlgo.currentArea,
                        area2: -1 
                    }
                    break;
                case OP.UNLINK:
                    this.currentOp.data = {
                        idx: -1,
                        area1: this.currentAlgo.currentArea,
                        area2: -1 
                    }
                    break;
                default: break;
            }
        }
    }

    /**
     * 
     */
    updateHistory() {
        this.abortOp = false;
        switch (this.currentOp.type) {
            case OP.DEL:
                this.currentOp.data.inIdx = this.currentAlgo.lastIdLinked;
                this.currentOp.data.inArea = this.currentAlgo.lastAreaLinked;
                break;
            case OP.ADD:
                this.currentOp.data.x = this.currentNodeX;
                this.currentOp.data.y = this.currentNodeY;
                break;
            case OP.MODIF:
                this.currentOp.data.new = this.currentNodeTxt;
                break;
            case OP.MOVE:
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
                this.currentOp.data.idx = this.currentAlgo.currentIdx;
                this.currentOp.data.area2 = this.currentAlgo.currentArea;
                break;
            case OP.UNLINK:
                this.currentOp.data.idx = this.currentAlgo.currentIdx;
                this.currentOp.data.area2 = this.currentAlgo.currentArea;
                break;
            default: break;
        }

        if (!this.abortOp) {
            this.currentHistory.update(this.currentOp);
        }
        this.opInProgress = false;
        // console.log(this.currentHistory);
    }

    /**
     * @description Go back in history.
     */
    previousOp() {
        let op = this.currentHistory.undo();
        switch (op.type) {
            case OP.DEL:
                this.currentAlgo.createNode(
                    op.data.type,
                    [
                        this.canvas,
                        op.data.x,
                        op.data.y,
                        op.data.txt
                    ],
                    op.idx
                );
                this.currentAlgo.currentNode.output = [];
                for (let i = 0; i < op.data.out.length; i++) {
                    this.currentAlgo.currentNode.output.push([])
                    for (let j = 0; j < op.data.out[i].length; j++) {
                        this.currentAlgo.currentNode.output[i].push(op.data.out[i][j]);
                    }   
                }

                if (op.data.inIdx !== -1) {
                    this.currentAlgo.currentIdx = op.idx;
                    this.currentAlgo.currentArea = 0;
                    this.linkCurrentNode();
                    this.currentAlgo.currentIdx = op.data.inIdx;
                    this.currentAlgo.currentArea = op.data.inArea;
                    this.linkCurrentNode();
                } else {
                    this.changeHasBeenMade = true;
                }
                break;
            case OP.ADD:
                this.currentAlgo.currentIdx = op.idx;
                this.deleteCurrentNode();
                break;
            case OP.MODIF:
                this.currentAlgo.currentIdx = op.idx;
                this.modifyCurrentNode(op.data.old);
                break;
            case OP.MOVE:
                this.currentAlgo.currentIdx = op.idx;
                this.moveCurrentNode(op.data.old[0],op.data.old[1]);
                break;
            case OP.LINK:
                this.currentAlgo.currentIdx = op.idx;
                this.currentAlgo.currentArea = op.data.area1;
                this.unlinkCurrentNode();
                this.currentAlgo.currentIdx = op.data.idx;
                this.currentAlgo.currentArea = op.data.area2;
                this.unlinkCurrentNode();
                break;
            case OP.UNLINK:
                this.currentAlgo.currentIdx = op.idx;
                this.currentAlgo.currentArea = op.data.area1;
                this.linkCurrentNode();
                this.currentAlgo.currentIdx = op.data.idx;
                this.currentAlgo.currentArea = op.data.area2;
                this.linkCurrentNode();
                break;
            default: break;
        }

        this.changeHasBeenMade = true;
    }

    /**
     * @description Advance in history.
     */
    forwardOp() {
        let op = this.currentHistory.redo();
        switch (op.type) {
            case OP.DEL:
                this.currentAlgo.currentIdx = op.idx;
                this.deleteCurrentNode();
                break;
            case OP.ADD:
                this.currentAlgo.createNode(
                    op.data.type,
                    [
                        this.canvas,
                        op.data.x,
                        op.data.y,
                        op.data.txt
                    ],
                    op.idx
                );
                this.changeHasBeenMade = true;
                break;
            case OP.MODIF:
                this.currentAlgo.currentIdx = op.idx;
                this.modifyCurrentNode(op.data.new);
                break;
            case OP.MOVE:
                this.currentAlgo.currentIdx = op.idx;
                this.moveCurrentNode(op.data.new[0],op.data.new[1]);
                break;
            case OP.LINK:
                this.currentAlgo.currentIdx = op.idx;
                this.currentAlgo.currentArea = op.data.area1;
                this.linkCurrentNode();
                this.currentAlgo.currentIdx = op.data.idx;
                this.currentAlgo.currentArea = op.data.area2;
                this.linkCurrentNode();
                break;
            case OP.UNLINK:
                this.currentAlgo.currentIdx = op.idx;
                this.currentAlgo.currentArea = op.data.area1;
                this.unlinkCurrentNode();
                this.currentAlgo.currentIdx = op.data.idx;
                this.currentAlgo.currentArea = op.data.area2;
                this.unlinkCurrentNode();
                break;
            default: break;
        }

        this.changeHasBeenMade = true;
    }

    /**
     * To simulate navigation with shortcut on
     * all nodes
     * @param {*} index 
     */
    changeCurrentNode(index) {
        this.currentAlgo.changeCurrentId(
            Math.abs(index%this.currentAlgo.nbNodes)
        );
    } 
}