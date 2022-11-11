export class File {
    constructor() {
        this.canvas = document.getElementById('main-canvas');
        this.context = this.canvas.getContext('2d');
        this.inputToLoadFile = document.getElementById('to-open-file');
        this.file = new Image();
        this.fileSize = [];
    }
    create() {
        this.context.fillStyle = "#161b22";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    openAndLoad() {
        this.inputToLoadFile.click();
        this.inputToLoadFile.addEventListener('change', (e) =>{
            this.file.src = URL.createObjectURL(e.target.files[0]);
            this.file.addEventListener('load', () => {
                this.resize();
                let coords = [(this.canvas.width - this.fileSize[0])/2, (this.canvas.height - this.fileSize[1])/2];
                this.context.drawImage(this.file, 0, 0, this.file.width, this.file.height, 0, 0, this.fileSize[0]|0, this.fileSize[1]|0)
                let imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
                let data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = data[i] === 255 ? 22 : 255 - data[i]; 
                    data[i + 1] = data[i + 1] === 255 ? 27 : 255 - data[i + 1];
                    data[i + 2] = data[i + 2] === 255 ? 34 : 255 - data[i + 2]; 
                }
                this.context.putImageData(imageData, 0, 0);
            })
        })
    }
    resize() {
        this.fileSize.push(this.file.width, this.file.height);
        while (this.fileSize[0] > this.canvas.width || this.fileSize[1] > this.canvas.height) {
            this.fileSize = this.fileSize.map(value => value * .95);
        }
    }
}