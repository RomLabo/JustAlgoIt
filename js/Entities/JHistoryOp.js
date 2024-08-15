/*
0000000001 Author RomLabo 111111111
1000111000 Class JHistoryOp 1111111
1000000001 Created on 15/08/2024 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * Globals constants
 */
const OP = Object.freeze({
    DEL: 0, ADD: 1, MODIF: 2,
    MOVE: 3, LINK: 4, UNLINK: 5
});

/**
 * @abstract JHistoryOp
 * @description ..
 */
class JHistoryOp {
    /**
     * @param {Number} opId 
     * @param {OP} opType
     * @param {Number} nodeId  
     */
    constructor(opId, opType, nodeId) {
        if (this.constructor == JHistoryOp) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this._opId = opId;
        this._opType = opType;
        this._nodeId = nodeId;
    }

    get opId() { return this._opId }
    set opId(val) { this._opId = val }

    get opType() { return this._opType }
    set opType(val) { this._opType = val }

    get nodeId() { return this._nodeId }
    set nodeId(val) { this._nodeId = val }
}

/*
0000000001 Author RomLabo 111111111
1000111000 Class JAddOp 11111111111
1000000001 Created on 15/08/2024 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JAddOp
 * @description ...
 * @extends JHistoryOp
 */
class JAddOp extends JHistoryOp {
    /**
     * Private properties
     */
    #nodeTxt; #nodeType;
    #nodeX; #nodeY;

    /**
     * Create a JAddOp.
     * @param {Number} opId
     * @param {OP} opType
     * @param {Number} nodeId  
     * @param {Array<String>} nodeTxt 
     * @param {TYPE} nodeType 
     * @param {Number} nodeX 
     * @param {Number} nodeY 
     */
    constructor(opId, opType, nodeId, nodeTxt, nodeType) {
        super(opId, opType, nodeId);
        this.#nodeTxt = nodeTxt;
        this.#nodeType = nodeType;
        this.#nodeX = 0;
        this.#nodeY = 0;
    }

    get nodeTxt() { return this.#nodeTxt }
    get nodeType() { return this.#nodeType }
    get nodeX() { return this.#nodeX }
    get nodeY() { return this.#nodeY }

    update(nodeX, nodeY) {
        this.#nodeX = nodeX;
        this.#nodeY = nodeY;
    }
}

/*
0000000001 Author RomLabo 111111111
1000111000 Class JDelOp 11111111111
1000000001 Created on 15/08/2024 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JDelOp
 * @description ...
 * @extends JHistoryOp
 */
class JDelOp extends JHistoryOp {
    /**
     * Private properties
     */
    #nodeTxt; #nodeType;
    #nodeX; #nodeY; #nodeOut;
    #nodeInId; #nodeInArea;

    /**
     * Create a JDelOp
     * @param {Number} opId
     * @param {OP} opType
     * @param {Number} nodeId  
     * @param {Array<String>} nodeTxt 
     * @param {TYPE} nodeType 
     * @param {Number} nodeX 
     * @param {Number} nodeY 
     * @param {Array<Number>} nodeOut 
     * @param {Number} nodeInId 
     * @param {Number} nodeInArea 
     */
    constructor(opId, opType, nodeId, nodeTxt, 
                nodeType, nodeX, nodeY, nodeOut) {
        super(opId, opType, nodeId);
        this.#nodeTxt = nodeTxt;
        this.#nodeType = nodeType;
        this.#nodeX = nodeX;
        this.#nodeY = nodeY;
        this.#nodeOut = nodeOut;
        this.#nodeInId = -1;
        this.#nodeInArea = -1;
    }

    get nodeTxt() { return this.#nodeTxt }
    get nodeType() { return this.#nodeType }
    get nodeX() { return this.#nodeX }
    get nodeY() { return this.#nodeY }
    get nodeOut() { return this.#nodeOut }
    get nodeInId() { return this.#nodeInId }
    get nodeInArea() { return this.#nodeInArea }

    update(nodeInId, nodeInArea) {
        this.#nodeInId = nodeInId;
        this.#nodeInArea = nodeInArea;
    }
}

/*
0000000001 Author RomLabo 111111111
1000111000 Class JModifOp 111111111
1000000001 Created on 15/08/2024 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JModifOp
 * @description ...
 * @extends JHistoryOp
 */
class JModifOp extends JHistoryOp {
    /**
     * Private properties
     */
    #nodeOldTxt; #nodeNewTxt;

    /**
     * Create a JModifOp.
     * @param {Number} opId
     * @param {OP} opType
     * @param {Number} nodeId  
     * @param {Array<String>} nodeOldTxt 
     * @param {Array<String>} nodeNewTxt 
     */
    constructor(opId, opType, nodeId, nodeOldTxt) {
        super(opId, opType, nodeId);
        this.#nodeOldTxt = nodeOldTxt;
        this.#nodeNewTxt = [];
    }

    get nodeOldTxt() { return this.#nodeOldTxt }
    get nodeNewTxt() { return this.#nodeNewTxt }

    update(nodeNewTxt) {
        this.#nodeNewTxt = nodeNewTxt
    }
}

/*
0000000001 Author RomLabo 111111111
1000111000 Class JMoveOp 1111111111
1000000001 Created on 15/08/2024 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JMoveOp
 * @description ...
 * @extends JHistoryOp
 */
class JMoveOp extends JHistoryOp {
    /**
     * Private properties
     */
    #nodeOldX; #nodeOldY;
    #nodeNewX; #nodeNewY;

    /**
     * Create a JMoveOp.
     * @param {Number} opId
     * @param {OP} opType
     * @param {Number} nodeId  
     * @param {Number} nodeOldX 
     * @param {Number} nodeOldY
     * @param {Number} nodeNewX 
     * @param {Number} nodeNewY 
     */
    constructor(opId, opType, nodeId, nodeOldX, nodeOldY) {
        super(opId, opType, nodeId);
        this.#nodeOldX = nodeOldX;
        this.#nodeOldY = nodeOldY;
        this.#nodeNewX = -1;
        this.#nodeNewY = -1;
    }

    get nodeOldX() { return this.#nodeOldX }
    get nodeOldY() { return this.#nodeOldY }
    get nodeNewX() { return this.#nodeNewX }
    get nodeNewY() { return this.#nodeNewY }

    update(nodeNewX, nodeNewY) {
        this.#nodeNewX = nodeNewX;
        this.#nodeNewY = nodeNewY;
    }
}

/*
0000000001 Author RomLabo 111111111
1000111000 Class JLinkOp 1111111111
1000000001 Created on 15/08/2024 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JLinkOp
 * @description ...
 * @extends JHistoryOp
 */
class JLinkOp extends JHistoryOp {
    /**
     * Private properties
     */
    #nodeLinkId; #nodeArea1;
    #nodeArea2;

    /**
     * Create a JLinkOp.
     * @param {Number} opId
     * @param {OP} opType
     * @param {Number} nodeId  
     * @param {Number} nodeLinkId 
     * @param {Number} nodeArea1
     * @param {Number} nodeArea2
     */
    constructor(opId, opType, nodeId, nodeArea1) {
        super(opId, opType, nodeId);
        this.#nodeLinkId = -1;
        this.#nodeArea1 = nodeArea1;
        this.#nodeArea2 = -1;
    }

    get nodeLinkId() { return this.#nodeLinkId }
    get nodeArea1() { return this.#nodeArea1 }
    get nodeArea2() { return this.#nodeArea2 }

    update(nodeLinkId, nodeArea2) {
        this.#nodeLinkId = nodeLinkId;
        this.#nodeArea2 = nodeArea2;
    }
}