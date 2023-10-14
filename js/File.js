/*
0000000001 Author RomLabo
1000111000 Class File
1000000001 Created on 07/11/2022.
1000100011111000000001100001110000
1000110001111000110001100010101000
0000011000011000000001100011011000
*/

/**
 * @class File
 * @description Manages the loading of png files 
 * in order to redraw them on the canvas.
 */
class File {
    // Private properties
    #err; #fData;
    #file; #loadCanvas; 
    #loadContext; #isFile;
    
    /**
     * @param {String} idOfLoadCanvas 
     */
    constructor(idOfLoadCanvas) {
        this.#loadCanvas = document.getElementById(idOfLoadCanvas);
        this.#loadContext = this.#loadCanvas.getContext("2d");

        this.#file = new Image();
        this.#fData = null;
        this.#isFile = false;
        this.#err = new Error("Le type de l'image est invalide, seul les png sont autorisés.");
    }

    get data() {
        return this.#fData;
    }

    /**
     * @description Resizes the canvas used for loading, 
     * to the dimensions of the image to be loaded.
     */
    resize() {
        this.#loadCanvas.width = this.#file.width;
        this.#loadCanvas.height = this.#file.height;
    }

    /**
     * @description Reset file, file data and erase load canvas.
     */
    reset() {
        this.#file = new Image();
        this.#fData = null;
        this.#isFile = false;
        this.#loadContext.clearRect(0,0,this.#loadCanvas.width, this.#loadCanvas.height);
    }

    /**
     * @description Save image data.
     */
    saveImgData() {
        this.#fData = this.#loadContext.getImageData(
            0, 0, this.#loadCanvas.width, 
            this.#loadCanvas.height
        ).data;
    }

    /**
     * @description Draws the image loaded by the user.
     */
    drawLoadedImg() {
        this.#loadContext.drawImage(
            this.#file, 0, 0, 
            this.#file.width, 
            this.#file.height, 
            0, 0, 
            this.#loadCanvas.width, 
            this.#loadCanvas.height
        );
    }

    /**
     * @description return true if file is correctly loaded 
     * else return false.
     */
    isFileLoaded() {
        return this.#isFile;
    }

    /**
     * @description Loads the image selected by the user 
     * to redraw it on the canvas.
     */
    load(e) {
        this.reset();
        if (e.target.files[0].type !== "image/png") {
            throw this.#err;
        }

        this.#isFile = true;
        this.#file.src = URL.createObjectURL(e.target.files[0]);

        this.#file.addEventListener('load', () => {
            this.resize();
            this.drawLoadedImg()
            this.saveImgData();
            window.URL.revokeObjectURL(e.target.files[0])
        })
    }
}