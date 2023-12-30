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
        this.idx = 0;
        this.changeHasBeenMade = false;
        this.nodeIndex;

        this.intervale = setInterval(() => {
            if (this.changeHasBeenMade) {
                this.eraseCanvas();
                this.currentAlgo.draw();
                this.changeHasBeenMade = false;
            }
        }, 100);
    }

    get currentAlgo() { return this.allAlgo[this.idx] }

    get currentAlgoIdx() { return this.idx }

    get currentNodeType() { return this.currentAlgo.currentNode.type }

    get currentNodeTxt() { return this.currentAlgo.currentNode.txt }

    get currentNodeHasLink() { return this.currentAlgo.currentNode.output[0].length !== 0}

    get nbAlgoLimiReached() { return this.allAlgo.length === 10 } 

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
        this.allAlgo.splice(this.idx, 1);
        this.idx --;
        this.changeHasBeenMade = true;
    }

    /**
     * 
     * @param {*} title 
     */
    addAlgo(title) {
        this.allAlgo.push(new JAlgo(
            this.canvas, title
        ));
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
            [this.canvas,0,0,txt]
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
}