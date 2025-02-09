/*
0000000001 Author RomLabo 111111111
1000111000 Abstract Class JNode 111
1000000001 Created on 16/09/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * Globals constants
 */
const TYPE = Object.freeze({ 
    BREAK: 0, CONDITION: 1, LOOP: 2,
    SWITCH: 3, ASSIGNMENT: 4, ISSUE: 5,
    NOTHING: 6 
});

const TXT_TYPE = [
    "break", "condition", "loop", 
    "switch", "assignment", "issue"
];

/**
 * @abstract JNode
 * @description Abstract parent class of 
 * the following classes, 
 * representing a node in the algorithm.
 */
class JNode {
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

        this._type = null;
        this._height = null;
        this._width = null;
        this._size = null;
        this._clickArea = null;
        this._allCoord = null;
        this._output = null;

        /* TODO: a effacer */
        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');
        this._context.font = '2vh verdana';
        this._context.lineWidth = 2;
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
        return Math.round(
            (height + 1)* JDrawUtility.txtHeight
        );
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
                arrayOfSize[i] += JDrawUtility.txtHeight;
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
        return Math.round(
            arrayOfSize.reduce((a,b) => a + b, 0)
        );
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
     * @description Returns a deep copy of 
     * the txt array.
     * @returns {Array<Array<String>>} 
     */
    deepCopyTxt() {
        let txt = [];
        for (let i = 0; i < this.txt.length; i++) {
            txt.push([]);
            for (let j = 0; j < this.txt[i].length; j++) {
                txt[txt.length - 1].push(this.txt[i][j]);
            }
        }
        return txt;
    }

    /**
     * @description Returns a deep copy of 
     * the output array.
     * @returns {Array<Array<Number>>} 
     */
    deepCopyOutput() {
        let out = [];
        for (let i = 0; i < this.output.length; i++) {
            out.push([]);
            for (let j = 0; j < this.output[i].length; j++) {
                out[out.length - 1].push(this.output[i][j]);
            }
        }
        return out;
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
            tx: this.deepCopyTxt(),
            o: this.deepCopyOutput()
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
        let j = 0,find = false;
        while (find === false && j < this.clickArea.length) {
            if ((e.offsetX >= this.allCoord[j]) && 
                (e.offsetX <= (this.allCoord[j] + this.clickArea[j])) &&
                (e.offsetY >= (this.y - (this.height /2|0))) && 
                (e.offsetY <= (this.y + (this.height /2|0)))) {
                find = true;
            } else { j ++; }
        }
        return find ? j : -1;
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
        this.type = TYPE.BREAK;
        this.height = JDrawUtility.txtHeight*2.5|0;
        this.size = [JDrawUtility.txtHeight*2|0];
        this.width = JDrawUtility.txtHeight*2|0;
        this.clickArea = this.calculClickArea(this.size);
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
        this.output = this.calculOutput(this.clickArea);
    }

    majTxt(txt) {
        this.height = JDrawUtility.txtHeight*2.5|0;
        this.size = [JDrawUtility.txtHeight*2|0];
        this.width = JDrawUtility.txtHeight*2|0;
        this.clickArea = this.calculClickArea(this.size);
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
    }
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
        this.type = TYPE.CONDITION;
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
        this.type = TYPE.LOOP;
        this.height = (JDrawUtility.txtHeight*3)|0;
        this.size = [this.height];
        this.width = this.height;
        this.clickArea = this.calculClickArea(this.size);
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
        this.output = this.calculOutput(this.clickArea);                                         
    }

    majTxt(txt) {
        this.txt = txt;
        this.height = (JDrawUtility.txtHeight*3)|0;
        this.size = [this.height];
        this.width = this.height;
        this.clickArea = this.calculClickArea(this.size);
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
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
        this.type = TYPE.SWITCH;
        this.height = this.calculHeight(this.txt);
        this.size = this.calculTxtSize(this.txt);
        this.width = this.calculWidth(this.size);
        this.clickArea = this.calculClickArea(this.size);
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
        this.output = this.calculOutput(this.clickArea);
    }

    calculHeight(arrayOfTxt) {
        let height = 0;
        for (let i = 0; i < arrayOfTxt.length - 1; i++) {
            if (arrayOfTxt[i].length > height) {
                height = arrayOfTxt[i].length;
            }
        }
        height += arrayOfTxt[arrayOfTxt.length - 1].length;
        return Math.round(
            (height * JDrawUtility.txtHeight) + 
            ((height - 1) * JDrawUtility.txtTopMargin)
        );
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
        return Math.round(width);
    }

    calculClickArea(arrayOfSize) {
        let clickArea = [];
        for (let i = 0; i < arrayOfSize.length -1; i++) {
            clickArea.push(arrayOfSize[i])
        }
        return clickArea;
    }
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
        this.type = TYPE.ASSIGNMENT;
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
        this.type = TYPE.ISSUE;
        this.height = Math.round((this.txt[1].length + 1) * JDrawUtility.txtHeight);
        this.size = this.calculTxtSize(this.txt);
        this.width = Math.round(this.size[1]);
        this.clickArea = [Math.round(this.size[1])];
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
        this.output = this.calculOutput(this.clickArea);
    }

    majTxt(txt) {
        this.txt = txt;
        this.height = Math.round((this.txt[1].length + 1) * JDrawUtility.txtHeight);
        this.size = this.calculTxtSize(this.txt);
        this.width = Math.round(this.size[1]);
        this.clickArea = [Math.round(this.size[1])];
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
}