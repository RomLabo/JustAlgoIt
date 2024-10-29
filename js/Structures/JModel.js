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
     * Private properties
     */
    #mainCanvasColors; #dataCanvasColors;
    #canvas; #context; #dataCanvas; #tempImg;
    #dataCtx; #allAlgo; #history; #idx;
    #changeHasBeenMade; #opInProgress;
    #intervalFile; #interval; #dataImg;

    /**
     * Create a Model.
     */
    constructor() {
        this.#canvas = document.getElementById('main-canvas');
        this.#context = this.#canvas.getContext('2d');

        this.#dataCanvas = document.getElementById("data-canvas");
        this.#dataCtx = this.#dataCanvas.getContext("2d");
        this.#dataCanvas.width = 1411;
        this.#dataCanvas.height = 711;

        this.#allAlgo = [new JAlgo(this.#canvas, "algo_1")];
        this.#history = [new JHistory()];

        this.#changeHasBeenMade = false;
        this.#opInProgress = false;
        this.#intervalFile = null;
        this.#tempImg = new Image();
        this.#idx = 0;

        this.#mainCanvasColors = {
            primary: "#ffffff",
            secondary: "#161b22"
        }

        this.#dataCanvasColors = {
            primary: "#000000",
            secondary: "#ffffff"
        }

        this.#dataImg = {
            width: this.#dataCanvas.width,
            height: this.#dataCanvas.height
        }

        this.#interval = setInterval(() => {
            if (this.#changeHasBeenMade) {
                this.eraseCanvas(
                    this.#canvas, this.#context, this.#mainCanvasColors
                );
                this.currentAlgo.draw();
                this.#changeHasBeenMade = false;
            }
        }, 100);
    }

    get currentAlgo() { return this.#allAlgo[this.#idx] }
    get nbAlgoLimitReached() { return this.#allAlgo.length === 10 }
    get currentAlgoIdx() { return this.#idx }

    get currentHistory() { return this.#history[this.#idx] }
    get isForwardEmpty() { return this.currentHistory.isForwardEmpty }
    get isPreviousEmpty() { return this.currentHistory.isPreviousEmpty }

    get currentNode() { return this.currentAlgo.currentNode }
    get currentNodeHasLink() { return this.currentAlgo.currentNode.output[0].length !== 0 } 
    get historyOpInProgress() { return this.#opInProgress }

    /**
     * @description changes the colour used for 
     * drawing in the canvas.
     * @param {CanvasRenderingContext2D} context 
     * @param {String} color // hexa code of colour
     */
    changeColor(context, color) {
        context.fillStyle = color;
        context.strokeStyle = color;
    }

    /**
     * @description deletes the entire canvas.
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} context 
     * @param {Object} colors 
     */
    eraseCanvas(canvas, context, colors) {
        this.changeColor(context, colors.secondary);
        context.fillRect(
            0, 0, canvas.width, canvas.height
        );
        this.changeColor(context, colors.primary);
    }

    /**
     * @description Changes the current algorithm.
     * @param {Number} index 
     */
    changeCurrentAlgo(index) {
        this.#idx = index;
        this.#changeHasBeenMade = true;
    }

    /**
     * @description Delete the current algorithm.
     */
    deleteCurrentAlgo() {
        this.currentAlgo.delete();
        this.currentHistory.delete();
        this.#allAlgo.splice(this.#idx, 1);
        this.#history.splice(this.#idx, 1);
        this.#idx --;
        this.#changeHasBeenMade = true;
    }

    /**
     * @description Add a new algorithm.
     * @param {String} title 
     */
    addAlgo(title) {
        this.#allAlgo.push(new JAlgo(
            this.#canvas, title
        ));
        this.#history.push(new JHistory());
        this.#idx = this.#allAlgo.length - 1;
        this.#changeHasBeenMade = true;
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
                this.#canvas,
                (this.#canvas.width/2)|0,
                (this.#canvas.height/2)|0,
                txt
            ]
        );

        this.#changeHasBeenMade = true;
    }

    /**
     * @description Moves current node 
     * to "x" and "y" positions.
     * @param {Number} x 
     * @param {Number} y 
     */
    moveCurrentNode(x, y) {
        this.currentHistory.store(
            [this.currentAlgo.currentIdx],
            [this.currentNode]
        );
        this.currentAlgo.moveNode(x,y);
        this.#changeHasBeenMade = true;
    }

    /**
     * @description Modifies the text of 
     * the current node.
     * @param {Array} txt 
     */
    modifyCurrentNode(txt) {
        this.currentHistory.store(
            [this.currentAlgo.currentIdx],
            [this.currentNode]
        );
        this.currentAlgo.modifyNode(txt);
        this.#changeHasBeenMade = true;
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
        this.currentHistory.store(
            OP.DEL, this.currentAlgo.currentIdx,
            this.currentNode
        );
        this.currentAlgo.deleteNode();
        this.#changeHasBeenMade = true;
    }

    /**
     * @description Links the previously selected node 
     * with the current node.
     */
    linkCurrentNode() {
        if (this.currentAlgo.linkNode()) {
            this.#changeHasBeenMade = true;
        }
    }

    /**
     * @description Unlinks the previously selected node 
     * with the current node.
     */
    unlinkCurrentNode() {
        if (this.currentAlgo.unlinkNode()) {
            this.#changeHasBeenMade = true;
        }
    }

    /**
     * @description Resize all algorithms.
     * @param {Array<Number>} lastCnvSize 
     */
    resizeAllAlgo(lastCnvSize) {
        this.#allAlgo.forEach(
            algo => algo.resize(lastCnvSize[0],lastCnvSize[1])
        );
        this.#changeHasBeenMade = true;
    }

    /**
     * @description Retrieves information 
     * from the algorithm loaded by the user.
     * @param {Event} event 
     */
    loadAlgo(event) {
        this.currentAlgo.delete();
        this.currentHistory.delete();
        this.eraseCanvas(
            this.#dataCanvas, this.#dataCtx, this.#dataCanvasColors
        );

        try {
            this.#tempImg.src = JFileUtility.createUrl(
                event.target.files[0]
            );

            this.#tempImg.addEventListener("load", () => {
                let fileData = JFileUtility.extractData(
                    this.#dataCanvas, this.#dataCtx, this.#tempImg
                );

                let extractedData = JDataUtility.load(fileData);

                extractedData.nodes.forEach(node => {
                    this.currentAlgo.createNode(
                        node.t,
                        [ this.#canvas, Math.round((node.x/100)*this.#canvas.width),
                          Math.round((node.y/100)*this.#canvas.height), [...node.tx]],
                        node.i
                    );

                    this.currentAlgo.currentNode.output = node.o;
                });

                extractedData.history.forEach(elm => {
                    this.currentHistory.populate(
                        elm, this.#canvas.width, this.#canvas.height
                    );
                })

                this.#changeHasBeenMade = true;
            }, {once: true});
        } catch (error) { throw error; }
    }

    /**
     * @description Download user's algorithm 
     * in png image format.
     */
    downloadAlgo() {
        this.eraseCanvas(
            this.#dataCanvas, this.#dataCtx, this.#dataCanvasColors
        );
        
        try {
            let nodes = this.currentAlgo.copyNodes(this.#dataCanvas);
            this.currentAlgo.draw(this.#dataCtx, nodes);

            let imageData = this.#dataCtx.getImageData(0,0,
                                                      this.#dataCanvas.width,
                                                      this.#dataCanvas.height);

            this.#dataCtx.putImageData(JDataUtility.save(imageData,
                                                 this.#dataImg, nodes,
                                                 this.currentHistory.storage),
                                                 0, 0);

            document.getElementById("menu-save").href = this.#dataCanvas.toDataURL("image/png", 1);
            nodes.clear();
        } catch (error) { console.error(error); }
    }

    /**
     * @description Cancels current operation
     * in history.
     */
    abortOperation() {
        this.currentHistory.abort();
        this.#opInProgress = false;
    }

    /**
     * @description Starts a modification operation by
     * creating a new operation in the modification history.
     * @param {OP} operationType 
     */
    startOperation(operationType) {
        console.log({
            key: this.currentAlgo.currentIdx,
            ...this.currentNode.toLitteralObj()
        });
        
        if (!this.#opInProgress) {
            this.#opInProgress = true;
            this.currentHistory.create(
                operationType, this.currentAlgo.currentIdx, 
                this.currentNode, this.currentAlgo.currentArea
            );
        }
    }

    /**
     * @description Updates the modification history
     * with the completion of the current operation.
     */
    updateHistory() {
        if (this.#opInProgress) {
            this.currentHistory.update(
                this.currentNode, this.currentAlgo.lastIdLinked, 
                this.currentAlgo.lastAreaLinked, 
                this.currentAlgo.currentIdx, this.currentAlgo.currentArea
            );

            this.#opInProgress = false;
        }
    }

    /**
     * @description Go back in history.
     */
    previousOp() {
        let op = this.currentHistory.undo();
        if (op != undefined) {
            switch (op?.opType) {
                case OP.DEL:
                    this.currentAlgo.createNode(
                        op.nodeType,
                        [
                            this.#canvas,
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
                        this.#changeHasBeenMade = true;
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
    
            this.#changeHasBeenMade = true;
        }
    }

    /**
     * @description Advance in history.
     */
    forwardOp() {
        let op = this.currentHistory.redo();
        if (op != undefined) {
            switch (op?.opType) {
                case OP.DEL:
                    this.currentAlgo.currentIdx = op.nodeId;
                    this.deleteCurrentNode();
                    break;
                case OP.ADD:
                    this.currentAlgo.createNode(
                        op.nodeType,
                        [
                            this.#canvas,
                            op.nodeX,
                            op.nodeY,
                            op.nodeTxt
                        ],
                        op.nodeId
                    );
                    this.#changeHasBeenMade = true;
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
    
            this.#changeHasBeenMade = true;
        }
    }
}