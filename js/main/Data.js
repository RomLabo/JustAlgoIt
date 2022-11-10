export class Data {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.allData = [];
        this.allDataIndex = -1;
        this.allDataPreviousIndex = -1;
    }
    add() {
        if (this.allData.length === 5 && this.allDataIndex === this.allDataPreviousIndex) {
            this.allData = this.allData.splice(1,4);
        } else if (this.allDataIndex !== this.allDataPreviousIndex) {
            this.allData = this.allData.splice(0, (this.allDataIndex + 1));
            this.allDataPreviousIndex = this.allDataIndex;
        }
        this.canvas.addEventListener('click', () => {
            this.allData.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
            if (this.allDataIndex < 4) {
                this.allDataIndex ++;
                this.allDataPreviousIndex ++;
            }
        }, {once: true})
    }
    undo() {
        this.allDataIndex > 0 ? this.allDataIndex -- : this.allDataIndex += 0;
        this.context.putImageData(this.allData[this.allDataIndex], 0, 0);
    }
    redo() {
        this.allDataIndex < (this.allData.length -1) ? this.allDataIndex ++ : this.allDataIndex += 0;
        this.context.putImageData(this.allData[this.allDataIndex], 0, 0);
    }
}