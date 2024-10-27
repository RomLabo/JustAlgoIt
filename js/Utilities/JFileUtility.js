/*
0000000001 Author RomLabo 111111111
1000111000 Class JFileUtility 11111
1000000001 Created on 27/10/2024 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JFileUtility
 * @description Manages the loading of png files 
 * in order to redraw them on the canvas.
 */
class JFileUtility {
    static mimeError = `Le type de l'image est invalide, 
                        seul les png sont autorisés.`;
    static sizeError = `La taille de l'image n'est pas conforme,
                        l'image semble endommagée`;
    static imgWidth = 1411;
    static imgHeight = 711;
    
    /* Private functions */

    /**
     * @description Check that file dimensions are correct.
     * @param {File} file // user selected file
     * @return {Boolean}
     */
    static #checkSize(file) {
        return file.width === this.imgWidth 
                && file.height === this.imgHeight;
    }

    /**
     * @description Check that file type are correct.
     * @param {File} file // user selected file
     * @return {Boolean}
     */
    static #checkType(file) {
        return file.type === "image/png";
    }

    /**
     * @description Draws the image loaded by the user.
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} context
     * @param {HTMLImageElement} tempImg
     */
    static #drawLoadedImg(canvas, context, tempImg) {
        context.drawImage(
            tempImg, 0, 0, this.imgWidth, this.imgHeight, 
            0, 0, canvas.width, canvas.height
        );
    }

    /* Public functions */

    /**
     * @description Throws an exception if the file
     * is not compliant, otherwise creates a string
     * containing a URL representing the file.
     * @param {File} file // user selected file
     * @return {String} // string url
     */
    static createUrl(file) {
        /*if (!this.#checkSize(file)) { 
            throw new Error(this.sizeError);
        }*/

        if (!this.#checkType(file)) {
            throw new Error(this.mimeError);
        }

        return URL.createObjectURL(file);
    }

    /**
     * @description Draw loaded image, extract and 
     * return image data.
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} context
     * @param {HTMLImageElement} tempImg
     * @return {Uint8ClampedArray} // img data
     */
    static extractData(canvas, context, tempImg) {
        this.#drawLoadedImg(canvas, context, tempImg);
        URL.revokeObjectURL(tempImg.src);
        return context.getImageData(
            0, 0, canvas.width, canvas.height
        ).data;
    }
}