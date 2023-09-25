/**
 * Class History
 * @author RomLabo
 * @class History
 * @description Stores the history of changes made on the canvas.
 * Created on 07/02/2023.
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