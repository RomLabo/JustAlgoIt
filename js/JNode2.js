/*
0000000001 Author RomLabo 111111111
1000111000 Abstract Class JNode 111
1000000001 Created on 16/09/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

// Globals constants
const SYMBOL_IMG = new Image();
SYMBOL_IMG.src = "./assets/symboles.png"; 

/**
 * @abstract JNode
 * @description Abstract parent class of 
 * the following classes, 
 * representing a node in the algorithm.
 */
class JNode {
    // Private properties
    #methodError = new Error("Method must be implemented.");

    /**
     * @param {HTMLCanvasElement} canvas 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Array} txt // Array of string 
     */
    constructor(canvas, x, y, txt) {
        if (this.constructor == Node) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this._x = x??0;
        this._y = y??0;
        this._txt = this.formatTxt(txt);

        this._type;
        this._height;
        this._width;
        this._size;
        this._clickArea;
        this._allCoord;
        this._output;

        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');
        this._context.font = '16px verdana';
        this._context.lineWidth = 2;

        this._txtHeight = 16;
        this._txtTopMargin = 22;
        this._txtLeftMargin = 8;

        this._symbol = SYMBOL_IMG;
        this._symbolParam = {
            // [posX, posY, width, heigth]
            leftBracket: [0,0,23,64],
            rightBracket: [23,0,23,64],
            loop: [88, 0, 46, 36],
            break: [0,65,46,64],
            leftCorner: [92, 65, 23, 64],
            rightCorner: [115, 65, 23, 64]
        }
    }

    get x() { return this._x }
    set x(x) { this._x = x }

    get y() { return this._y }
    set y(y) { this._y = y }

    get txt() { return this._txt }
    set txt(val) { this._txt = this.formatTxt(val) }

    get type() { return this._type }
    set type(type) { this._type = type }

    get height() { return this._height }
    set height(val) { this._height = val }

    get width() { return this._width }
    set width(val) { this._width = val }

    get size() { return this._size }
    set size(val) { this._size = val }

    get clickArea() { return this._clickArea }
    set clickArea(val) { this._clickArea = val }
    
    get allCoord() { return this._allCoord }
    set allCoord(val) { this._allCoord = val }

    get output() { return this._output }
    set output(val) { this._output = val }

    get txtHeight() { return this._txtHeight }
    get txtTopMargin() { return this._txtTopMargin }
    get txtLeftMargin() { return this._txtLeftMargin }

    get symbolParam() { return this._symbolParam }

    /**
     * @description Is used to calculate 
     * the height of the node.
     * @param {Array} arrayOfTxt 
     * @returns {Number} height of node
     */
    calculHeight(arrayOfTxt) {
        let height = 0;
        for (let i = 0; i < arrayOfTxt.length; i++) {
            if (arrayOfTxt[i].length > height) {
                height = arrayOfTxt[i].length;
            }
        }
        return (height + 1)*16;
    }

    /**
     * @description Calculates the width 
     * of each piece of text.
     * @param {Array} arrayOfTxt 
     * @returns {Array} arrayOfSize
     */
    calculTxtSize(arrayOfTxt) {
        let arrayOfSize = [];
        for (let i = 0; i < arrayOfTxt.length; i++) {
            arrayOfSize.push(0);
            for (let z = 0; z < arrayOfTxt[i].length; z++) {
                if (this._context.measureText(arrayOfTxt[i][z]).width > arrayOfSize[i]) {
                    arrayOfSize[i] = (this._context.measureText(arrayOfTxt[i][z]).width)|0;
                }
            }
            if (arrayOfSize[i] > 0) {
                arrayOfSize[i] += 16
            }
        }
        return arrayOfSize;
    }

    /**
     * @description Is used to calculate 
     * the width of the node.
     * @param {Array} arrayOfSize 
     * @returns {Number} width
     */
    calculWidth(arrayOfSize) {
        return arrayOfSize.reduce((a,b) => a + b, 0);
    }

    /**
     * @description Calculates the width of the click area.
     * @param {Array} arrayOfSize 
     * @returns {Array} Array of clickArea size
     */
    calculClickArea(arrayOfSize) {
        let clickArea = [];
        for (let i = 0; i < arrayOfSize.length; i++) {
            clickArea.push(arrayOfSize[i]);
        }
        return clickArea;
    }

    /**
     * @description Is used to calculate the x-coordinates
     * for each click area.
     * @param {Array} clickArea 
     * @param {Number} width 
     * @param {Number} posX 
     * @returns {Array} Array of x-coordinates.
     */
    calculAllCoord(clickArea, width, posX) {
        let allCoord = [];
        for (let i = 0; i < clickArea.length; i++) {
            if (i === 0) {
                allCoord.push(posX - (width/2|0));
            } else {
                allCoord.push(allCoord[i - 1] + clickArea[i - 1]);
            }
        }
        return allCoord;
    }

    /**
     * @description Calculates the number of sub-arrays 
     * containing the indexes of each child node 
     * with which there is a link, 
     * as a function of the number of click areas.
     * @param {Array} clickArea 
     * @returns {Array} output
     */
    calculOutput(clickArea) {
        let output = []
        for (let i = 0; i < clickArea.length; i++) {
            output.push([]);
        }
        return output;
    }

    /**
     * @description Separates character strings 
     * containing a line break.
     * @param {Array} arrayOfTxt 
     * @returns {Array} arrayOfTxt
     */
    formatTxt(arrayOfTxt) {
        if (typeof arrayOfTxt[0] === "string") {
            for (let i = 0; i < arrayOfTxt.length; i++) {
                arrayOfTxt[i] = arrayOfTxt[i].split('\n');
            }   
        }
        return arrayOfTxt;
    }

    /**
     * @description Returns as a literal object
     * @returns {Object}
     */
    toLitteralObj() {
        return {
            x: this.x,
            y: this.y,
            t: this.type,
            tx: this.txt,
            o: this.output
        };
    }

    /**
     * @description Uses a click event to determine 
     * whether it took place inside a node. 
     * If the click did not occur inside a node, 
     * this method returns -1, otherwise it 
     * returns the index of the click area concerned.
     * @param {Event} e 
     * @returns {Number} 
     */
    isClicked(e) {
        for (let j = 0; j < this.clickArea.length; j++) {
            if ((e.offsetX >= this.allCoord[j]) && 
                (e.offsetX <= (this.allCoord[j] + this.clickArea[j])) &&
                (e.offsetY >= (this.y - (this.height /2|0))) && 
                (e.offsetY <= (this.y + (this.height /2|0)))) {
                    console.log(j);
                return j;
            } 
        }
        return -1;
    }

    /**
     * @description Is used to update 
     * the node's (x,y) coordinates.
     * @param {Number} x 
     * @param {Number} y 
     */
    majPos(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @description Updates the coordinates 
     * of each click area.
     */
    majCoord() {
        this._allCoord = [];
        for (let i = 0; i < this._clickArea.length; i++) {
            if (i === 0) {
                this._allCoord.push(this._x - (this._width / 2 | 0))
            } else {
                this._allCoord.push(this._allCoord[i - 1] + this._clickArea[i - 1])
            }
        }
    }

    /**
     * @description Updates the text displayed 
     * on the node, updating the height, 
     * width, size, click areas and their coordinates.
     * @param {Array} txt 
     */
    majTxt(txt) {
        this.txt = txt;
        this.height = this.calculHeight(this.txt);
        this.size = this.calculTxtSize(this.txt);
        this.width = this.calculWidth(this.size);
        this.clickArea = this.calculClickArea(this.size);
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
    }
}

class Node {
    static canvas = document.getElementById('main-canvas');
    static context = this.canvas.getContext('2d');
    
    static txtHeight = 16;
    static txtTopMargin = 22;
    static txtLeftMargin = 8;

    static symbol = SYMBOL_IMG;
    static symbolParam = {
        // [posX, posY, width, heigth]
        leftBracket: [0,0,23,64],
        rightBracket: [23,0,23,64],
        loop: [88, 0, 46, 36],
        break: [0,65,46,64],
        leftCorner: [92, 65, 23, 64],
        rightCorner: [115, 65, 23, 64]
    }

    static drawLine(x1, y1, x2, y2) {
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
    }

    static drawCorner(height, leftCornerX, rightCornerX, y) {
        this.context.drawImage(
            this.symbol, 
            ...this.symbolParam.leftCorner, 
            leftCornerX|0, 
            (y - height/2)|0, 
            this.symbolParam.leftCorner[2],
            height
        );

        this.context.drawImage(
            this.symbol, 
            ...this.symbolParam.rightCorner, 
            rightCornerX|0, 
            (y - height/2)|0, 
            this.symbolParam.rightCorner[2],
            height
        );
    }

    static drawBrackets(height, leftBracketX, rightBracketX, y) {
        this.context.drawImage(
            this.symbol, 
            ...this.symbolParam.leftBracket, 
            leftBracketX, 
            y, 
            this.symbolParam.leftBracket[2], 
            height
        );

        this.context.drawImage(
            this.symbol, 
            ...this.symbolParam.rightBracket, 
            rightBracketX, 
            y, 
            this.symbolParam.rightBracket[2], 
            height
        );
    }

    static drawBreak(node) {
        this.context.drawImage(
            this.symbol,
            ...this.symbolParam.break,
            (node.x - (node.size[0]/2|0)),
            (node.y - (node.height/2|0)),
            node.size[0],
            node.height
        );
    }

    static drawCondition(node) {
        this.context.strokeRect(
            (node.x - ((node.width)/2))|0, 
            (node.y - (node.height/2))|0, 
            node.width|0, 
            node.height
        );

        for (let j = 0; j < node.allCoord.length; j++) {
            for (let i = 0; i < node.txt[j].length; i++) {
                this.context.fillText(
                    `${node.txt[j][i]}`, 
                    (node.allCoord[j] + this.txtLeftMargin)|0, 
                    (((node.y - (node.height/2))|0) 
                        + this.txtTopMargin 
                        + (i * this.txtHeight)
                    )
                );
            }
            if (j < node.allCoord.length -1) {
                this.drawLine(
                    node.allCoord[j+1],
                    ((node.y - (node.height/2))|0), 
                    node.allCoord[j+1],
                    ((node.y + (node.height/2))|0)
                );
            }
        }

        this.drawCorner(
            node.height,
            (node.x - (((node.width)/2) 
                + (this.symbolParam.leftCorner[2] - 2))
            ),
            node.x + (((node.width)/2) - 2),
            node.y
        );
    }

    static drawLoop(node) {
        this.context.drawImage(
            this.symbol, 
            ...this.symbolParam.loop, 
            node.x - (node.size[0]/2)|0, 
            node.y - (node.height/2)|0, 
            node.size[0], 
            node.height
        );
        
        for (let i = 0; i < node.txt[0].length; i++) {
            this.context.fillText(
                `${node.txt[0][i]}`, 
                node.x + this.symbolParam.loop[3],
                (((node.y - (node.height/2))|0) 
                    + this.txtTopMargin 
                    + (i * this.txtHeight)
                )
            );
        }
    }

    static drawAssignment(node) {
        this.context.strokeRect(
            (node.x - ((node.size[0])/2))|0, 
            (node.y - (node.height/2))|0, 
            (node.size[0])|0, 
            node.height
        );

        for (let i = 0; i < node.txt[0].length; i++) {
            this.context.fillText(
                `${node.txt[0][i]}`, 
                (
                    node.x - ((node.size[0])/2) 
                    + this.txtLeftMargin
                )|0, 
                (
                    (node.y - (node.height/2))|0) 
                    + this.txtTopMargin + (i * this.txtHeight
                )
            );
        }
    }

    static draw(node) {
        switch (node.type) {
            case 208: break;
            case 207: this.drawAssignment(node); break;
            case 206: break;
            case 205: this.drawLoop(node); break;
            case 204: this.drawCondition(node); break;
            default: this.drawBreak(node); break;
        }
    }
}

/*
0000000001 Author RomLabo 111111111
1000111000 Class Break 111111111111
1000000001 Created on 16/09/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class Break 
 * @description Represents the node of 
 * an algorithm corresponding to a loop output.
 * @extends JNode
 */
class Break extends JNode {
    /**
     * Create a break.
     * @param {HTMLCanvasElement} canvas 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Array} txt 
     */
    constructor(canvas, x, y, txt) {
        super(canvas, x, y, txt);
        this.type = 203;
        this.height = this.symbolParam.break[2] + 2;
        this.size = [this.symbolParam.break[2]];
        this.width = this.symbolParam.break[2];
        this.clickArea = this.calculClickArea(this.size);
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
        this.output = this.calculOutput(this.clickArea);
    }

    majTxt(txt) { return }
}


/*
0000000001 Author RomLabo 111111111
1000111000 Class Condition 11111111
1000000001 Created on 16/09/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class Condition
 * @description Represents the node of 
 * an algorithm corresponding to a condition.
 * @extends JNode
 */
class Condition extends JNode {
    /**
     * Create a condition.
     * @param {HTMLCanvasElement} canvas 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Array} txt 
     */
    constructor(canvas, x, y, txt) {
        super(canvas, x, y, txt);
        this.type = 204;
        this.height = this.calculHeight(this.txt);
        this.size = this.calculTxtSize(this.txt);
        this.width = this.calculWidth(this.size);
        this.clickArea = this.calculClickArea(this.size);
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
        this.output = this.calculOutput(this.clickArea);
    }

    
}

/*
0000000001 Author RomLabo 111111111
1000111000 Class Loop 1111111111111
1000000001 Created on 16/09/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class Loop
 * @description Represents the node of 
 * an algorithm corresponding to a loop.
 * @extends JNode
 */
class Loop extends JNode {
    /**
     * Create a loop.
     * @param {HTMLCanvasElement} canvas 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Array} txt 
     */
    constructor(canvas, x, y, txt) {
        super(canvas, x, y, txt);
        this.type = 205;
        this.height = 36;
        this.size = [46];
        this.width = 46;
        this.clickArea = this.calculClickArea(this.size);
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
        this.output = this.calculOutput(this.clickArea);                                         
    }

    majTxt(txt) {
        this.txt = txt;
    }
}

/*
0000000001 Author RomLabo 111111111
1000111000 Class Switch 11111111111
1000000001 Created on 16/09/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class Switch
 * @description Represents the node of 
 * an algorithm corresponding to a switch.
 * @extends JNode
 */
class Switch extends JNode {
    /**
     * Create a switch
     * @param {HTMLCanvasElement} canvas 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Array} txt 
     */
    constructor(canvas, x, y, txt) {
        super(canvas, x, y, txt);
        this.type = 206;
        this.height = this.symbolParam.leftCorner[3];
        this.size = this.calculTxtSize(this.txt);
        this.width = this.calculWidth(this.size);
        this.clickArea = this.calculClickArea(this.size);
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
        this.output = this.calculOutput(this.clickArea);
    }

    majTxt(txt) {
        this.txt = txt;
        this.size = this.calculTxtSize(this.txt);
        this.width = this.calculWidth(this.size);
        this.clickArea = this.calculClickArea(this.size);
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
    }

    calculWidth(arrayOfSize) {
        let width = (
            arrayOfSize.reduce((a,b) => a + b, 0) 
            - arrayOfSize[arrayOfSize.length - 1]
        );

        if (arrayOfSize[arrayOfSize.length - 1] > width) {
            width = arrayOfSize[arrayOfSize.length - 1];
        }
        return width;
    }

    calculClickArea(arrayOfSize) {
        let clickArea = [];
        for (let i = 0; i < arrayOfSize.length -1; i++) {
            clickArea.push(arrayOfSize[i])
        }
        return clickArea;
    }
    /*
    draw() {
        this._context.strokeRect(
            (this.x - ((this.width)/2))|0, 
            (this.y - (this.height/2))|0, 
            this.width,
            this.height
        );

        for (let j = 0; j < this.allCoord.length; j++) {
            for (let i = 0; i < this.txt[j].length; i++) {
                this._context.fillText(
                    `${this.txt[j][i]}`, 
                    this.allCoord[j] + this.txtLeftMargin, 
                    (
                        this.y + this.txtTopMargin 
                        + (i * this.txtHeight)
                    )
                );
            }
            if (j < this.allCoord.length -1) {
                this.drawLine(
                    this.allCoord[j+1], 
                    this.y, 
                    this.allCoord[j+1], 
                    (this.y + (this.height/2))|0
                );
            }
        }

        for (let i = 0; i < this.txt[this.txt.length-1].length; i++) {
            this._context.fillText(
                `${this.txt[this.txt.length-1][i]}`, 
                (
                    this.x - (this.size[this.txt.length-1]/2) 
                    + this.txtLeftMargin
                )|0, 
                this.y - 10
            );
        }

        this.drawCorner(
            this.height,
            (
                this.x - (((this.width)/2) 
                + this.symbolParam.leftCorner[2] - 2)
            ),
            this.x + (((this.width)/2) - 2),
            this.y
        );

        this.drawLine(
            (
                this.x - (((this.width)/2) 
                + this.symbolParam.leftCorner[2] - 2)
            )|0, 
            this.y, 
            (
                this.x + ((this.width)/2) 
                + this.symbolParam.leftCorner[2] - 2
            )|0, 
            this.y
        );
    }*/
}

/*
0000000001 Author RomLabo 111111111
1000111000 Class Assignment 1111111
1000000001 Created on 16/09/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class Assignment
 * @description Represents the node of 
 * an algorithm corresponding to an assignment.
 * @extends JNode
 */
class Assignment extends JNode {
    /**
     * Create an assignment
     * @param {HTMLCanvasElement} canvas 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Array} txt 
     */
    constructor(canvas, x, y, txt) {
        super(canvas, x, y, txt);
        this.type = 207;
        this.height = this.calculHeight(this.txt);
        this.size = this.calculTxtSize(this.txt);
        this.width = this.calculWidth(this.size);
        this.clickArea = this.calculClickArea(this.size);
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
        this.output = this.calculOutput(this.clickArea);
    }
}

/*
0000000001 Author RomLabo 111111111
1000111000 Class Issue 111111111111
1000000001 Created on 16/09/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class Issue
 * @description Represents the node of 
 * an algorithm corresponding to an issue.
 * @extends JNode
 */
class Issue extends JNode {
    /**
     * Create an issue.
     * @param {HTMLCanvasElement} canvas 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Array} txt 
     */
    constructor(canvas, x, y, txt) {
        super(canvas, x, y, txt);
        this.type = 208;
        this.height = (this.txt[1].length + 1) * this.txtHeight;
        this.size = this.calculTxtSize(this.txt);
        this.width = this.size[1];
        this.clickArea = [this.size[1]];
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
        this.output = this.calculOutput(this.clickArea);
    }

    majTxt(txt) {
        this.txt = txt;
        this.height = (this.txt[1].length + 1) * this.txtHeight;
        this.size = this.calculTxtSize(this.txt);
        this.width = this.size[1];
        this.clickArea = [this.size[1]];
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
    }

    formatTxt(arrayOfTxt) {
        if (typeof arrayOfTxt[0] === "string") {
            for (let i = 0; i < arrayOfTxt.length; i++) {
                if (i == 1) {
                    arrayOfTxt[i] = arrayOfTxt[i].split('\n');
                } else {
                    arrayOfTxt[i] = arrayOfTxt[i].split(' ');
                    if (arrayOfTxt[i].length > 3) {
                        let txtFormated = arrayOfTxt[i].splice(0, 3);
                        let j = 0;
                        for (let z = 0; z < arrayOfTxt[i].length; z++) {
                            j == 3 ? j = 1 : j++;
                            txtFormated[j - 1] = txtFormated[j - 1].concat(' ', arrayOfTxt[i][z]);
                        }
                        arrayOfTxt[i] = txtFormated;
                    }
                } 
            }      
        }
        return arrayOfTxt;
    }
    /*
    draw() {
        if (this.size[0] > 0) {
            this.drawBrackets(
                this.height, 
                (
                    this.x - ((this.symbolParam.leftBracket[2] * 2) 
                    + this.size[0] + ((this.size[1])/2))
                )|0, 
                (
                    this.x - (this.symbolParam.leftBracket[2] 
                    + ((this.size[1])/2))
                )|0, 
                (this.y - (this.height/2))|0
            );
            for (let i = 0; i < this.txt[0].length; i++) {
                this._context.fillText(
                    `${this.txt[0][i]}`, 
                    (
                        this.x - (this.symbolParam.leftBracket[2] 
                        + this.size[0] + ((this.size[1])/2)) 
                        + this.txtLeftMargin
                    )|0, 
                    (this.y - 10 + (i * this.txtHeight))|0
                );
            }
        }

        this._context.strokeRect(
            (this.x - ((this.size[1])/2))|0, 
            (this.y - (this.height/2))|0, 
            (this.size[1])|0, 
            this.height
        );

        for (let i = 0; i < this.txt[1].length; i++) {
            this._context.fillText(
                `${this.txt[1][i]}`, 
                (this.x - ((this.size[1])/2) + this.txtLeftMargin)|0, 
                (
                    this.y - (this.height/2)
                    + this.txtTopMargin + (i * this.txtHeight)
                )|0
            );
        }

        if (this.size[2] > 0) {
            this.drawBrackets(
                this.height, 
                (this.x + (this.size[1])/2)|0, 
                (
                    this.x + (this.symbolParam.leftBracket[2] 
                    + this.size[2] + ((this.size[1])/2))
                )|0, 
                (this.y - (this.height/2))|0
            );
            for (let i = 0; i < this.txt[2].length; i++) {
                this._context.fillText(
                    `${this.txt[2][i]}`, 
                    (
                        this.x + (this.symbolParam.leftBracket[2] 
                        + ((this.size[1])/2)) + this.txtLeftMargin
                    )|0, 
                    (this.y - 10 + (i * this.txtHeight))|0
                );
            }
        }
    }*/
}