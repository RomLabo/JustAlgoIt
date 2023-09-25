/**
 * Abstract Class Shape.
 * @author RomLabo
 * @class Shape
 * Created on 16/09/2023.
 */
class Shape {
    #methodError = new Error("Method must be implemented.");
    constructor(canvas, x, y, txt) {
        if (this.constructor == Shape) {
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
        this._context.font = '16px arial';
        this._context.lineWidth = 2;
        this._symbol = new Image();
        this._symbol.src = "./assets/symboles.png";
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

    calculHeight(arrayOfTxt) {
        let height = 0;
        for (let i = 0; i < arrayOfTxt.length; i++) {
            if (arrayOfTxt[i].length > height) {
                height = arrayOfTxt[i].length;
            }
        }
        return (height + 1)*16;
    }

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

    calculWidth(arrayOfSize) {
        return arrayOfSize.reduce((a,b) => a + b, 0);
    }

    calculClickArea(arrayOfSize) {
        let clickArea = [];
        for (let i = 0; i < arrayOfSize.length; i++) {
            clickArea.push(arrayOfSize[i]);
        }
        return clickArea;
    }

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

    calculOutput(clickArea) {
        let output = []
        for (let i = 0; i < clickArea.length; i++) {
            output.push([]);
        }
        return output;
    }

    formatTxt(arrayOfTxt) {
        for (let i = 0; i < arrayOfTxt.length; i++) {
            arrayOfTxt[i] = arrayOfTxt[i].split('\n');
        }
        return arrayOfTxt;
    }

    drawLine(x1, y1, x2, y2) {
        this._context.beginPath();
        this._context.moveTo(x1, y1);
        this._context.lineTo(x2, y2);
        this._context.stroke();
    }

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

    draw() {
        throw this.#methodError;
    }

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

    majPos(x, y) {
        this.x = x;
        this.y = y;
    }

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

/**
 * Break
 * @class Break
 */
class Break extends Shape {
    constructor(canvas, x, y, txt) {
        super(canvas, x, y, txt);
        this.type = 203;
        this.height = 48;
        this.size = [46];
        this.width = 46;
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

/**
 * Condition
 * @class Condition
 */
class Condition extends Shape {
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
        let leftX = (((this.width)/2)|0);
        let halfHeight = ((this.height/2)|0);
        this._context.strokeRect(
            (this.x - leftX)|0, 
            (this.y - (this.height/2))|0, 
            this.width|0, 
            this.height
        );

        for (let j = 0; j < this.allCoord.length; j++) {
            for (let i = 0; i < this.txt[j].length; i++) {
                this._context.fillText(
                    `${this.txt[j][i]}`, 
                    (this.allCoord[j]+8)|0, 
                    ((this.y - halfHeight)|0) + 22 + (i * 16)
                );
            }
            if (j < this.allCoord.length -1) {
                this.drawLine(
                    this.allCoord[j+1],
                    ((this.y - halfHeight)|0), 
                    this.allCoord[j+1],
                    ((this.y + halfHeight)|0)
                );
            }
        }

        this.drawCorner(
            this.height,
            this.x - (leftX + 21),
            this.x + (leftX - 2),
            this.y
        );
    }
}

/**
 * Loop
 * @class Loop
 */
class Loop extends Shape {
    #leftTxtMargin;
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

        this.#leftTxtMargin = 27;                                            
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
                this.x + this.#leftTxtMargin,
                ((this.y - (this.height / 2))|0) + 22 + (i * 16)
            );
        }
    }
}

/**
 * Switch
 * @class Switch
 */
class Switch extends Shape {
    constructor(canvas, x, y, txt) {
        super(canvas, x, y, txt);
        this.type = 206;
        this.height = 64;
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
        let width = arrayOfSize.reduce((a,b) => a + b, 0) - arrayOfSize[arrayOfSize.length - 1];
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
        let leftX = (((this.width)/2)|0);
        let halfHeight = ((this.height/2)|0);
        this._context.strokeRect(
            (this.x - leftX)|0, 
            (this.y - (this.height/2))|0, 
            this.width,
            this.height
        );

        for (let j = 0; j < this.allCoord.length; j++) {
            for (let i = 0; i < this.txt[j].length; i++) {
                this._context.fillText(
                    `${this.txt[j][i]}`, 
                    this.allCoord[j]+8, 
                    this.y + 22 + (i * 16)
                );
            }
            if (j < this.allCoord.length -1) {
                this.drawLine(
                    this.allCoord[j+1], 
                    this.y, 
                    this.allCoord[j+1], 
                    this.y + halfHeight
                );
            }
        }

        for (let i = 0; i < this.txt[this.txt.length-1].length; i++) {
            this._context.fillText(
                `${this.txt[this.txt.length-1][i]}`, 
                this.x - (this.size[this.txt.length-1]/2|0) +8, 
                this.y - 10
            );
        }

        this.drawCorner(
            this.height,
            this.x - (leftX + 21),
            this.x + (leftX - 2),
            this.y
        );

        this.drawLine(
            (this.x - (leftX + 21))|0, 
            this.y, 
            (this.x + (leftX - 2) + 23)|0, 
            this.y
        );
    }
}

/**
 * Affectation
 * @class Affectation
 */
class Affectation extends Shape {
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
        let leftX = ((this.size[0])/2)|0;
        this._context.strokeRect(
            (this.x - leftX)|0, 
            (this.y - (this.height/2))|0, 
            (this.size[0])|0, 
            this.height
        );

        for (let i = 0; i < this.txt[0].length; i++) {
            this._context.fillText(
                `${this.txt[0][i]}`, 
                (this.x - leftX + 8)|0, 
                ((this.y - (this.height / 2))|0) + 22 + (i * 16)
            );
        }
    }
}

/**
 * Issue
 * @class Issue
 */
class Issue extends Shape {
    constructor(canvas, x, y, txt) {
        super(canvas, x, y, txt);
        this.type = 208;
        this.height = (this.txt[1].length + 1)*16;
        this.size = this.calculTxtSize(this.txt);
        this.width = this.size[1];
        this.clickArea = [this.size[1]];
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
        this.output = this.calculOutput(this.clickArea);
    }

    majTxt(txt) {
        this.txt = txt;
        this.height = (this.txt[1].length + 1)*16;
        this.size = this.calculTxtSize(this.txt);
        this.width = this.size[1];
        this.clickArea = [this.size[1]];
        this.allCoord = this.calculAllCoord(this.clickArea,
                                            this.width, this.x);
    }

    formatTxt(arrayOfTxt) {
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
        return arrayOfTxt;
    }

    draw() {
        let fisrtBracketPosX = ((this._symbolParam.leftBracket[2] *2) + this.size[0] + ((this.size[1])/2));
        let secondBracketPosX = (this._symbolParam.leftBracket[2] + ((this.size[1])/2));
        let thirdBracketPosX = ((this.size[1])/2);
        let fourBracketPosX = (this._symbolParam.leftBracket[2] + this.size[2] + ((this.size[1])/2));
        let dataPoxX = (this._symbolParam.leftBracket[2] + this.size[0] + ((this.size[1])/2));
        let resultPosX = (this._symbolParam.leftBracket[2] + ((this.size[1])/2));
        let leftX = [((this.size[1])/2)|0];

        if (this.size[0] > 0) {
            this.drawBrackets(
                this.height, 
                (this.x - fisrtBracketPosX)|0, 
                (this.x - secondBracketPosX)|0, 
                (this.y - (this.height/2))|0
            );
            for (let i = 0; i < this.txt[0].length; i++) {
                this._context.fillText(
                    `${this.txt[0][i]}`, 
                    (this.x - dataPoxX + 8)|0, 
                    (this.y - 10 + (i * 16))|0
                );
            }
        }

        this._context.strokeRect(
            (this.x - leftX[0])|0, 
            (this.y - (this.height/2))|0, 
            (this.size[1])|0, 
            this.height
        );

        for (let i = 0; i < this.txt[1].length; i++) {
            this._context.fillText(
                `${this.txt[1][i]}`, 
                (this.x - leftX[0] + 8)|0, 
                ((this.y - (this.height/2))|0) + 22 + (i * 16)
            );
        }

        if (this.size[2] > 0) {
            this.drawBrackets(
                this.height, 
                (this.x + thirdBracketPosX)|0, 
                (this.x + fourBracketPosX)|0, 
                (this.y - (this.height/2))|0
            );
            for (let i = 0; i < this.txt[2].length; i++) {
                this._context.fillText(
                    `${this.txt[2][i]}`, 
                    (this.x + resultPosX + 8)|0, 
                    (this.y - 10 + (i * 16))|0
                );
            }
        }
    }
}

/**
 * Link
 * @class Link
 */
class Link {
    #nbLink; #nbUnlink;
    #allLink; #allUnlink;
    #isInclude; #canvas;
    #context
    constructor(canvas) {
        // this.#canvas = canvas;
        this.#context = canvas.getContext("2d");
        this.#nbLink = 0;
        this.#nbUnlink = 0;
        this.#allLink = [];
        this.#allUnlink = [];
        this.#isInclude;
    }

    addLink(allElms, indexOfElm, indexOfClickArea) {
        this.#nbLink ++;
        this.#allLink.push([indexOfElm, indexOfClickArea]);

        if (this.#nbLink >= 2) {
            if (allElms[this.#allLink[0][0]].y > allElms[this.#allLink[1][0]].y) {
                this.#allLink.reverse();
            }
            this.#isInclude = false;
            for (let i = 0; i < allElms.length; i++) {
                for (let j = 0; j < allElms[i].output.length; j++) {
                    if (allElms[i].output[j].includes(this.#allLink[1][0])) {
                        this.#isInclude = true;
                    }
                }
            }
            if (!this.#isInclude && allElms[this.#allLink[0][0]].type !== 203 && allElms[this.#allLink[0][0]].type !== 207) {
                allElms[this.#allLink[0][0]].output[this.#allLink[0][1]].push(this.#allLink[1][0]);
                allElms[this.#allLink[0][0]].output[this.#allLink[0][1]].sort((a,b) => allElms[a].x - allElms[b].x);
            }
            this.#nbLink = 0;
            this.#allLink = [];
        }
    }

    removeLink(allElms, indexOfElm, indexOfClickArea) {
        this.#nbUnlink ++;
        this.#allUnlink.push([indexOfElm, indexOfClickArea]);
        if (this.#nbUnlink >= 2) {
            if (allElms[this.#allUnlink[0][0]].y > allElms[this.#allUnlink[1][0]].y) {
                this.#allUnlink.reverse();
            }
            let indexToRemove = allElms[this.#allUnlink[0][0]].output[this.#allUnlink[0][1]].indexOf(this.#allUnlink[1][0]);
            if (indexToRemove >= 0) {
                allElms[this.#allUnlink[0][0]].output[this.#allUnlink[0][1]].splice(indexToRemove, 1);
            }
            this.#nbUnlink = 0;
            this.#allUnlink = [];
        }
    }

    drawLine(xA, yA, xB, yB) {
        this.#context.beginPath();
        this.#context.moveTo(xA, yA);
        this.#context.lineTo(xB, yB);
        this.#context.stroke();
    }

    draw(allElms, elm) {
        for (let i = 0; i < elm.output.length; i++) {
            if (elm.output[i].length == 1) {
                // Décomposition simple
                this.drawLine((elm.allCoord[i] + (elm.clickArea[i]/2|0)) -2, elm.y + (elm.height/2|0) + 2,
                               allElms[elm.output[i][0]].x -2, allElms[elm.output[i][0]].y - (allElms[elm.output[i][0]].height / 2 | 0) - 2);
                if (elm.type !== 204 && elm.type !== 206) {
                    this.drawLine((elm.allCoord[i] + (elm.clickArea[i]/2|0)) +2, elm.y + (elm.height/2|0) + 2,
                                   allElms[elm.output[i][0]].x +2, allElms[elm.output[i][0]].y - (allElms[elm.output[i][0]].height / 2 | 0) - 2);
                }
            } else if (elm.output[i].length > 1){
                // Décomposition multiple
                if (elm.type === 204 || elm.type === 206) {
                    for (let j = 0; j < elm.output[i].length; j++) {
                        this.drawLine((elm.allCoord[i] + (elm.clickArea[i]/2 |0)), elm.y + (elm.height/2|0) +2,
                                       allElms[elm.output[i][j]].x, allElms[elm.output[i][j]].y - (allElms[elm.output[i][j]].height/2|0) - 2);
                    }
                } else {
                    this.drawLine((elm.allCoord[i] + (elm.clickArea[i]/2|0)) -2, elm.y + (elm.height/2|0) +2,
                                  (elm.allCoord[i] + (elm.clickArea[i]/2|0)) -2, elm.y + (elm.height/2|0) + 14);
                    this.drawLine((elm.allCoord[i] + (elm.clickArea[i]/2|0)) +2, elm.y + (elm.height/2|0) +2,
                                  (elm.allCoord[i] + (elm.clickArea[i]/2|0))+2, elm.y + (elm.height/2|0) + 14);
                    for (let j = 0; j < elm.output[i].length; j++) {
                        this.drawLine(allElms[elm.output[i][j]].x,elm.y + (elm.height/2|0) + 14,
                                      elm.x,elm.y + (elm.height/2|0) + 14);
                        this.drawLine(allElms[elm.output[i][j]].x, elm.y + (elm.height/2 |0) + 14,
                                      allElms[elm.output[i][j]].x, allElms[elm.output[i][j]].y - (allElms[elm.output[i][j]].height/2|0) - 2);
                    }
                }
            } 
        }
        
    }
}
