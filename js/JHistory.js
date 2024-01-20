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
    
    /**
     * Create a JHistory.
     */
    constructor() {
        this.#previous = [];
        this.#forward = [];
        this.#currentOperation = null;
    }

    get isForwardEmpty() { return this.#forward.length === 0 }
    get isPreviousEmpty() { return this.#previous.length === 0 }

    /**
     * @description Deletes all operations stored in history.
     */
    clear() {
        this.#forward.splice(0);
        this.#previous.splice(0);
        this.#currentOperation = null;
    }

    /**
     * @description Update history by adding an operation.
     */
    update(operation) {
        this.#previous.push(operation);
        if (this.#forward.length > 0) {
            this.#forward.splice(0);
        }
    }

    /**
     * @description Returns the following operation.
     * @returns {Object} 
     */
    redo() {
        this.#currentOperation = null;
        if (this.#forward.length > 0) {
            this.#currentOperation = this.#forward.pop();
            this.#previous.push(this.#currentOperation);
        }
        return this.#currentOperation;
    }
    
    /**
     * @description Returns the previous operation.
     * @returns {Object} 
     */
    undo() {
        this.#currentOperation = null;
        if (this.#previous.length > 0) {
            this.#currentOperation = this.#previous.pop();
            this.#forward.push(this.#currentOperation);
        }
        return this.#currentOperation;
    }
}