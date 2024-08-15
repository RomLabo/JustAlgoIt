/*
0000000001 Author RomLabo 111111111
1000111000 JNodeUtility Class 11111
1000000001 Created on 10/08/2024 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JNodeUtility 
 * @description Allows you to draw any type of node.
 */
class JNodeUtility {
    static txtHeight = 0.02 * window.innerHeight;
    static txtTopMargin = 0.025 * window.innerHeight;
    static txtLeftMargin = 0.01 * window.innerHeight;

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {JNode} node 
     */
    static drawBreak(context, node) {
        this.#drawArrow(context, node.x, node.y);
        context.strokeRect(
            (node.x - ((node.width)/2))|0, 
            (node.y - (node.height/2))|0, 
            node.width|0, 
            node.height
        );
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {JNode} node 
     */
    static drawLoop(context, node) {  
        this.#drawCircle(
            context, node.x, node.y, 
            node.width, 
        )

        this.#drawTriangle(
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
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {JNode} node 
     */
    static drawAssignment(context, node) {
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
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {JNode} node 
     */
    static drawIssue(context, node) {
        if (node.size[0] > 0) {
            this.#drawBracket(
                context,
                (
                    node.x - ((this.txtHeight * 2 + this.txtLeftMargin) 
                    + node.size[0] + ((node.size[1])/2))
                )|0,
                node.y,
                node.height 
            )

            this.#drawBracket(
                context,
                (
                    node.x - (this.txtHeight/2) - (((node.size[1])/2))
                )|0,
                node.y,
                node.height,
                false
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
            this.#drawBracket(
                context, 
                (
                    node.x + ((this.txtHeight * 2 + this.txtLeftMargin) 
                    + node.size[2] + ((node.size[1])/2))
                )|0,
                node.y,
                node.height,
                false
            )

            this.#drawBracket(
                context,
                (
                    node.x + (this.txtHeight/2) + (((node.size[1])/2))
                )|0,
                node.y,
                node.height
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
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {JNode} node 
     */
    static drawCondition(context, node) {
        context.beginPath();
        context.moveTo(
            (node.x - ((node.width)/2))|0, 
            (node.y - (node.height/2))|0
        );
        context.lineTo(
            (node.x + ((node.width)/2))|0, 
            (node.y - (node.height/2))|0
        );
        context.stroke();

        context.beginPath();
        context.moveTo(
            (node.x - ((node.width)/2))|0, 
            (node.y + (node.height/2))|0
        );
        context.lineTo(
            (node.x + ((node.width)/2))|0,
            (node.y + (node.height/2))|0
        );
        context.stroke();

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
                context.beginPath();
                context.moveTo(
                    node.allCoord[j+1], 
                    ((node.y - (node.height/2))|0)
                );
                context.lineTo(
                    node.allCoord[j+1],
                    ((node.y + (node.height/2))|0)
                );
                context.stroke();
            }
        }

        this.#drawCorner(
            context,
            node.x - ((node.width)/2)|0,
            node.y - 1 - ((node.height/2)|0),
            node.height
        );

        this.#drawCorner(
            context,
            node.x + ((node.width)/2)|0,
            node.y - 1 - ((node.height/2)|0),
            node.height,
            false
        );
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {JNode} node 
     */
    static drawSwitch(context, node) {
        context.beginPath();
        context.moveTo(
            (node.x - ((node.width)/2))|0, 
            (node.y - (node.height/2))|0
        );
        context.lineTo(
            (node.x + ((node.width)/2))|0, 
            (node.y - (node.height/2))|0
        );
        context.stroke();

        context.beginPath();
        context.moveTo(
            (node.x - ((node.width)/2))|0, 
            (node.y + (node.height/2))|0
        );
        context.lineTo(
            (node.x + ((node.width)/2))|0,
            (node.y + (node.height/2))|0
        );
        context.stroke();

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
                context.beginPath();
                context.moveTo(
                    node.allCoord[j+1], 
                    node.y, 
                );
                context.lineTo(
                    node.allCoord[j+1], 
                    (node.y + (node.height/2))|0
                );
                context.stroke();
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

        this.#drawCorner(
            context,
            node.x - ((node.width)/2)|0,
            node.y - 1 - ((node.height/2)|0),
            node.height
        );

        this.#drawCorner(
            context,
            node.x + ((node.width)/2)|0,
            node.y - 1 - ((node.height/2)|0),
            node.height,
            false
        );

        context.beginPath();
        context.moveTo(
            node.x - (((node.width)/2) + this.txtHeight), 
            node.y
        );
        context.lineTo(
            node.x + (((node.width)/2) + this.txtHeight), 
            node.y
        );
        context.stroke();
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {Number} x
     * @param {Number} y 
     */
    static #drawArrow(context, x, y) {
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
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} height 
     * @param {Boolean} left 
     */
    static #drawCorner(context, x, y, height, left = true) {
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
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     */
    static #drawCircle(context, x, y, width) {
        context.beginPath();
        context.arc(x, y, (width/2)|0, 0, 2 * Math.PI);
        context.stroke();
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     */
    static #drawTriangle(context, x, y, width) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - (width*.9)|0, y + width);
        context.lineTo(x + (width*.9)|0, y + width);
        context.fill();
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} height 
     * @param {Boolean} left 
     */
    static #drawBracket(context, x, y, height, left = true) {
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
}