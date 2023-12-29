/*
0000000001 Author RomLabo
1000111000 Class Link
1000000001 Created on 16/09/2023.
1000100011111000000001100001110000
1000110001111000110001100010101000
0000011000011000000001100011011000
*/

/**
 * @class Link
 * @description Represents a link between 
 * two nodes in an algorithm.
 */
class Link {
    // Private properties
    #nbLink; #nbUnlink;
    #allLink; #allUnlink;
    #isInclude; #context
    #marginBetween; #margin;
    
    /**
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
     * @description ....
     */
    resetLink() {
        this.#nbLink = 0;
        this.#allLink = [];
    }

    /**
     * @description ....
     */
    resetUnlink() {
        this.#nbUnlink = 0;
        this.#allUnlink = [];
    }

    /**
     * @description ....
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
    
            if (!this.#isInclude && allElms.get(this.#allLink[0][0]).type !== 203 
                && allElms.get(this.#allLink[0][0]).type !== 207) {
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
     * @description ....
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
     * @description ....
     */
    drawLine(xA, yA, xB, yB) {
        this.#context.beginPath();
        this.#context.moveTo(xA, yA);
        this.#context.lineTo(xB, yB);
        this.#context.stroke();
    }

    /**
     * @description ....
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

                if (elm.type !== 204 && elm.type !== 206) {
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
                if (elm.type === 204 || elm.type === 206) {
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

                    this.drawLine(
                        (elm.allCoord[i] + (elm.clickArea[i]/2|0)) + this.#marginBetween, 
                        elm.y + (elm.height/2|0) + this.#marginBetween,
                        (elm.allCoord[i] + (elm.clickArea[i]/2|0)) + this.#marginBetween, 
                        elm.y + (elm.height/2|0) + this.#margin
                    );

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