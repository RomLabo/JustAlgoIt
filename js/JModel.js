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
    }

    get currentAlgo() { return this.allAlgo[this.idx] }
    get nbAlgoLimitReached() { return this.allAlgo.length === 10 }
    get currentAlgoIdx() { return this.idx }

    // get currentHistory() { return this.history[this.idx] }
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
        // this.history.splice(this.idx, 1);
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
        // this.history.push(new JHistory());
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
}