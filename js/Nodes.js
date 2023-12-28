/*
0000000001 Author RomLabo 111111111
1000111000 Abstract Class Node 1111
1000000001 Created on 16/09/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

// Globals constants
const SYMBOL_IMG = new Image();
SYMBOL_IMG.src = "./assets/symboles.png"; 

/**
 * @abstract Node
 * @description abstract parent class of 
 * the following classes, 
 * representing a node in the algorithm.
 */
class Node {
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
     * @description is used to calculate 
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
     * @description calculates the width 
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
     * @description is used to calculate 
     * the width of the node.
     * @param {Array} arrayOfSize 
     * @returns {Number} width
     */
    calculWidth(arrayOfSize) {
        return arrayOfSize.reduce((a,b) => a + b, 0);
    }

    /**
     * @description calculates the width of the click area.
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
     * @description is used to calculate the x-coordinates
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
     * @description calculates the number of sub-arrays 
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
     * @description separates character strings 
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
     * @description ...
     * @returns 
     */
    toString() {
        return {
            x: this.x,
            y: this.y,
            type: this.type,
            txt: this.txt,
            output: this.output
        };
    }

    /**
     * @description draws a line from 
     * point (x1,y1) to point (x2,y2).
     * @param {Number} x1 
     * @param {Number} y1 
     * @param {Number} x2 
     * @param {Number} y2 
     */
    drawLine(x1, y1, x2, y2) {
        this._context.beginPath();
        this._context.moveTo(x1, y1);
        this._context.lineTo(x2, y2);
        this._context.stroke();
    }

    /**
     * @description draws left corner 
     * and right corner from 
     * an image containing symbols.
     * @param {Number} height 
     * @param {Number} leftCornerX 
     * @param {Number} rightCornerX 
     * @param {Number} y 
     */
    drawCorner(height, leftCornerX, rightCornerX, y) {
        this._context.drawImage(
            this._symbol, 
            ...this._symbolParam.leftCorner, 
            leftCornerX|0, 
            (y - height/2)|0, 
            this._symbolParam.leftCorner[2],
            height
        );

        this._context.drawImage(
            this._symbol, 
            ...this._symbolParam.rightCorner, 
            rightCornerX|0, 
            (y - height/2)|0, 
            this._symbolParam.rightCorner[2],
            height
        );
    }

    /**
     * @description draws left bracket 
     * and right bracket from 
     * an image containing symbols.
     * @param {Number} height 
     * @param {Number} leftBracketX 
     * @param {Number} rightBracketX 
     * @param {Number} y 
     */
    drawBrackets(height, leftBracketX, rightBracketX, y) {
        this._context.drawImage(
            this._symbol, 
            ...this._symbolParam.leftBracket, 
            leftBracketX, 
            y, 
            this._symbolParam.leftBracket[2], 
            height
        );

        this._context.drawImage(
            this._symbol, 
            ...this._symbolParam.rightBracket, 
            rightBracketX, 
            y, 
            this._symbolParam.rightBracket[2], 
            height
        );
    }

    /**
     * @description is used to draw the node.
     * @warning this method is virtual 
     * and cannot be called from the parent class.
     */
    draw() {
        throw this.#methodError;
    }

    /**
     * @description uses a click event to determine 
     * whether it took place inside a node. 
     * If the click did not occur inside a node, 
     * this method returns -1, otherwise it 
     * returns the index of the click area concerned.
     * @param {Event} e 
     * @returns {Numbre} 
     */
    isClicked(e) {
        for (let j = 0; j < this.clickArea.length; j++) {
            if ((e.offsetX >= this.allCoord[j]) && 
                (e.offsetX <= (this.allCoord[j] + this.clickArea[j])) &&
                (e.offsetY >= (this.y - (this.height /2|0))) && 
                (e.offsetY <= (this.y + (this.height /2|0)))) {
                return j;
            } 
        }
        return -1;
    }

    /**
     * @description is used to update 
     * the node's (x,y) coordinates.
     * @param {Number} x 
     * @param {Number} y 
     */
    majPos(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @description updates the coordinates 
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
     * @description updates the text displayed 
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

/*
0000000001 Author RomLabo
1000111000 Class Break
1000000001 Created on 16/09/2023.
1000100011111000000001100001110000
1000110001111000110001100010101000
0000011000011000000001100011011000
*/

/**
 * @class Break 
 * @description Represents the node of 
 * an algorithm corresponding to a loop output.
 */
class Break extends Node {
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

    draw() {
        this._context.drawImage(
            this._symbol,
            ...this._symbolParam.break,
            (this.x - (this.size[0]/2|0)),
            (this.y - (this.height/2|0)),
            this.size[0],
            this.height
        );
    }
}

/*
0000000001 Author RomLabo
1000111000 Class Condition
1000000001 Created on 16/09/2023.
1000100011111000000001100001110000
1000110001111000110001100010101000
0000011000011000000001100011011000
*/

/**
 * @class Condition
 * @description Represents the node of 
 * an algorithm corresponding to a condition.
 */
class Condition extends Node {
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

    draw() {
        this._context.strokeRect(
            (this.x - ((this.width)/2))|0, 
            (this.y - (this.height/2))|0, 
            this.width|0, 
            this.height
        );

        for (let j = 0; j < this.allCoord.length; j++) {
            for (let i = 0; i < this.txt[j].length; i++) {
                this._context.fillText(
                    `${this.txt[j][i]}`, 
                    (this.allCoord[j] + this.txtLeftMargin)|0, 
                    (((this.y - (this.height/2))|0) 
                        + this.txtTopMargin 
                        + (i * this.txtHeight)
                    )
                );
            }
            if (j < this.allCoord.length -1) {
                this.drawLine(
                    this.allCoord[j+1],
                    ((this.y - (this.height/2))|0), 
                    this.allCoord[j+1],
                    ((this.y + (this.height/2))|0)
                );
            }
        }

        this.drawCorner(
            this.height,
            (this.x - (((this.width)/2) 
                + (this.symbolParam.leftCorner[2] - 2))
            ),
            this.x + (((this.width)/2) - 2),
            this.y
        );
    }
}

/*
0000000001 Author RomLabo
1000111000 Class Loop
1000000001 Created on 16/09/2023.
1000100011111000000001100001110000
1000110001111000110001100010101000
0000011000011000000001100011011000
*/

/**
 * @class Loop
 * @description Represents the node of 
 * an algorithm corresponding to a loop.
 */
class Loop extends Node {
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

    draw() {
        this._context.drawImage(
            this._symbol, 
            ...this._symbolParam.loop, 
            this.x - (this.size[0]/2)|0, 
            this.y - (this.height/2)|0, 
            this.size[0], 
            this.height
        );
        
        for (let i = 0; i < this.txt[0].length; i++) {
            this._context.fillText(
                `${this.txt[0][i]}`, 
                this.x + this.symbolParam.loop[3],
                (((this.y - (this.height/2))|0) 
                    + this.txtTopMargin 
                    + (i * this.txtHeight)
                )
            );
        }
    }
}

/*
0000000001 Author RomLabo
1000111000 Class Switch
1000000001 Created on 16/09/2023.
1000100011111000000001100001110000
1000110001111000110001100010101000
0000011000011000000001100011011000
*/

/**
 * @class Switch
 * @description Represents the node of 
 * an algorithm corresponding to a switch.
 */
class Switch extends Node {
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
    }
}

/*
0000000001 Author RomLabo
1000111000 Class Assignment
1000000001 Created on 16/09/2023.
1000100011111000000001100001110000
1000110001111000110001100010101000
0000011000011000000001100011011000
*/

/**
 * @class Assignment
 * @description Represents the node of 
 * an algorithm corresponding to an assignment.
 */
class Assignment extends Node {
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

    draw() {
        this._context.strokeRect(
            (this.x - ((this.size[0])/2))|0, 
            (this.y - (this.height/2))|0, 
            (this.size[0])|0, 
            this.height
        );

        for (let i = 0; i < this.txt[0].length; i++) {
            this._context.fillText(
                `${this.txt[0][i]}`, 
                (
                    this.x - ((this.size[0])/2) 
                    + this.txtLeftMargin
                )|0, 
                (
                    (this.y - (this.height/2))|0) 
                    + this.txtTopMargin + (i * this.txtHeight
                )
            );
        }
    }
}

/*
0000000001 Author RomLabo
1000111000 Class Issue
1000000001 Created on 16/09/2023.
1000100011111000000001100001110000
1000110001111000110001100010101000
0000011000011000000001100011011000
*/

/**
 * @class Issue
 * @description Represents the node of 
 * an algorithm corresponding to an issue.
 */
class Issue extends Node {
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
    }
}