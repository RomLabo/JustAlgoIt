export class File {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.inputToLoadFile = document.getElementById('to-open-file');
        this.undo = document.getElementById('undo');
        this.redo = document.getElementById('redo');
        this.file = new Image();
        this.fileSize = [];
        this.fileCanvasData = [];
        this.fileDataIndex = 0;
        this.fileDataIndexRef = 0;
    }
    createFile() {
        this.context.fillStyle = "#161b22";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.fileCanvasData.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
    }
    openAndLoadFile() {
        this.inputToLoadFile.click();
        this.inputToLoadFile.addEventListener('change', (e) =>{
            this.file.src = URL.createObjectURL(e.target.files[0]);
            this.file.addEventListener('load', () => {
                this.resizeFile();
                let coords = [(this.canvas.width - this.fileSize[0])/2, (this.canvas.height - this.fileSize[1])/2];
                this.context.drawImage(this.file, 0, 0, this.file.width, this.file.height, coords[0]|0, coords[1]|0, this.fileSize[0]|0, this.fileSize[1]|0)
            })
        })
    }
    resizeFile() {
        this.fileSize.push(this.file.width, this.file.height);
        while (this.fileSize[0] > this.canvas.width || this.fileSize[1] > this.canvas.height) {
            this.fileSize = this.fileSize.map(value => value * .9);
        }
    }
    addDataFile() {
        if (this.fileCanvasData.length === 3 && this.fileDataIndex === this.fileDataIndexRef) {
            this.fileCanvasData = this.fileCanvasData.splice(1,2);
        }
        if (this.fileDataIndex !== this.fileDataIndexRef) {
            this.fileCanvasData = this.fileCanvasData.splice(this.fileDataIndex + 1, 1);
            this.fileDataIndexRef = this.fileDataIndex;
        }
        this.canvas.addEventListener('click', () => {
            this.fileCanvasData.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
            if (this.fileDataIndex < 2) {
                this.fileDataIndex ++;
                this.fileDataIndexRef ++;
            }
        }, {once: true})
    }
    undoFile() {
        if (this.fileDataIndex > 0) {
            this.fileDataIndex --;
        }
        this.context.putImageData(this.fileCanvasData[this.fileDataIndex], 0, 0);
    }
    redoFile() {
        if (this.fileDataIndex < 2) {
            this.fileDataIndex ++;
        }
        this.context.putImageData(this.fileCanvasData[this.fileDataIndex], 0, 0);
    }
}