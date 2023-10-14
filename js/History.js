/*
0000000001 Author RomLabo
1000111000 Class History
1000000001 Created on 07/02/2023.
1000100011111000000001100001110000
1000110001111000110001100010101000
0000011000011000000001100011011000
*/

/**
 * @class History
 * @description Stores the history 
 * of changes made on the canvas.
 */
class History {
    // Private properties
    #hData; #canvas;
    #context; #storageImgData;
    #currentImgData;

    /**
     * @param {String} idOfCanvas 
     */
    constructor(idOfCanvas) {
        this.#canvas = document.getElementById(idOfCanvas);
        this.#context = this.#canvas.getContext("2d");
        this.#storageImgData = [];
        this.#currentImgData = [
            this.#context.getImageData(
                0, 0, this.#canvas.width, this.#canvas.height
            )
        ];
    }

    get data() {
        return this.#currentImgData[this.#currentImgData.length - 1];
    }

    /**
     * 
     */
    add() {
        if (this.#storageImgData.length > 0) {
            this.#storageImgData.splice(0);
        }
        this.#currentImgData.push(this.#context.getImageData(0, 0, this.#canvas.width, this.#canvas.height));
    }

    /**
     * 
     */
    back() {
        if (this.#currentImgData.length > 1) {
            this.#storageImgData.push(this.#currentImgData.pop());
            this.#context.putImageData(this.#currentImgData[this.#currentImgData.length - 1], 0, 0);
        }
    }
    
    /**
     * 
     */
    forward() {
        if (this.#storageImgData.length > 0) {
            this.#currentImgData.push(this.#storageImgData.pop());
            this.#context.putImageData(this.#currentImgData[this.#currentImgData.length - 1], 0, 0);
        }
    }
}