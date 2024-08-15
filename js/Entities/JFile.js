/*
0000000001 Author RomLabo 111111111
1000111000 Class JFile 111111111111
1000000001 Created on 07/11/2022 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JFile
 * @description Manages the loading of png files 
 * in order to redraw them on the canvas.
 */
class JFile {
    /* TODO: refactoring */
    
    /**
     * Private properties
     */
    #err; #fData;
    #file; #loadCanvas; 
    #loadContext; #isFile;
    #fileUrl; #fileName;
    
    /**
     * Create a JFile
     * @param {String} idOfLoadCanvas 
     */
    constructor(idOfLoadCanvas) {
        this.#loadCanvas = document.getElementById(idOfLoadCanvas);
        this.#loadContext = this.#loadCanvas.getContext("2d");

        this.#file = new Image();
        this.#fData = null;
        this.#isFile = false;
        this.#fileUrl = null;
        this.#fileName = "";
        this.#err = new Error(
            "Le type de l'image est invalide, seul les png sont autorisés."
        );
    }

    get data() { return this.#fData }
    get name() { return this.#fileName }

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
     * @param {Event} e // Load event 
     */
    load(e) {
        this.reset();
        if (e.target.files[0].type !== "image/png") {
            throw this.#err;
        }
        
        
        this.#isFile = true;
        this.#fileUrl = URL.createObjectURL(e.target.files[0]);
        
        
        this.#fileName = e.target.files[0].name.split(".png")[0];
        this.#file.src = this.#fileUrl;

        this.#file.addEventListener('load', () => {
            this.resize();
            this.drawLoadedImg()
            this.saveImgData();
            URL.revokeObjectURL(this.#fileUrl);
        }, {once: true})
    }
}