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
    /* TODO: refactoring */
    
    // Private properties
    #nbLink; #nbUnlink;
    #allLink; #allUnlink;
    #isInclude; #context
    #marginBetween; #margin;
    
    /**
     * Create a JLink.
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.#context = canvas.getContext("2d");
        this.#nbLink = 0;
        this.#nbUnlink = 0;
        this.#allLink = [];
        this.#allUnlink = [];
        this.#isInclude;
        this.#marginBetween = 2;
        this.#margin = 20;
    }

    /**
     * @description Deletes node identifiers 
     * previously used for linking.
     */
    resetLink() {
        this.#nbLink = 0;
        this.#allLink = [];
    }

    /**
     * @description Deletes node identifiers 
     * previously used for unlinking.
     */
    resetUnlink() {
        this.#nbUnlink = 0;
        this.#allUnlink = [];
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
    addLink(allElms, idOfElm, indexOfClickArea) {
        this.#nbLink ++;
        this.#allLink.push([idOfElm, indexOfClickArea]);

        if (this.#nbLink >= 2 
            && (this.#allLink[0][0] === this.#allLink[1][0]
            || this.#allLink[1][1] === -1)) {

                this.resetLink();
                return false;
        } else if (this.#nbLink >= 2 
                   && this.#allLink[0][0] !== this.#allLink[1][0]
                   && this.#allLink[1][1] !== -1) {

            if (allElms.get(this.#allLink[0][0]).y > allElms.get(this.#allLink[1][0]).y) {
                this.#allLink.reverse();
            }
            this.#isInclude = false;

            for (const node of allElms.values()) {
                for (let j = 0; j < node.output.length; j++) {
                    if (node.output[j].includes(this.#allLink[1][0])) {
                        this.#isInclude = true;
                    }
                }
            }
    
            if (!this.#isInclude && allElms.get(this.#allLink[0][0]).type !== 0
                && allElms.get(this.#allLink[0][0]).type !== 4) {
                allElms.get(this.#allLink[0][0]).output[this.#allLink[0][1]].push(this.#allLink[1][0]);
                allElms.get(this.#allLink[0][0]).output[this.#allLink[0][1]].sort((a,b) => allElms.get(a).x - allElms.get(b).x);
            }

            this.resetLink();
            return true;
        }

        if (this.#nbLink === 1) {
            return false;
        }
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
    removeLink(allElms, idOfElm, indexOfClickArea) {
        this.#nbUnlink ++;
        this.#allUnlink.push([idOfElm, indexOfClickArea]);

        if (this.#nbUnlink >= 2 
            && (this.#allUnlink[0][0] === this.#allUnlink[1][0]
            || this.#allUnlink[1][1] === -1)) {
                
                this.resetUnlink();
                return false;
        } else if (this.#nbUnlink >= 2 
                    && this.#allUnlink[0][0] !== this.#allUnlink[1][0]
                    && this.#allUnlink[1][1] !== -1) {

            if (allElms.get(this.#allUnlink[0][0]).y > allElms.get(this.#allUnlink[1][0]).y) {
                this.#allUnlink.reverse();
            }
            let indexToRemove = allElms.get(this.#allUnlink[0][0]).output[this.#allUnlink[0][1]].indexOf(this.#allUnlink[1][0]);
            if (indexToRemove >= 0) {
                allElms.get(this.#allUnlink[0][0]).output[this.#allUnlink[0][1]].splice(indexToRemove, 1);
            }
            
            this.resetUnlink();
            return true;
        }

        if (this.#nbUnlink === 1) {
            return false;
        }
    }

    /**
     * @description Draws a line on the canvas.
     * @param {Number} xA 
     * @param {Number} yA 
     * @param {Number} xB 
     * @param {Number} yB 
     */
    drawLine(xA, yA, xB, yB) {
        this.#context.beginPath();
        this.#context.moveTo(xA, yA);
        this.#context.lineTo(xB, yB);
        this.#context.stroke();
    }

    /**
     * @description Draws all links between nodes.
     * @param {Map} allElms 
     * @param {JNode} elm 
     */
    draw(allElms, elm) {
        for (let i = 0; i < elm.output.length; i++) {
            if (elm.output[i].length == 1) {
                // Simple decomposition
                this.drawLine(
                    (
                        (elm.allCoord[i] + (elm.clickArea[i]/2|0)) 
                        - this.#marginBetween
                    ), 
                    elm.y + (elm.height/2|0) + this.#marginBetween,
                    allElms.get(elm.output[i][0]).x - this.#marginBetween, 
                    (
                        allElms.get(elm.output[i][0]).y - 
                        (allElms.get(elm.output[i][0]).height/2|0) - this.#marginBetween
                    )
                );

                if (elm.type === TYPE.ISSUE) {
                    this.drawLine(
                        (elm.allCoord[i] + (elm.clickArea[i]/2|0)) + this.#marginBetween, 
                        elm.y + (elm.height/2|0) + this.#marginBetween,
                        allElms.get(elm.output[i][0]).x + this.#marginBetween, 
                        (
                            allElms.get(elm.output[i][0]).y - 
                            (allElms.get(elm.output[i][0]).height/2|0) - this.#marginBetween
                        )
                    );
                }
            } else if (elm.output[i].length > 1){
                // Multiple decomposition
                if (elm.type === TYPE.CONDITION || elm.type === TYPE.SWITCH) {
                    for (let j = 0; j < elm.output[i].length; j++) {
                        this.drawLine(
                            (elm.allCoord[i] + (elm.clickArea[i]/2 |0)), 
                            elm.y + (elm.height/2|0) + this.#marginBetween,
                            allElms.get(elm.output[i][j]).x, 
                            (
                                allElms.get(elm.output[i][j]).y - 
                                (allElms.get(elm.output[i][j]).height/2|0) - this.#marginBetween
                            )
                        );
                    }
                } else {
                    this.drawLine(
                        (elm.allCoord[i] + (elm.clickArea[i]/2|0)) - this.#marginBetween, 
                        elm.y + (elm.height/2|0) + this.#marginBetween,
                        (elm.allCoord[i] + (elm.clickArea[i]/2|0)) - this.#marginBetween, 
                        elm.y + (elm.height/2|0) + this.#margin
                    );

                    if (elm.type === 208) {
                        this.drawLine(
                            (elm.allCoord[i] + (elm.clickArea[i]/2|0)) + this.#marginBetween, 
                            elm.y + (elm.height/2|0) + this.#marginBetween,
                            (elm.allCoord[i] + (elm.clickArea[i]/2|0)) + this.#marginBetween, 
                            elm.y + (elm.height/2|0) + this.#margin
                        );
                    }

                    for (let j = 0; j < elm.output[i].length; j++) {
                        this.drawLine(
                            allElms.get(elm.output[i][j]).x,
                            elm.y + (elm.height/2|0) + this.#margin,
                            elm.x,
                            elm.y + (elm.height/2|0) + this.#margin
                        );

                        this.drawLine(
                            allElms.get(elm.output[i][j]).x, 
                            elm.y + (elm.height/2 |0) + this.#margin,
                            allElms.get(elm.output[i][j]).x, 
                            (
                                allElms.get(elm.output[i][j]).y - 
                                (allElms.get(elm.output[i][j]).height/2|0) - this.#marginBetween
                            )
                        );
                    }
                }
            } 
        }
        
    }
}