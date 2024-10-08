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
     * Create a Model.
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
    }

    get currentAlgo() { return this.allAlgo[this.idx] }
    get nbAlgoLimitReached() { return this.allAlgo.length === 10 }
    get currentAlgoIdx() { return this.idx }

    get currentHistory() { return this.history[this.idx] }
    get isForwardEmpty() { return this.currentHistory.isForwardEmpty }
    get isPreviousEmpty() { return this.currentHistory.isPreviousEmpty }

    get currentNode() { return this.currentAlgo.currentNode }
    get currentNodeHasLink() { return this.currentAlgo.currentNode.output[0].length !== 0 } 
    get historyOpInProgress() { return this.opInProgress }

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
        this.currentHistory.delete();
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
        this.currentHistory.delete();
        this.eraseCanvas();
        this.file.load(event);

        this.intervaleFile = setInterval(() => {
            if (this.file.isFileLoaded()) {
                try {
                    let imgData = JDataUtility.load(this.file.data)
                    imgData.data.forEach(node => {
                        this.currentAlgo.createNode(
                            node.t,
                            [
                                this.canvas,
                                Math.round((node.x/100)*this.canvas.width),
                                Math.round((node.y/100)*this.canvas.height),
                                [...node.tx]
                            ],
                            node.i
                        );

                        this.currentAlgo.currentNode.output = node.o;
                    });

                    this.currentHistory.delete();
                    imgData.history.forEach(elm => {
                        this.currentHistory.populate(elm, this.canvas.width, this.canvas.height);
                    })

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
        try {
            let imageData = this.context.getImageData(0,0,
                                                      this.canvas.width,
                                                      this.canvas.height);
            let imageSize = { 
                width: this.canvas.width,
                height: this.canvas.height
            }

            this.context.putImageData(JDataUtility.save(imageData,
                                                 imageSize,
                                                 this.currentAlgo.nodes,
                                                 this.currentHistory.storage),
                                                 0, 0);

            document.getElementById("menu-save").href = this.canvas.toDataURL("image/png", 1);

            setTimeout(() => {
                this.eraseCanvas();
                this.changeHasBeenMade = true;
            }, 1000)
        } catch (error) { console.error(error); }
    }

    abortOperation() {
        this.currentHistory.abort();
        this.opInProgress = false;
    }

    /**
     * 
     * @param {*} operationType 
     */
    startOperation(operationType) {
        if (!this.opInProgress) {
            this.opInProgress = true;
            this.currentHistory.create(
                operationType, this.currentAlgo.currentIdx, 
                this.currentNode, this.currentArea
            );
        }
    }

    /**
     * 
     */
    updateHistory() {
        if (this.opInProgress) {
            this.currentHistory.update(
                this.currentNode, this.currentAlgo.lastIdLinked, 
                this.currentAlgo.lastAreaLinked, 
                this.currentAlgo.currentIdx, this.currentAlgo.currentArea
            );

            this.opInProgress = false;
        }
    }

    /**
     * @description Go back in history.
     */
    previousOp() {
        let op = this.currentHistory.undo();
        switch (op?.opType) {
            case OP.DEL:
                this.currentAlgo.createNode(
                    op.nodeType,
                    [
                        this.canvas,
                        op.nodeX,
                        op.nodeY,
                        op.nodeTxt
                    ],
                    op.nodeId
                );
                this.currentAlgo.currentNode.output = [];
                for (let i = 0; i < op.nodeOut.length; i++) {
                    this.currentAlgo.currentNode.output.push([])
                    for (let j = 0; j < op.nodeOut[i].length; j++) {
                        this.currentAlgo.currentNode.output[i].push(op.nodeOut[i][j]);
                    }   
                }

                if (op.nodeInId !== -1) {
                    this.currentAlgo.currentIdx = op.nodeId;
                    this.currentAlgo.currentArea = 0;
                    this.linkCurrentNode();
                    this.currentAlgo.currentIdx = op.nodeInId;
                    this.currentAlgo.currentArea = op.nodeInArea;
                    this.linkCurrentNode();
                } else {
                    this.changeHasBeenMade = true;
                }
                break;
            case OP.ADD:
                this.currentAlgo.currentIdx = op.nodeId;
                this.deleteCurrentNode();
                break;
            case OP.MODIF:
                this.currentAlgo.currentIdx = op.nodeId;
                this.modifyCurrentNode(op.nodeOldTxt);
                break;
            case OP.MOVE:
                this.currentAlgo.currentIdx = op.nodeId;
                this.moveCurrentNode(op.nodeOldX,op.nodeOldY);
                break;
            case OP.LINK:
                this.currentAlgo.currentIdx = op.nodeId;
                this.currentAlgo.currentArea = op.nodeArea1;
                this.unlinkCurrentNode();
                this.currentAlgo.currentIdx = op.nodeLinkId;
                this.currentAlgo.currentArea = op.nodeArea2;
                this.unlinkCurrentNode();
                break;
            case OP.UNLINK:
                this.currentAlgo.currentIdx = op.nodeId;
                this.currentAlgo.currentArea = op.nodeArea1;
                this.linkCurrentNode();
                this.currentAlgo.currentIdx = op.nodeLinkId;
                this.currentAlgo.currentArea = op.nodeArea2;
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
        switch (op?.opType) {
            case OP.DEL:
                this.currentAlgo.currentIdx = op.nodeId;
                this.deleteCurrentNode();
                break;
            case OP.ADD:
                this.currentAlgo.createNode(
                    op.nodeType,
                    [
                        this.canvas,
                        op.nodeX,
                        op.nodeY,
                        op.nodeTxt
                    ],
                    op.nodeId
                );
                this.changeHasBeenMade = true;
                break;
            case OP.MODIF:
                this.currentAlgo.currentIdx = op.nodeId;
                this.modifyCurrentNode(op.nodeNewTxt);
                break;
            case OP.MOVE:
                this.currentAlgo.currentIdx = op.nodeId;
                this.moveCurrentNode(op.nodeNewX,op.nodeNewY);
                break;
            case OP.LINK:
                this.currentAlgo.currentIdx = op.nodeId;
                this.currentAlgo.currentArea = op.nodeArea1;
                this.linkCurrentNode();
                this.currentAlgo.currentIdx = op.nodeLinkId;
                this.currentAlgo.currentArea = op.nodeArea2;
                this.linkCurrentNode();
                break;
            case OP.UNLINK:
                this.currentAlgo.currentIdx = op.nodeId;
                this.currentAlgo.currentArea = op.nodeArea1;
                this.unlinkCurrentNode();
                this.currentAlgo.currentIdx = op.nodeLinkId;
                this.currentAlgo.currentArea = op.nodeArea2;
                this.unlinkCurrentNode();
                break;
            default: break;
        }

        this.changeHasBeenMade = true;
    }
}