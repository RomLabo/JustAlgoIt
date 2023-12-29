/*
0000000001 Author RomLabo 111111111
1000111000 Class Model 111111111111
1000000001 Created on 29/12/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class Model
 * @description ...
 */
class Model {
    constructor() {
        this.canvas = document.getElementById('main-canvas');
        this.context = this.canvas.getContext('2d');
        this.allAlgo = [new Algo(this.canvas, "algo_1")];
        this.idx = 0;
        this.changeHasBeenMade = false;

        this.intervale = setInterval(() => {
            if (this.changeHasBeenMade) {
                this.eraseCanvas();
                this.currentAlgo.draw();
                this.changeHasBeenMade = false;
            }
        }, 100);
    }

    get currentAlgo() { return this.allAlgo[this.idx] }

    /**
     * @description changes the colour used for 
     * drawing in the canvas.
     * @param {String} color // hexa code of colour
     */
    changeColor(color) {
        this.context.fillStyle = color;
        this.context.strokeStyle = color;
    }

    /**
     * @description deletes the entire canvas.
     */
    eraseCanvas() {
        this.changeColor("#161b22");
        this.context.fillRect(
            0, 0, 
            this.canvas.width, 
            this.canvas.height
        );
        this.changeColor("#ffffff");
    }

    /**
     * @description ...
     * @param {*} type 
     * @param {*} txt 
     */
    add(type, txt) {
        this.currentAlgo.createNode(
            type,
            [
                this.canvas,this.canvas.width/2,
                this.canvas.height/2,txt
            ]
        );
        this.changeHasBeenMade = true;
    }
}