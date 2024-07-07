/*
0000000001 Author RomLabo 111111111
1000111000 Abstract Class JNode 111
1000000001 Created on 16/09/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

// Globals constants
const TYPE = Object.freeze(
    { BREAK: 0, CONDITION: 1, LOOP: 2,
    SWITCH: 3, ASSIGNMENT: 4, ISSUE: 5,
    NOTHING: 6 }
);

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

        this._type = null;
        this._height = null;
        this._width = null;
        this._size = null;
        this._clickArea = null;
        this._allCoord = null;
        this._output = null;

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

    get txtHeight() { return 0.02 * window.innerHeight }
    get txtTopMargin() { return 0.025 * window.innerHeight }
    get txtLeftMargin() { return 0.01 * window.innerHeight }

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
        return (height + 1)* this.txtHeight;
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
                arrayOfSize[i] += this.txtHeight;
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
        this.height = this.txtHeight*2.5|0;
        this.size = [this.txtHeight*2|0];
        this.width = this.txtHeight*2|0;
        this.clickArea = this.calculClickArea(this.size);
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
        this.output = this.calculOutput(this.clickArea);
    }

    majTxt(txt) {
        this.height = this.txtHeight*2.5|0;
        this.size = [this.txtHeight*2|0];
        this.width = this.txtHeight*2|0;
        this.clickArea = this.calculClickArea(this.size);
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
    }

    drawArrow(x, y) {
        this._context.beginPath();
        this._context.moveTo(x - 1, y - ((this.txtHeight*.7)|0));
        this._context.lineTo(x - 1, y + this.txtHeight);
        this._context.stroke();

        this._context.beginPath();
        this._context.moveTo(x - 1, y + ((this.txtHeight*1.25)|0));
        this._context.lineTo(
            x - 1 - (this.txtHeight/2)|0, 
            y + ((this.txtHeight*.7)|0)
        );
        this._context.lineTo(
            x - 1 + (this.txtHeight/2)|0, 
            y + ((this.txtHeight*.7)|0)
        );
        this._context.fill();
    }

    draw() {
        this.majTxt();

        this.drawArrow(
            this.x, this.y
        )

        this._context.strokeRect(
            (this.x - ((this.width)/2))|0, 
            (this.y - (this.height/2))|0, 
            this.width|0, 
            this.height
        );
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

    drawCorner(x, y, left = true) {
        this._context.beginPath();
        this._context.moveTo(x, y);
        this._context.lineTo(
            x - (left ? this.txtHeight : (-this.txtHeight)),
            y + (this.height/2)|0
        );
        this._context.lineTo(x, y + this.height);
        this._context.stroke();
    }

    draw() {
        this.majTxt(this.txt);  

        this._context.beginPath();
        this._context.moveTo(
            (this.x - ((this.width)/2))|0, 
            (this.y - (this.height/2))|0
        );
        this._context.lineTo(
            (this.x + ((this.width)/2))|0, 
            (this.y - (this.height/2))|0
        );
        this._context.stroke();

        this._context.beginPath();
        this._context.moveTo(
            (this.x - ((this.width)/2))|0, 
            (this.y + (this.height/2))|0
        );
        this._context.lineTo(
            (this.x + ((this.width)/2))|0,
            (this.y + (this.height/2))|0
        );
        this._context.stroke();

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
                this._context.beginPath();
                this._context.moveTo(
                    this.allCoord[j+1], 
                    ((this.y - (this.height/2))|0)
                );
                this._context.lineTo(
                    this.allCoord[j+1],
                    ((this.y + (this.height/2))|0)
                );
                this._context.stroke();
            }
        }

        this.drawCorner(
            this.x - ((this.width)/2)|0,
            this.y - 1 - ((this.height/2)|0)
        );

        this.drawCorner(
            this.x + ((this.width)/2)|0,
            this.y - 1 - ((this.height/2)|0),
            false
        );
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
        this.height = (this.txtHeight*3)|0;
        this.size = [this.height];
        this.width = this.height;
        this.clickArea = this.calculClickArea(this.size);
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
        this.output = this.calculOutput(this.clickArea);                                         
    }

    majTxt(txt) {
        this.txt = txt;
        this.height = (this.txtHeight*3)|0;
        this.size = [this.height];
        this.width = this.height;
        this.clickArea = this.calculClickArea(this.size);
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
    }

    drawCircle(x, y, width) {
        this._context.beginPath();
        this._context.arc(x, y, (width/2)|0, 0, 2 * Math.PI);
        this._context.stroke();
    }

    drawTriangle(x, y, width) {
        this._context.beginPath();
        this._context.moveTo(x, y);
        this._context.lineTo(x - (width*.9)|0, y + width);
        this._context.lineTo(x + (width*.9)|0, y + width);
        this._context.fill();
    }

    draw() {
        this.majTxt(this.txt);  

        this.drawCircle(
            this.x, this.y, 
            this.width, 
        )

        this.drawTriangle(
            this.x + ((this.width/2)|0), 
            this.y - (((this.width/2)*.6)/2|0),
            ((this.width/2)*.6)|0
        )
        
        for (let i = 0; i < this.txt[0].length; i++) {
            this._context.fillText(
                `${this.txt[0][i]}`, 
                this.x + ((this.width/2) + ((this.width/2)*.6))|0,
                (
                    (this.y - (((this.txt[0].length/2)|0) * (this.txtHeight + 2))) 
                     + (i * (this.txtHeight + 2))
                )
            );
        }
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
        this.height = this.calculHeight(this.txt)*2;
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

    drawCorner(x, y, left = true) {
        this._context.beginPath();
        this._context.moveTo(x, y);
        this._context.lineTo(
            x - (left ? this.txtHeight : (-this.txtHeight)),
            y + (this.height/2)|0
        );
        this._context.lineTo(x, y + this.height);
        this._context.stroke();
    }

    draw() {
        this.majTxt(this.txt); 

        this._context.beginPath();
        this._context.moveTo(
            (this.x - ((this.width)/2))|0, 
            (this.y - (this.height/2))|0
        );
        this._context.lineTo(
            (this.x + ((this.width)/2))|0, 
            (this.y - (this.height/2))|0
        );
        this._context.stroke();

        this._context.beginPath();
        this._context.moveTo(
            (this.x - ((this.width)/2))|0, 
            (this.y + (this.height/2))|0
        );
        this._context.lineTo(
            (this.x + ((this.width)/2))|0,
            (this.y + (this.height/2))|0
        );
        this._context.stroke();

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
                this._context.beginPath();
                this._context.moveTo(
                    this.allCoord[j+1], 
                    this.y, 
                );
                this._context.lineTo(
                    this.allCoord[j+1], 
                    (this.y + (this.height/2))|0
                );
                this._context.stroke();
            }
        }

        for (let i = 0; i < this.txt[this.txt.length-1].length; i++) {
            this._context.fillText(
                `${this.txt[this.txt.length-1][i]}`, 
                (
                    this.x - (this.size[this.txt.length-1]/2) 
                    + this.txtLeftMargin
                )|0, 
                (
                    this.y - this.txtTopMargin 
                    + (i * this.txtHeight)
                )
            );
        }

        this.drawCorner(
            (this.x - ((this.width)/2))|0, 
            (this.y - (this.height/2))|0, 
        )

        this.drawCorner(
            (this.x + ((this.width)/2))|0, 
            (this.y - (this.height/2))|0, 
            false
        )

        this._context.beginPath();
        this._context.moveTo(
            this.x - (((this.width)/2) + this.txtHeight), 
            this.y
        );
        this._context.lineTo(
            this.x + (((this.width)/2) + this.txtHeight), 
            this.y
        );
        this._context.stroke();
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

    draw() {
        this.majTxt(this.txt);

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
                    ((this.y - (this.height/2))|0) 
                    + this.txtTopMargin + (i * this.txtHeight)
                )
            );
        }
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

    drawBracket(x, y, left = true) {
        this._context.beginPath();
        this._context.moveTo(x, y);
        this._context.bezierCurveTo(
            x - (left ? -(this.txtHeight) : (this.txtHeight)), 
            y , x , y - (this.height*.49), 
            x - (left ? -(this.txtHeight) : this.txtHeight), 
            y - this.height/2
        );
        this._context.stroke();

        this._context.beginPath();
        this._context.moveTo(x, y);
        this._context.bezierCurveTo(
            x - (left ? -(this.txtHeight) : (this.txtHeight)), 
            y , x , y + (this.height*.49), 
            x - (left ? -this.txtHeight : this.txtHeight), 
            y + this.height/2
        );
        this._context.stroke();
    }

    draw() {
        this.majTxt(this.txt); 
        
        if (this.size[0] > 0) {
            this.drawBracket(
                (
                    this.x - ((this.txtHeight * 2 + this.txtLeftMargin) 
                    + this.size[0] + ((this.size[1])/2))
                )|0,
                this.y 
            )

            this.drawBracket(
                (
                    this.x - (this.txtHeight/2) - (((this.size[1])/2))
                )|0,
                this.y,
                false
            )
            
            for (let i = 0; i < this.txt[0].length; i++) {
                this._context.fillText(
                    `${this.txt[0][i]}`, 
                    (
                        this.x - ((this.txtHeight + this.txtLeftMargin)
                        + this.size[0] + ((this.size[1])/2)) 
                        + this.txtLeftMargin
                    )|0, 
                    (this.y - (this.txtTopMargin/2) + (i * this.txtHeight))|0
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
            this.drawBracket(
                (
                    this.x + ((this.txtHeight * 2 + this.txtLeftMargin) 
                    + this.size[2] + ((this.size[1])/2))
                )|0,
                this.y,
                false
            )

            this.drawBracket(
                (
                    this.x + (this.txtHeight/2) + (((this.size[1])/2))
                )|0,
                this.y
            )

            for (let i = 0; i < this.txt[2].length; i++) {
                this._context.fillText(
                    `${this.txt[2][i]}`, 
                    (
                        this.x + ((this.txtHeight + this.txtLeftMargin)
                        + ((this.size[1])/2)) + this.txtLeftMargin
                    )|0, 
                    (this.y - (this.txtTopMargin/2) + (i * this.txtHeight))|0
                );
            }
        }
    }
}