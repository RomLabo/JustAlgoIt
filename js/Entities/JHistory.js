/*
0000000001 Author RomLabo 111111111
1000111000 Class JHistory 111111111
1000000001 Created on 07/02/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JHistory
 * @description Stores the history 
 * of changes made on the canvas.
 */
class JHistory {
    /**
     * Private properties
     */
    #previous; #forward;
    #currentId; #currentOp;
    #storage; #id;
    
    /**
     * Create a JHistory.
     */
    constructor() {
        this.#previous = [];
        this.#forward = [];
        this.#storage = new Map();
        this.#currentId = 0;
        this.#currentOp = null;
        this.#id = 0;
    }

    get storage() {
        let data = [];
        this.#previous.forEach(id => {
            data.push(this.#storage.get(id))
        })
        return data;
    }
    get isForwardEmpty() { return this.#forward.length === 0 }
    get isPreviousEmpty() { return this.#previous.length === 0 }

    /**
     * @description Deletes all operations stored in history.
     */
    clear() {
        this.#forward.splice(0);
        this.#previous.splice(0);
        this.#storage.clear();
        this.#id = 0;
        this.#currentId = this.#id;
        this.#currentOp = null;
    }

    /**
     * @description populate history by adding an (id,operation).
     */
    populate(operation) {
        this.#id = operation.oid;

        switch (operation.ot) {
            case OP.ADD: 
                this.#currentOp = new JAddOp(
                    this.#id, operation.ot, operation.nid, operation.ntx, operation.nt); 
                break;
            case OP.DEL: 
                this.#currentOp = new JDelOp(
                    this.#id, operation.ot, operation.nid, operation.ntx, operation.nt, 
                    operation.nx, operation.ny, operation.no);
                break;
            case OP.MODIF:
                this.#currentOp = new JModifOp(
                    this.#id, operation.ot, operation.nid, operation.notx);
                break;
            case OP.MOVE: 
                this.#currentOp = new JMoveOp(
                    this.#id, operation.ot, operation.nid, operation.nox, operation.noy);
                break;
            case OP.LINK: 
                this.#currentOp = new JLinkOp(
                    this.#id, operation.ot, operation.nid, operation.na1);
                break;
            default: break;
        }

        switch (operation.ot) {
            case OP.ADD: 
                this.#currentOp.update(operation.nx, operation.ny); 
                break;
            case OP.DEL: 
                this.#currentOp.update(operation.niid, operation.nia);
                break;
            case OP.MODIF:
                this.#currentOp.update(operation.nntx);
                break;
            case OP.MOVE: 
                this.#currentOp.update(operation.nnx, operation.nny);
                break;
            case OP.LINK: 
                this.#currentOp.update(operation.nlid, operation.na2);
                break;
            default: break;
        }

        this.#storage.set(this.#currentOp.opId, this.#currentOp);
        this.#previous.push(this.#currentOp.opId);

        this.#id ++;
    }

    /**
     * @description Update history by adding an operation.
     */
    update(node, nodeInId = -1, nodeInArea = -1, nodeLinkId = -1, clickArea = -1) {
        switch (this.#currentOp.opType) {
            case OP.ADD: 
                this.#currentOp.update(node.x, node.y); 
                break;
            case OP.DEL: 
                this.#currentOp.update(nodeInId, nodeInArea);
                break;
            case OP.MODIF:
                this.#currentOp.update(node.txt);
                break;
            case OP.MOVE: 
                if (this.#currentOp.nodeOldX != node.x 
                    && this.#currentOp.nodeOldY != node.y) {
                        this.#currentOp.update(node.x, node.y);
                } else {
                    this.#currentOp = null;
                }
                break;
            case OP.LINK: 
                this.#currentOp.update(nodeLinkId, clickArea);
                break;
            default: break;
        }

        if (this.#currentOp != null) {
            this.#storage.set(this.#currentOp.opId, this.#currentOp);
            this.#previous.push(this.#currentOp.opId);
            
            if (this.#forward.length > 0) {
                this.#forward.forEach(id => this.#storage.delete(id))
                this.#forward.splice(0);
            }

            this.#id ++;
        }
    }

    /**
     * @description Update history by adding an operation.
     */
    create(type, nodeId, node, clickArea = -1) {
        switch (type) {
            case OP.ADD: 
                this.#currentOp = new JAddOp(
                    this.#id, type, nodeId, node.txt, node.type); 
                break;
            case OP.DEL: 
                this.#currentOp = new JDelOp(
                    this.#id, type, nodeId, node.txt, node.type, 
                    node.x, node.y, node.output);
                break;
            case OP.MODIF:
                this.#currentOp = new JModifOp(
                    this.#id, type, nodeId, node.txt);
                break;
            case OP.MOVE: 
                this.#currentOp = new JMoveOp(
                    this.#id, type, nodeId, node.x, node.y);
                break;
            case OP.LINK: 
                this.#currentOp = new JLinkOp(
                    this.#id, type, nodeId, clickArea);
                break;
            default: break;
        }
    }

    /**
     * @description ...
     */
    abort() {
        this.#currentOp = null;
    }

    /**
     * @description Returns the following operation.
     * @returns {Object} 
     */
    redo() {
        if (this.#forward.length > 0) {
            this.#currentId = this.#forward.pop();
            this.#previous.push(this.#currentId);
        }
        return this.#storage.get(this.#currentId);
    }
    
    /**
     * @description Returns the previous operation.
     * @returns {Object} 
     */
    undo() {
        if (this.#previous.length > 0) {
            this.#currentId = this.#previous.pop();
            console.log(this.#currentId);
            
            this.#forward.push(this.#currentId);
        }
        return this.#storage.get(this.#currentId);
    }
}