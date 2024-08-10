/*
0000000001 Author RomLabo 111111111
1000111000 Class JHistory 111111111
1000000001 Created on 07/02/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

const OP = Object.freeze({
    DEL: 0,
    ADD: 1,
    MODIF: 2,
    MOVE: 3,
    LINK: 4,
    UNLINK: 5
});

/**
 * @class JHistory
 * @description Stores the history 
 * of changes made on the canvas.
 */
class JHistory {
    // Private properties
    #previous; #forward;
    #currentOperation;
    #storage; #id;
    
    /**
     * Create a JHistory.
     */
    constructor() {
        this.#previous = [];
        this.#forward = [];
        this.#storage = new Map();
        this.#currentOperation = 0;
        this.#id = 0;
    }

    get previousOp() { return this.#storage }
    get storage() {
        let data = [];
        this.#previous.forEach(id => {
            data.push({id: id, op: this.#storage.get(id)})
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
        this.#currentOperation = this.#id;
    }

    /**
     * @description populate history by adding an (id,operation).
     */
    populate(id, operation) {
        this.#storage.set(id, operation);
        this.#id = id;
    }

    /**
     * @description Update history by adding an operation.
     */
    update(operation) {
        this.#storage.set(this.#id, operation);
        this.#previous.push(this.#id);
        if (this.#forward.length > 0) {
            this.#forward.forEach(id => this.#storage.delete(id))
            this.#forward.splice(0);
        }
        this.#id ++;
    }

    /**
     * @description Returns the following operation.
     * @returns {Object} 
     */
    redo() {
        if (this.#forward.length > 0) {
            this.#currentOperation = this.#forward.pop();
            this.#previous.push(this.#currentOperation);
        }
        return this.#storage.get(this.#currentOperation);
    }
    
    /**
     * @description Returns the previous operation.
     * @returns {Object} 
     */
    undo() {
        if (this.#previous.length > 0) {
            this.#currentOperation = this.#previous.pop();
            this.#forward.push(this.#currentOperation);
        }
        return this.#storage.get(this.#currentOperation);
    }
}