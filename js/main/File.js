export class File {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.inputToLoadFile = document.getElementById('to-open-file');
        this.file = new Image();
        this.fileSize = [];
    }
    createFile() {
        this.context.fillStyle = "#161b22";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
}