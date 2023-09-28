/*
0000000001 Author RomLabo
1000111000 Class History
1000000001 Created on 07/02/2023.
1000100011111000000001100001110000
1000110001111000110001100010101000
0000011000011000000001100011011000

Description : Stores the history 
of changes made on the canvas.
*/
class History {
    constructor() {
        this.canvas = document.getElementById('main-canvas');
        this.context = this.canvas.getContext('2d');
        this._storageImgData = [];
        this._currentImgData = [this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)];
    }
    get hData() {
        return this._currentImgData[this._currentImgData.length - 1];
    }
    add() {
        if (this._storageImgData.length > 0) {
            this._storageImgData.splice(0);
        }
        this._currentImgData.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
    }
    back() {
        if (this._currentImgData.length > 1) {
            this._storageImgData.push(this._currentImgData.pop());
            this.context.putImageData(this._currentImgData[this._currentImgData.length - 1], 0, 0);
        }
    }
    forward() {
        if (this._storageImgData.length > 0) {
            this._currentImgData.push(this._storageImgData.pop());
            this.context.putImageData(this._currentImgData[this._currentImgData.length - 1], 0, 0);
        }
    }
    /******************************************
     * Mettre à jour les positions            
     * ***************************************/ 
}