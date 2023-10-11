/*
0000000001 Author RomLabo
1000111000 Class File
1000000001 Created on 07/11/2022.
1000100011111000000001100001110000
1000110001111000110001100010101000
0000011000011000000001100011011000

Description : Handles png files, 
creation, loading, and resizing.
*/
class File {
    #err;
    constructor() {
        this.canvas = document.getElementById("main-canvas");
        this.saveCanvas = document.getElementById("save-canvas");
        
        this.context = this.canvas.getContext("2d");
        this.saveContext = this.saveCanvas.getContext("2d");

        this.inputToLoadFile = document.getElementById("to-open-file");
        this.file = new Image();
        this.fileSize = [];
        this._fData;
        this.#err = new Error("Le type de l'image est invalide, seul les png sont autorisés.")
    }

    get fData() {
        return this._fData;
    }

    create() {
        this.context.fillStyle = "#161b22";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resize() {
        let ratio = (this.canvas.width / this.file.width);
        this.fileSize.push((this.file.width * ratio)|0, (this.file.height * ratio)|0);
    }
    
    load() {
        this.inputToLoadFile.click();
        this.inputToLoadFile.addEventListener('change', (e) =>{
            this.file.src = URL.createObjectURL(e.target.files[0]);
            if (e.target.files[0].type !== "image/png") {
                throw this.#err;
            }
            this.file.addEventListener('load', () => {
                this.saveCanvas.width = this.file.width;
                this.saveCanvas.height = this.file.height;
                
                this.saveContext.drawImage(this.file, 0, 0, this.file.width, this.file.height, 0, 0, this.saveCanvas.width, this.saveCanvas.height);
                this._fData = this.saveContext.getImageData(0, 0, this.saveCanvas.width, this.saveCanvas.height).data;
            })
        })
    }
}