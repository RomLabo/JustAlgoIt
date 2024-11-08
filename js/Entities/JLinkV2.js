/*
0000000001 Author RomLabo 111111111
1000111000 Class JLink 111111111111
1000000001 Created on 16/09/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JLink
 * @description Represents a link between 
 * two nodes in an algorithm.
 */
class JLink {
    /**
     * Private properties
     */
    #nbLink; #nbUnlink;
    #allLink; #allUnlink;
    #isInclude; #node1; #node2;
    
    /**
     * Create a JLink.
     */
    constructor() {
        this.#nbLink = 0;
        this.#nbUnlink = 0;
        this.#allLink = [];
        this.#allUnlink = [];
        this.#isInclude;

        this.#node1 = null;
        this.#node2 = null;
    }

    /**
     * @description Deletes node identifiers 
     * previously used for linking or unlinking.
     * @param {Number} nbLink
     * @param {Array<Number>} allIds
     */
    #reset(nbLink, allIds) {
        nbLink = 0; allIds = [];
        this.#node1 = null;
        this.#node2 = null;
    }

    /**
     * @description Checks if the nodes to be 
     * linked are not already linked.
     * @param {Map} allElms 
     * @param {Array<Number>} allLink 
     * @returns Boolean 
     */
    #isAlready(allElms, allLink) {
        for (const node of allElms.values()) {
            for (let j = 0; j < node.output.length; j++) {
                if (node.output[j].includes(allLink[1][0])) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @description Create links for the nodes 
     * to be linked. 
     * @param {Map} allElms // all nodes 
     * @param {Array<Number>} allLink 
     * @param {Boolean} isLinked 
     * @param {JNode} node1 
     */
    #create(allElms, allLink, isLinked, node1) {
        if (!isLinked && node1.type !== 0
            && node1.type !== 4) {

            node1.output[allLink[0][1]].push(allLink[1][0]);
            node1.output[allLink[0][1]]
                 .sort((a,b) => allElms.get(a).x - allElms.get(b).x);
        }
    }

    /**
     * @description Remove links for the nodes
     * to be unlinked.
     * @param {Array<Number>} allUnlink 
     * @param {JNode} node1 
     */
    #destroy(allUnlink, node1) {
        let indexToRemove = node1.output[allUnlink[0][1]]
                                 .indexOf(allUnlink[1][0]);
        if (indexToRemove >= 0) {
            node1.output[allUnlink[0][1]]
                 .splice(indexToRemove, 1);
        }
    }

    /**
     * @description Change direction of connection.
     * @param {Array<Number>} allIds // ids of nodes 
     * to be linked or unlinked.
     * @param {JNode} node1 
     * @param {JNode} node2 
     */
    #changeOrder(allIds, node1, node2) {
        if (node1.y > node2.y) { allIds.reverse(); }
    }

    /**
     * @description If the operation is complete 
     * and the method has the identifiers of the 
     * two nodes to be linked, it will add 
     * the identifier of the node with which 
     * they are linked to the output array of nodes.
     * @param {Map} allElms 
     * @param {Number} idOfElm 
     * @param {Number} indexOfClickArea 
     * @returns {Boolean} True if operation successful, 
     * otherwise false.
     */
    add(allElms, idOfElm, indexOfClickArea) {
        this.#nbLink ++;
        this.#allLink.push([idOfElm, indexOfClickArea]);

        if (this.#nbLink >= 2 
            && (this.#allLink[0][0] === this.#allLink[1][0]
            || this.#allLink[1][1] === -1)) {

                this.#reset(this.#nbLink, this.#allLink);
                return false;
        } else if (this.#nbLink >= 2 
                   && this.#allLink[0][0] !== this.#allLink[1][0]
                   && this.#allLink[1][1] !== -1) {

            this.#node1 = allElms.get(this.#allLink[0][0]);
            this.#node2 = allElms.get(this.#allLink[1][0]);

            this.#changeOrder(this.#allLink, 
                                 this.#node1, 
                                 this.#node2);

            this.#isInclude = this.#isAlready(allElms, 
                                             this.#allLink);

            this.#create(allElms, this.#allLink, 
                         this.#isInclude, this.#node1);
            
            this.#reset(this.#nbLink, this.#allLink);
            return true;
        }

        if (this.#nbLink === 1) { return false; }
    }

    /**
     * @description If the operation is complete 
     * and the method has the identifiers of the 
     * two nodes to be linked, it will remove 
     * the identifier of the node with which 
     * they are linked to the output array of nodes.
     * @param {Map} allElms 
     * @param {Number} idOfElm 
     * @param {Number} indexOfClickArea 
     * @returns {Boolean} True if operation successful, 
     * otherwise false.
     */
    remove(allElms, idOfElm, indexOfClickArea) {
        this.#nbUnlink ++;
        this.#allUnlink.push([idOfElm, indexOfClickArea]);

        if (this.#nbUnlink >= 2 
            && (this.#allUnlink[0][0] === this.#allUnlink[1][0]
            || this.#allUnlink[1][1] === -1)) {
                
                this.#reset(this.#nbUnlink, this.#allUnlink);
                return false;
        } else if (this.#nbUnlink >= 2 
                    && this.#allUnlink[0][0] !== this.#allUnlink[1][0]
                    && this.#allUnlink[1][1] !== -1) {

            this.#node1 = allElms.get(this.#allLink[0][0]);
            this.#node2 = allElms.get(this.#allLink[1][0]);

            this.#changeOrder(this.#allUnlink, 
                                 this.#node1, 
                                 this.#node2);

            this.#destroy(this.#allUnlink, this.#node1);
            this.#reset(this.#nbUnlink, this.#allUnlink);
            return true;
        }

        if (this.#nbUnlink === 1) { return false; }
    }
}