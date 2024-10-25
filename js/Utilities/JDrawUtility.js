/*
0000000001 Author RomLabo 111111111
1000111000 JDrawUtility Class 11111
1000000001 Created on 10/08/2024 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JDrawUtility 
 * @description Allows you to draw any type of node.
 */
class JDrawUtility {
    static txtHeight = 0.02 * window.innerHeight;
    static txtTopMargin = 0.025 * window.innerHeight;
    static txtLeftMargin = 0.01 * window.innerHeight;
    static marginBetween = 2;
    static margin = 20;

    /* Private functions */

    /**
     * @description Draw an arrow on the canvas
     * @param {CanvasRenderingContext2D} context 
     * @param {Number} x
     * @param {Number} y 
     */
    static #arrow(context, x, y) {
        context.beginPath();
        context.moveTo(x - 1, y - ((this.txtHeight*.7)|0));
        context.lineTo(x - 1, y + this.txtHeight);
        context.stroke();

        context.beginPath();
        context.moveTo(x - 1, y + ((this.txtHeight*1.25)|0));
        context.lineTo(
            x - 1 - (this.txtHeight/2)|0, 
            y + ((this.txtHeight*.7)|0)
        );
        context.lineTo(
            x - 1 + (this.txtHeight/2)|0, 
            y + ((this.txtHeight*.7)|0)
        );
        context.fill();
    }

    /**
     * @description Draw an corner on the canvas
     * @param {CanvasRenderingContext2D} context 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} height 
     * @param {Boolean} left 
     */
    static #corner(context, x, y, height, left = true) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(
            x - (left ? this.txtHeight : (-this.txtHeight)),
            y + (height/2)|0
        );
        context.lineTo(x, y + height);
        context.stroke();
    }

    /**
     * @description Draw an circle on the canvas
     * @param {CanvasRenderingContext2D} context 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     */
    static #circle(context, x, y, width) {
        context.beginPath();
        context.arc(x, y, (width/2)|0, 0, 2 * Math.PI);
        context.stroke();
    }

    /**
     * @description Draw an triangle on the canvas
     * @param {CanvasRenderingContext2D} context 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     */
    static #triangle(context, x, y, width) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - (width*.9)|0, y + width);
        context.lineTo(x + (width*.9)|0, y + width);
        context.fill();
    }

    /**
     * @description Draw an bracket on the canvas
     * @param {CanvasRenderingContext2D} context 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} height 
     * @param {Boolean} left 
     */
    static #bracket(context, x, y, height, left = true) {
        context.beginPath();
        context.moveTo(x, y);
        context.bezierCurveTo(
            x - (left ? -(this.txtHeight) : (this.txtHeight)), 
            y , x , y - (height*.49), 
            x - (left ? -(this.txtHeight) : this.txtHeight), 
            y - height/2
        );
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
        context.bezierCurveTo(
            x - (left ? -(this.txtHeight) : (this.txtHeight)), 
            y , x , y + (height*.49), 
            x - (left ? -this.txtHeight : this.txtHeight), 
            y + height/2
        );
        context.stroke();
    }

    /**
     * @description Draws a line on the canvas.
     * @param {CanvasRenderingContext2D} context
     * @param {Number} x1 
     * @param {Number} y1 
     * @param {Number} x2 
     * @param {Number} y2 
     */
    static #line(context, x1, y1, x2, y2) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    }

    /* Public functions */

    /**
     * @description Draw a break node on the canvas
     * @param {CanvasRenderingContext2D} context 
     * @param {JNode} node 
     */
    static break(context, node) {
        this.#arrow(context, node.x, node.y);
        context.strokeRect(
            (node.x - ((node.width)/2))|0, 
            (node.y - (node.height/2))|0, 
            node.width|0, 
            node.height
        );
    }

    /**
     * @description Draw a loop node on the canvas
     * @param {CanvasRenderingContext2D} context 
     * @param {JNode} node 
     */
    static loop(context, node) {  
        this.#circle(
            context, node.x, node.y, 
            node.width, 
        )

        this.#triangle(
            context,
            node.x + ((node.width/2)|0), 
            node.y - (((node.width/2)*.6)/2|0),
            ((node.width/2)*.6)|0
        )
        
        for (let i = 0; i < node.txt[0].length; i++) {
            context.fillText(
                `${node.txt[0][i]}`, 
                node.x + ((node.width/2) + ((node.width/2)*.6))|0,
                (
                    (node.y - (((node.txt[0].length/2)|0) * (this.txtHeight + 2))) 
                     + (i * (this.txtHeight + 2))
                )
            );
        }
    }

    /**
     * @description Draw an assignment node on the canvas
     * @param {CanvasRenderingContext2D} context 
     * @param {JNode} node 
     */
    static assignment(context, node) {
        context.strokeRect(
            (node.x - ((node.size[0])/2))|0, 
            (node.y - (node.height/2))|0, 
            (node.size[0])|0, 
            node.height
        );

        for (let i = 0; i < node.txt[0].length; i++) {
            context.fillText(
                `${node.txt[0][i]}`, 
                (
                    node.x - ((node.size[0])/2) 
                    + this.txtLeftMargin
                )|0, 
                (
                    ((node.y - (node.height/2))|0) 
                    + this.txtTopMargin + (i * this.txtHeight)
                )
            );
        }
    }

    /**
     * @description Draw an issue node on the canvas
     * @param {CanvasRenderingContext2D} context 
     * @param {JNode} node 
     */
    static issue(context, node) {
        if (node.size[0] > 0) {
            this.#bracket(
                context,
                (
                    node.x - ((this.txtHeight * 2 + this.txtLeftMargin) 
                    + node.size[0] + ((node.size[1])/2))
                )|0,
                node.y, node.height 
            )

            this.#bracket(
                context,
                (
                    node.x - (this.txtHeight/2) - (((node.size[1])/2))
                )|0,
                node.y, node.height, false
            )
            
            for (let i = 0; i < node.txt[0].length; i++) {
                context.fillText(
                    `${node.txt[0][i]}`, 
                    (
                        node.x - ((this.txtHeight + this.txtLeftMargin)
                        + node.size[0] + ((node.size[1])/2)) 
                        + this.txtLeftMargin
                    )|0, 
                    (node.y - (this.txtTopMargin/2) + (i * this.txtHeight))|0
                );
            }
        }

        context.strokeRect(
            (node.x - ((node.size[1])/2))|0, 
            (node.y - (node.height/2))|0, 
            (node.size[1])|0, 
            node.height
        );

        for (let i = 0; i < node.txt[1].length; i++) {
            context.fillText(
                `${node.txt[1][i]}`, 
                (node.x - ((node.size[1])/2) + this.txtLeftMargin)|0, 
                (
                    node.y - (node.height/2)
                    + this.txtTopMargin + (i * this.txtHeight)
                )|0
            );
        }

        if (node.size[2] > 0) {
            this.#bracket(
                context, 
                (
                    node.x + ((this.txtHeight * 2 + this.txtLeftMargin) 
                    + node.size[2] + ((node.size[1])/2))
                )|0,
                node.y, node.height, false
            )

            this.#bracket(
                context,
                (
                    node.x + (this.txtHeight/2) + (((node.size[1])/2))
                )|0,
                node.y, node.height
            )

            for (let i = 0; i < node.txt[2].length; i++) {
                context.fillText(
                    `${node.txt[2][i]}`, 
                    (
                        node.x + ((this.txtHeight + this.txtLeftMargin)
                        + ((node.size[1])/2)) + this.txtLeftMargin
                    )|0, 
                    (node.y - (this.txtTopMargin/2) + (i * this.txtHeight))|0
                );
            }
        }
    }

    /**
     * @description Draw a condition node on the canvas
     * @param {CanvasRenderingContext2D} context 
     * @param {JNode} node 
     */
    static condition(context, node) {
        this.#line(
            context,
            (node.x - ((node.width)/2))|0, 
            (node.y - (node.height/2))|0,
            (node.x + ((node.width)/2))|0, 
            (node.y - (node.height/2))|0
        );

        this.#line(
            context,
            (node.x - ((node.width)/2))|0, 
            (node.y + (node.height/2))|0,
            (node.x + ((node.width)/2))|0,
            (node.y + (node.height/2))|0
        );

        for (let j = 0; j < node.allCoord.length; j++) {
            for (let i = 0; i < node.txt[j].length; i++) {
                context.fillText(
                    `${node.txt[j][i]}`, 
                    (node.allCoord[j] + this.txtLeftMargin)|0, 
                    (((node.y - (node.height/2))|0) 
                        + this.txtTopMargin 
                        + (i * this.txtHeight)
                    )
                );
            }
            if (j < node.allCoord.length -1) {
                this.#line(
                    context, node.allCoord[j+1], 
                    ((node.y - (node.height/2))|0),
                    node.allCoord[j+1],
                    ((node.y + (node.height/2))|0)
                );
            }
        }

        this.#corner(
            context, node.x - ((node.width)/2)|0,
            node.y - 1 - ((node.height/2)|0), node.height
        );

        this.#corner(
            context, node.x + ((node.width)/2)|0,
            node.y - 1 - ((node.height/2)|0),
            node.height, false
        );
    }

    /**
     * @description Draw a switch node on the canvas
     * @param {CanvasRenderingContext2D} context 
     * @param {JNode} node 
     */
    static switch(context, node) {
        this.#line(
            context,
            (node.x - ((node.width)/2))|0, 
            (node.y - (node.height/2))|0,
            (node.x + ((node.width)/2))|0, 
            (node.y - (node.height/2))|0
        )
        
        this.#line(
            context,
            (node.x - ((node.width)/2))|0, 
            (node.y + (node.height/2))|0,
            (node.x + ((node.width)/2))|0,
            (node.y + (node.height/2))|0
        )

        for (let j = 0; j < node.allCoord.length; j++) {
            for (let i = 0; i < node.txt[j].length; i++) {
                context.fillText(
                    `${node.txt[j][i]}`, 
                    node.allCoord[j] + this.txtLeftMargin, 
                    (
                        node.y + this.txtTopMargin 
                        + (i * this.txtHeight)
                    )
                );
            }
            if (j < node.allCoord.length -1) {
                this.#line(
                    context, node.allCoord[j+1], 
                    node.y, node.allCoord[j+1], 
                    (node.y + (node.height/2))|0
                )
            }
        }

        for (let i = 0; i < node.txt[node.txt.length-1].length; i++) {
            context.fillText(
                `${node.txt[node.txt.length-1][i]}`, 
                (
                    node.x - (node.size[node.txt.length-1]/2) 
                    + this.txtLeftMargin
                )|0, 
                (((node.y - (node.height/2))|0) 
                        + this.txtTopMargin 
                        + (i * this.txtHeight)
                )
            );
        }

        this.#corner(
            context, node.x - ((node.width)/2)|0,
            node.y - 1 - ((node.height/2)|0), node.height
        );

        this.#corner(
            context, node.x + ((node.width)/2)|0,
            node.y - 1 - ((node.height/2)|0),
            node.height, false
        );

        this.#line(
            context, node.x - (((node.width)/2) + this.txtHeight), 
            node.y, node.x + (((node.width)/2) + this.txtHeight), 
            node.y
        );
    }

    /**
     * @description Draws all links between nodes.
     * @param {CanvasRenderingContext2D} context
     * @param {Map} allElms 
     * @param {JNode} elm 
     */
    static link(context, allElms, elm) {
        for (let i = 0; i < elm.output.length; i++) {
            if (elm.output[i].length == 1) {
                // Simple decomposition
                this.#line(
                    context,
                    (
                        (elm.allCoord[i] + (elm.clickArea[i]/2|0)) 
                        - this.marginBetween
                    ), 
                    elm.y + (elm.height/2|0) + this.marginBetween,
                    allElms.get(elm.output[i][0]).x - this.marginBetween, 
                    (
                        allElms.get(elm.output[i][0]).y - 
                        (allElms.get(elm.output[i][0]).height/2|0) - this.marginBetween
                    )
                );

                if (elm.type === TYPE.ISSUE) {
                    this.#line(
                        context,
                        (elm.allCoord[i] + (elm.clickArea[i]/2|0)) + this.marginBetween, 
                        elm.y + (elm.height/2|0) + this.marginBetween,
                        allElms.get(elm.output[i][0]).x + this.marginBetween, 
                        (
                            allElms.get(elm.output[i][0]).y - 
                            (allElms.get(elm.output[i][0]).height/2|0) - this.marginBetween
                        )
                    );
                }
            } else if (elm.output[i].length > 1){
                // Multiple decomposition
                if (elm.type === TYPE.CONDITION || elm.type === TYPE.SWITCH) {
                    for (let j = 0; j < elm.output[i].length; j++) {
                        this.#line(
                            context,
                            (elm.allCoord[i] + (elm.clickArea[i]/2 |0)), 
                            elm.y + (elm.height/2|0) + this.marginBetween,
                            allElms.get(elm.output[i][j]).x, 
                            (
                                allElms.get(elm.output[i][j]).y - 
                                (allElms.get(elm.output[i][j]).height/2|0) - this.marginBetween
                            )
                        );
                    }
                } else {
                    this.#line(
                        context,
                        (elm.allCoord[i] + (elm.clickArea[i]/2|0)) - this.marginBetween, 
                        elm.y + (elm.height/2|0) + this.marginBetween,
                        (elm.allCoord[i] + (elm.clickArea[i]/2|0)) - this.marginBetween, 
                        elm.y + (elm.height/2|0) + this.margin
                    );

                    if (elm.type === TYPE.ISSUE) {
                        this.#line(
                            context,
                            (elm.allCoord[i] + (elm.clickArea[i]/2|0)) + this.marginBetween, 
                            elm.y + (elm.height/2|0) + this.marginBetween,
                            (elm.allCoord[i] + (elm.clickArea[i]/2|0)) + this.marginBetween, 
                            elm.y + (elm.height/2|0) + this.margin
                        );
                    }

                    for (let j = 0; j < elm.output[i].length; j++) {
                        this.#line(
                            context, allElms.get(elm.output[i][j]).x,
                            elm.y + (elm.height/2|0) + this.margin,
                            elm.x, elm.y + (elm.height/2|0) + this.margin
                        );

                        this.#line(
                            context, allElms.get(elm.output[i][j]).x, 
                            elm.y + (elm.height/2 |0) + this.margin,
                            allElms.get(elm.output[i][j]).x, 
                            (
                                allElms.get(elm.output[i][j]).y - 
                                (allElms.get(elm.output[i][j]).height/2|0) - this.marginBetween
                            )
                        );
                    }
                }
            } 
        }
        
    }
}