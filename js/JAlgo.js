/*
0000000001 Author RomLabo 111111111
1000111000 Class JAlgo 111111111111
1000000001 Created on 28/12/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JAlgo
 * @description represents an algorithm 
 * containing nodes.
 */
class JAlgo {
    // Private properties
    #nodes; #canvas;
    #title; #nodesId;
    #links; 

    /**
     * Create an empty algorithm.
     * @param {HTMLCanvasElement} canvas 
     * @param {String} title 
     */
    constructor(canvas, title = "") {
        this.#nodes = new Map();
        this.#canvas = canvas;
        this.#title = title;
        this.#nodesId = 0;
        this.#links = new JLink(canvas);

        this._currentId;
        this._clickArea = -1;
        this._lastId = -1;
        this._lastArea = -1;
    }

    get nodes() { return this.#nodes }
    set nodes(val) { this.#nodes = new Map(val)}

    get currentNode() { return this.#nodes.get(this._currentId) }
    
    get currentIdx() { return this._currentId }
    set currentIdx(val) { this._currentId = val }

    get currentArea() { return this._clickArea }
    set currentArea(val) { this._clickArea = val }

    get lastIdLinked() { return this._lastId }
    get lastAreaLinked() { return this._lastArea }

    get canvas() { return this.#canvas }
    set canvas(val) { this.#canvas = val }

    get title() { return this.#title }
    set title(val) { this.#title = val }

    get nodesId() { return this.#nodesId }
    set nodesId(val) { this.#nodesId = val }

    get links() { return this.#links }

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
    createNode(type, params, id = null) {
        if (id != null && id != -1) {
            this.nodesId = id;
        }
    
        switch (type) {
            case TYPE.ISSUE:
                this.nodes.set(
                    this.nodesId,
                    new Issue(...params)
                );
                break;
            case TYPE.ASSIGNMENT:
                this.nodes.set(
                    this.nodesId,
                    new Assignment(...params)
                );
                break;
            case TYPE.SWITCH:
                this.nodes.set(
                    this.nodesId,
                    new Switch(...params)
                );
                break;
            case TYPE.LOOP:
                this.nodes.set(
                    this.nodesId,
                    new Loop(...params)
                );
                break;
            case TYPE.CONDITION:
                this.nodes.set(
                    this.nodesId,
                    new Condition(...params)
                );
                break;
            default:
                this.nodes.set(
                    this.nodesId,
                    new Break(...params)
                );
                break;
        }

        this._currentId = this.nodesId;
        this.nodesId ++;
    }

    /**
     * @description Updates the positions of all nodes 
     * in the algorithm after resizing the canvas.
     * @param {Number} width 
     * @param {Number} height 
     */
    resize(width, height) {
        for (const node of this.nodes.values()) {
            node.majPos(
                Math.round((((node.x*100)/width)*this.canvas.width)/100),
                Math.round((((node.y*100)/height)*this.canvas.height)/100)
            );
            node.majCoord();
        }
    }

    /**
     * @description Delete all nodes.
     */
    delete() {
        this.#nodesId = 0;
        this.#nodes.clear();
    }

    /**
     * @description Deletes the node and any 
     * links pointing to it.
     */
    deleteNode() {
        this._lastId = -1;
        this._lastArea = -1;
        for (const [key,node] of this.nodes) {
            for (let z = 0; z < node.output.length; z++) {
                for (let j = 0; j < node.output[z].length; j++) {
                    if (node.output[z][j] == this._currentId) {
                        node.output[z].splice(j,1);
                        this._lastId = key;
                        this._lastArea = z;
                    } 
                }   
            }
        }

        if (this._lastId === -1) {
            this._lastId = this._currentId;
            this._lastArea = this._currentId;
        }

        this.nodes.delete(this._currentId);
    }

    /**
     * @description Updates the x and y coordinates 
     * of the current node.
     * @param {Number} x // the new x coordinate 
     * @param {Number} y // the new y coordinate
     */
    moveNode(x,y) {
        this.nodes.get(this._currentId).majPos((x)|0,(y)|0);
        this.nodes.get(this._currentId).majCoord();
    }

    /**
     * @description Modifies the text of 
     * the current node.
     * @param {Array} txt 
     */
    modifyNode(txt) {
        this.nodes.get(this._currentId).majTxt(txt);
    }

    /**
     * @description Links the previously selected node 
     * with the current node.
     * @returns {Boolean} True if operation successful, 
     * otherwise false.
     */
    linkNode() {
        return this.links.addLink(
            this.nodes, 
            this._currentId, 
            this._clickArea
        );
    }

    /**
     * @description Unlinks the previously selected node 
     * with the current node.
     * @returns {Boolean} True if operation successful, 
     * otherwise false.
     */
    unlinkNode() {
        return this.links.removeLink(
            this.nodes,
            this._currentId, 
            this._clickArea
        );
    }

    /**
     * @description Determines whether a node 
     * in the algorithm has been clicked.
     * @param {Event} e // click event
     * @returns {Boolean} True if node has been clicked, 
     * false otherwise.
     */
    nodeIsClicked(e) {
        let isClicked = false;
        let res = -1;
        this._clickArea = -1;
        for (const [key,node] of this.nodes) {
            res = node.isClicked(e);
            if (res !== -1) {
                this._currentId = key;
                this._clickArea = res;
                isClicked = true;
            }
        }
        return isClicked;
    }

    /**
     * @description Draw all the nodes 
     * of the algorithm on the canvas.
     */
    draw() {
        for (const node of this.nodes.values()) {
            node.draw();
            this.links.draw(this.nodes,node);
        }
    }
}