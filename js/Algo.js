/*
0000000001 Author RomLabo 111111111
1000111000 Class Node 1111111111111
1000000001 Created on 28/12/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class Algo
 * @description ...
 */
class Algo {
    // Private properties
    #nodes; #canvas;
    #title; #nodesId;
    #links; 

    constructor(canvas, title = "") {
        this.#nodes = new Map();
        this.#canvas = canvas;
        this.#title = title;
        this.#nodesId = 0;
        this.#links = new Link(canvas);

        this._currentId;
        this._clickArea = -1;
        //this._history = new History();
    }

    get nodes() { return this.#nodes }
    set nodes(val) { this.#nodes = new Map(val)}

    get canvas() { return this.#canvas }
    set canvas(val) { this.#canvas = val }

    get title() { return this.#title }
    set title(val) { this.#title = val }

    get nodesId() { return this.#nodesId }
    set nodesId(val) { this.#nodesId = val }

    get links() { return this.#links }

    get linkInProgress() { return this.#links.addInProress }

    get unlinkInProgress() { return this.#links.removeInProgress }

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
        if (id != null) {
            this.nodesId = id;
        }
        switch (type) {
            case 208:
                this.nodes.set(
                    this.nodesId,
                    new Issue(...params)
                );
                break;
            case 207:
                this.nodes.set(
                    this.nodesId,
                    new Assignment(...params)
                );
                break;
            case 206:
                this.nodes.set(
                    this.nodesId,
                    new Switch(...params)
                );
                break;
            case 205:
                this.nodes.set(
                    this.nodesId,
                    new Loop(...params)
                );
                break;
            case 204:
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
     * @description deletes the node and any 
     * links pointing to it.
     */
    deleteNode() {
        for (const node of this.nodes.values()) {
            for (let z = 0; z < node.output.length; z++) {
                for (let j = 0; j < node.output[z].length; j++) {
                    if (node.output[z][j] == this._currentId) {
                        node.output[z].splice(j,1);
                    } 
                }   
            }
        }

        this.nodes.delete(this._currentId);
    }

    /**
     * @description updates the x and y coordinates 
     * of the current node.
     * @param {Number} x // the new x coordinate 
     * @param {Number} y // the new y coordinate
     */
    moveNode(x,y) {
        this.nodes.get(this._currentId).majPos((x)|0,(y)|0);
        this.nodes.get(this._currentId).majCoord();
    }

    modifyNode(txt) {
        this.nodes.get(this._currentId).majTxt(txt);
    }

    linkNode() {
        this.links.addLink(
            this.nodes, 
            this._currentId, 
            this._clickArea
        );
    }

    unlinkNode() {
        this.links.removeLink(
            this.nodes,
            this._currentId, 
            this._clickArea
        );
    }

    nodeIsClicked(e) {
        let clickedNode = null;
        let res = -1;
        this._clickArea = -1;
        for (const [key,node] of this.nodes) {
            res = node.isClicked(e);
            if (res !== -1) {
                this._currentId = key;
                this._clickArea = res;
                clickedNode = node;
            }
        }
        return clickedNode;
    }

    draw() {
        for (const node of this.nodes.values()) {
            node.draw();
            this.links.draw(this.nodes,node);
        }
    }
}