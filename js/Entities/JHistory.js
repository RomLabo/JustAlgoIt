/*
0000000001 Author RomLabo 111111111
1000111000 Class JHistory 111111111
1000000001 Created on 07/02/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * Globals constants
 */
const OP = Object.freeze({
    ABORT: -1, NONE: 0, DEL: 1, 
    ADD: 2, MODIF: 3, MOVE: 4, LINK: 5
});

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
    #storage; #id; #opInProgress;
    #snapId;
    
    /**
     * Create a JHistory.
     */
    constructor() {
        this.#previous = [];
        this.#forward = [];
        this.#storage = new Map();

        this.snapshots = new Map();
        this.operations = new Map();
        this.algoStorage = new Map();

        this.#currentId = 0;
        this.#currentOp = null;
        this.#opInProgress = false;
        this.#id = 0;
        this.#snapId = 0;

        this.current;
    }

    get storage() {
        let data = [];
        this.#previous.forEach(id => {
            data.push(this.#storage.get(id))
        })
        return data;
    }

    get allSnapshots() { return this.snapshots }
    get isForwardEmpty() { return this.#forward.length === 0 }
    get isPreviousEmpty() { return this.#previous.length === 0 }

    store(typeOp, nodesKey, nodes, before = true) {
        let snapshotsKeys = [];
        for (let i = 0; i < nodes.length; i++) {
            this.snapshots.set(this.#snapId, {
                key: nodesKey[i],
                ...nodes[i].toLitteralObj()
            });

            snapshotsKeys.push(this.#snapId);
            this.#snapId ++;
        }
        
        if (before) {
            this.operations.set(this.#id, {
                type: typeOp,
                before: snapshotsKeys,
                after: []
            });
        } else {
            this.operations.get(this.#id).after = snapshotsKeys;
            this.#previous.push(this.#id);

            if (this.#forward.length > 0) {
                this.#forward.forEach(id => {
                    let op = this.operations.get(id);
                    op.before.forEach(snapKey => {
                        this.snapshots.delete(snapKey);
                    })
                    op.after.forEach(snapKey => {
                        this.snapshots.delete(snapKey);
                    })
                    this.operations.delete(id);
                })
                this.#forward.splice(0);
            }
    
            this.#id ++;
        }  
    }

    /**
     * @description Deletes all operations stored in history.
     */
    delete() {
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
    populate(operation, canvasWidth, canvasHeight) {
        this.#id = operation.oid;

        switch (operation.ot) {
            case OP.ADD: 
                this.#currentOp = new JAddOp(
                    this.#id, operation.ot, operation.nid, operation.ntx, operation.nt
                ); 
                break;
            case OP.DEL: 
                this.#currentOp = new JDelOp(
                    this.#id, operation.ot, operation.nid, operation.ntx, 
                    operation.nt, Math.round((operation.nx/100)*canvasWidth), 
                    Math.round((operation.ny/100)*canvasHeight), operation.no
                );
                break;
            case OP.MODIF:
                this.#currentOp = new JModifOp(
                    this.#id, operation.ot, operation.nid, operation.notx
                );
                break;
            case OP.MOVE: 
                this.#currentOp = new JMoveOp(
                    this.#id, operation.ot, operation.nid, 
                    Math.round((operation.nox/100)*canvasWidth), 
                    Math.round((operation.noy/100)*canvasHeight)
                );
                break;
            case OP.LINK: 
                this.#currentOp = new JLinkOp(
                    this.#id, operation.ot, operation.nid, operation.na1
                );
                break;
            default: break;
        }

        switch (operation.ot) {
            case OP.ADD: 
                this.#currentOp.update(
                    Math.round((operation.nx/100)*canvasWidth), 
                    Math.round((operation.ny/100)*canvasHeight)
                ); 
                break;
            case OP.DEL: 
                this.#currentOp.update(operation.niid, operation.nia);
                break;
            case OP.MODIF:
                this.#currentOp.update(operation.nntx);
                break;
            case OP.MOVE: 
                this.#currentOp.update(
                    Math.round((operation.nnx/100)*canvasWidth), 
                    Math.round((operation.nny/100)*canvasHeight)
                );
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
    create(type, nodeId, node, clickArea = -1) {
        if (!this.#opInProgress) {
            this.#opInProgress = true;
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
                default: this.#opInProgress = false; break;
            }
        }
    }

    /**
     * @description ...
     */
    abort() {
        this.#currentOp = null;
        this.#opInProgress = false;
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
        return this.operations.get(this.#currentId);
    }
    
    /**
     * @description Returns the previous operation.
     * @returns {Object} 
     */
    undo() {
        if (this.#previous.length > 0) {
            this.#currentId = this.#previous.pop();
            this.#forward.push(this.#currentId);
        }
        return this.operations.get(this.#currentId);
    }
}