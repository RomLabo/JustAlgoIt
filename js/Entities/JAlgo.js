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
    /**
     * Private properties
     */
    #nodes; #canvas; #title; 
    #nodesId; #links; #context;
    #currentId; #clickArea;
    #lastId; #lastArea; 
    #previewId; #previewArea;

    /**
     * Create an empty algorithm.
     * @param {HTMLCanvasElement} canvas 
     * @param {String} title 
     */
    constructor(canvas, title = "") {
        this.#nodes = new Map();
        this.#canvas = canvas;
        this.#context = canvas.getContext('2d');
        this.#title = title;
        this.#nodesId = 0;
        this.#links = new JLink();

        this.#currentId;
        this.#clickArea = -1;
        this.#lastId = -1;
        this.#lastArea = -1;

        this.#previewId = -1;
        this.#previewArea = -1;
    }

    get nodes() { return this.#nodes }
    set nodes(val) { this.#nodes = new Map(val)}

    get currentNode() { return this.#nodes.get(this.#currentId) }
    get previewNode() { 
        if (this.#previewId > -1 && this.#previewId != this.#currentId) {
            return this.#nodes.get(this.#previewId)
        } 
    }    
    
    get currentIdx() { return this.#currentId }
    set currentIdx(val) { this.#currentId = val }

    get previewIdx() { return this.#previewId }

    get currentArea() { return this.#clickArea }
    set currentArea(val) { this.#clickArea = val }

    get lastIdLinked() { return this.#lastId }
    get lastAreaLinked() { return this.#lastArea }

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

        this.#currentId = this.nodesId;
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

    changeSize(width, height, cnvWidth, cnvHeight, nodes) {
        for (const node of nodes.values()) {
            node.majPos(
                Math.round((((node.x*100)/width)*cnvWidth)/100),
                Math.round((((node.y*100)/height)*cnvHeight)/100)
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
        this.#lastId = -1;
        this.#lastArea = -1;
        for (const [key,node] of this.nodes) {
            for (let z = 0; z < node.output.length; z++) {
                for (let j = 0; j < node.output[z].length; j++) {
                    if (node.output[z][j] == this.#currentId) {
                        node.output[z].splice(j,1);
                        this.#lastId = key;
                        this.#lastArea = z;
                    } 
                }   
            }
        }

        if (this.#lastId === -1) {
            this.#lastId = this.#currentId;
            this.#lastArea = this.#currentId;
        }
        
        this.nodes.delete(this.#currentId);
    }

    /**
     * @description Updates the x and y coordinates 
     * of the current node.
     * @param {Number} x // the new x coordinate 
     * @param {Number} y // the new y coordinate
     */
    moveNode(x,y) {
        this.nodes.get(this.#currentId).majPos((x)|0,(y)|0);
        this.nodes.get(this.#currentId).majCoord();
    }

    /**
     * @description Modifies the text of 
     * the current node.
     * @param {Array} txt 
     */
    modifyNode(txt) {
        this.nodes.get(this.#currentId).majTxt(txt);
    }

    /**
     * @description Links the previously selected node 
     * with the current node.
     * @returns {Boolean} True if operation successful, 
     * otherwise false.
     */
    linkNode() {
        return this.links.add(
            this.nodes, 
            this.#currentId, 
            this.#clickArea
        );
    }

    /**
     * @description Unlinks the previously selected node 
     * with the current node.
     * @returns {Boolean} True if operation successful, 
     * otherwise false.
     */
    unlinkNode() {
        return this.links.remove(
            this.nodes,
            this.#currentId, 
            this.#clickArea
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
        this.#clickArea = -1;
        for (const [key,node] of this.nodes) {
            res = node.isClicked(e);
            if (res !== -1) {
                this.#previewId = this.#currentId;
                this.#previewArea = this.#clickArea;
                this.#currentId = key;
                this.#clickArea = res;
                isClicked = true;
            }
        }
        return isClicked;
    }

    /**
     * @description Draw all the nodes 
     * of the algorithm on the canvas.
     */
    draw(context = this.#context, nodes = this.nodes) {
        for (const node of nodes.values()) {
            node.majTxt(node.txt);  
            switch (node.type) {
                case TYPE.ASSIGNMENT: JDrawUtility.assignment(context,node); break;
                case TYPE.BREAK: JDrawUtility.break(context,node); break;
                case TYPE.CONDITION: JDrawUtility.condition(context, node); break;
                case TYPE.ISSUE: JDrawUtility.issue(context,node); break;
                case TYPE.LOOP: JDrawUtility.loop(context,node); break;
                case TYPE.SWITCH: JDrawUtility.switch(context,node); break;
                default: break;
            }
            JDrawUtility.link(context, nodes, node);
        }
    }

    copyNodes(canvas) {
        let nodes = new Map();

        for (const [key,node] of this.nodes) {
            let params = [canvas, node.x, node.y, [...node.txt]];

            switch (node.type) {
                case TYPE.ISSUE:
                    nodes.set(key, new Issue(...params));
                    break;
                case TYPE.ASSIGNMENT:
                    nodes.set(key, new Assignment(...params));
                    break;
                case TYPE.SWITCH:
                    nodes.set(key, new Switch(...params));
                    break;
                case TYPE.LOOP:
                    nodes.set(key, new Loop(...params));
                    break;
                case TYPE.CONDITION:
                    nodes.set(key, new Condition(...params));
                    break;
                default:
                    nodes.set(key, new Break(...params));
                    break;
            }

            nodes.get(key).output = node.output;
        }

        this.changeSize(this.canvas.width, this.canvas.height,
                        canvas.width, canvas.height, nodes);

        return nodes;
    }
}