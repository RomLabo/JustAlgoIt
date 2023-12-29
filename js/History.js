/*
0000000001 Author RomLabo 111111111
1000111000 Class History 1111111111
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
 * @class History
 * @description Stores the history 
 * of changes made on the canvas.
 */
class History {
    // Private properties

    /**
     *
     */
    constructor() {
        this._previous = [];
        this._forward = [];
        this._currentOperation = null;
    }

    /**
     * 
     */
    update(operation) {
        this._previous.push(operation);
        this._forward.splice(0);
    }

    /**
     * 
     */
    redo() {
        this._currentOperation = null;
        if (this._forward.length > 0) {
            this._currentOperation = this._forward.pop();
            this._previous.push(this._currentOperation);
        }
        return this._currentOperation;
    }
    
    /**
     * 
     */
    undo() {
        this._currentOperation = null;
        if (this._previous.length > 0) {
            this._currentOperation = this._previous.pop();
            this._forward.push(this._currentOperation);
        }
        return this._currentOperation;
    }
}